import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import DropzoneComponent from 'react-dropzone-component';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!./filepicker.css';
import {
    doUploadProfilePicture,
    doRemoveProfilePicture,
    startProfilePhotoLoader,
    stopProfilePhotoLoader
} from '../../../actions/manageUserProfilePicture';
import editIcon from '/public/SiteIcons/editingWishIcon.svg';
import cs from '../../../components/commonStyle.css';
import showToaster from '../../../helpers/toasterMessages/showToaster';

class Dropzone extends Component {

    static propTypes = {
        doUploadProfilePicture: PropTypes.any.isRequired,
        doRemoveProfilePicture: PropTypes.any.isRequired,
        startProfilePhotoLoader: PropTypes.any.isRequired,
        guestPicture: PropTypes.string,
        formatMessage: PropTypes.any,
    };

    constructor(props) {
        super(props);
        this.success = this.success.bind(this);
        this.removeExistingFile = this.removeExistingFile.bind(this);
        this.addedfile = this.addedfile.bind(this);
        this.error = this.error.bind(this);
        this.dropzone = null;
    }

    componentDidMount() {
        const isBrowser = typeof window !== 'undefined';
        const isDocument = typeof document !== undefined;
        if (isBrowser && isDocument) {
            document.querySelector(".dz-hidden-input").style.visibility = 'visible';
            document.querySelector(".dz-hidden-input").style.opacity = '0';
            document.querySelector(".dz-hidden-input").style.height = '100%';
            document.querySelector(".dz-hidden-input").style.width = '100%';
            document.querySelector(".dz-hidden-input").style.cursor = 'pointer';
        }
    }

    componentDidUpdate() {
        const isBrowser = typeof window !== 'undefined';
        const isDocument = typeof document !== undefined;
        if (isBrowser && isDocument) {
            document.querySelector(".dz-hidden-input").style.visibility = 'visible';
            document.querySelector(".dz-hidden-input").style.opacity = '0';
            document.querySelector(".dz-hidden-input").style.height = '100%';
            document.querySelector(".dz-hidden-input").style.width = '100%';
            document.querySelector(".dz-hidden-input").style.cursor = 'pointer';
        }
    }

    success(file, fromServer) {
        const { doUploadProfilePicture, guestPicture, stopProfilePhotoLoader, startProfilePhotoLoader } = this.props;
        let fileName = fromServer.file.filename;
        startProfilePhotoLoader();
        doUploadProfilePicture(fileName, guestPicture);
        stopProfilePhotoLoader();
    }

    async error(file) {
        const { stopProfilePhotoLoader } = this.props;
        let fileFormates = [
            'image/svg+xml',
            'application/sql',
            'application/pdf',
            'application/vnd.oasis.opendocument.presentation',
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/epub+zip',
            'application/zip',
            'text/plain',
            'application/rtf',
            'application/vnd.oasis.opendocument.text',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.spreadsheet',
            'text/tab-separated-values'
        ];
        this.dropzone.removeFile(file);
        if (file && (file?.accepted === false || fileFormates.indexOf(file?.type) >= 0)) {
            showToaster({ messageId: 'invalidImageFile', toasterType: 'error' })
            await stopProfilePhotoLoader();
            return;
        }
    }
    async addedfile(file, fromServer) {
        const { stopProfilePhotoLoader, maxUploadSize } = this.props;
        let isOnline = typeof window !== 'undefined' && window.navigator.onLine;

        if(!isOnline) {
			showToaster({ messageId: 'offlineError', toasterType: 'error' })
			this.dropzone.removeFile(file);
			return;
		}
        if (file?.size > (1024 * 1024 * parseInt(maxUploadSize))) {
            showToaster({ messageId: 'maximumUploadSize', toasterType: 'error' })
            this.dropzone.removeFile(file);
            stopProfilePhotoLoader();
        }
    }

    removeExistingFile(fileName) {
        const { doRemoveProfilePicture } = this.props;
        this.dropzone.removeAllFiles();
        doRemoveProfilePicture(fileName);
    }

    render() {
        const { formatMessage } = this.props.intl;
        const { defaultMessage, className, iconPosition } = this.props;
        const djsConfig = {
            dictDefaultMessage: '',
            addRemoveLinks: false,
            uploadMultiple: false,
            maxFilesize: 10,
            acceptedFiles: 'image/jpeg,image/png',
            dictMaxFilesExceeded: 'Remove the existing image and try upload again',
            previewsContainer: false,
            hiddenInputContainer: '.dzInputContainer'
        };
        const componentConfig = {
            iconFiletypes: ['.jpg', '.png'],
            postUrl: '/uploadProfilePhoto'
        };
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            success: this.success,
            addedfile: this.addedfile,
            error: this.error
        };

        return (
            <div className={className}>
                <div className={cx('dzInputContainer', 'dropZoneBox')}>
                    <DropzoneComponent
                        config={componentConfig}
                        eventHandlers={eventHandlers}
                        djsConfig={djsConfig}
                    >
                        <img src={editIcon} className={cx(cs.dropzoneImgSpace, iconPosition, 'dropzoneImgSpaceRTL')} />
                        {defaultMessage}
                    </DropzoneComponent>
                </div>
            </div>
        );
    }
}

const mapState = (state) => ({
    maxUploadSize: state.siteSettings.data.maxUploadSize
});

const mapDispatch = {
    doUploadProfilePicture,
    doRemoveProfilePicture,
    startProfilePhotoLoader,
    stopProfilePhotoLoader
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Dropzone)));
