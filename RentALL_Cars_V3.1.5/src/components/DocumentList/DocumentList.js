import React, { Component } from 'react';
import { gql, graphql, compose } from 'react-apollo';
// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { injectIntl } from 'react-intl';
//GraphGL
import ShowDocumentListQuery from './ShowListDocument.graphql';
import RemoveDocumentList from './RemoveDocumentList.graphql';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { photosShow } from '../../helpers/photosShow';
import { documentuploadDir } from '../../config';

//pdf image
import pdfIcon from './pdf_image.png';
import closeIcon from '/public/SiteIcons/documentRemove.svg';
import s from './DocumentList.css';
class DocumentList extends Component {

  static defaultProps = {
    data: {
      loading: true,
      showDocumentList: []
    },
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

  }

  async handleClick(id, fileName) {
    const { mutate } = this.props;

    const { data } = await mutate({
      RemoveDocumentList,
      variables: { id },
      refetchQueries: [{ query: ShowDocumentListQuery }]
    });


    if (data && data.RemoveDocumentList && data.RemoveDocumentList.status == "success") {
      const resp = await fetch('/deleteDocuments', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
        credentials: 'include',
      });
      const { status } = await resp.json();
      showToaster({ messageId: 'documentRemoved', toasterType: 'success' })
    }
  }


  render() {
    const { data: { ShowDocumentList }, data } = this.props;
    let path = photosShow(documentuploadDir);

    return (
      <div className={cx('row')}>
        {
          ShowDocumentList && ShowDocumentList.map((item, key) => {

            let icon = item.fileType == 'application/pdf' ? pdfIcon : (path + item.fileName);
            return (
              <div key={key} className={cx('col-lg-4 col-md-4 col-sm-6 col-xs-12 text-center')}>
                <div className={s.realtive}>
                  <a href={path + item.fileName} target="_blank">
                    <div className={s.listPhotoCover}>
                      <div className={s.listPhotoMedia}>
                        <img className={s.imgResponsive} src={icon} />
                      </div>
                    </div>
                  </a>
                  <a href="javascript:void(0);" onClick={() => this.handleClick(item.id, item.fileName)} className={cx(s.position, 'positionDocumentRTL')}>
                    <img src={closeIcon} />
                  </a>
                </div>
              </div>
            );

          })
        }
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(s),
  graphql(ShowDocumentListQuery, {
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(RemoveDocumentList, {
    options: {
      fetchPolicy: 'network-only'
    }
  }),
)(DocumentList);





