import React from 'react';
import cx from 'classnames';
import { injectIntl } from 'react-intl';
import Swiper from 'react-id-swiper';
import { connect } from 'react-redux';

import ImageSlider from '../ViewListing/ImageSlider/ImageSlider';

import { openImageLightBox, closeImageLightBox } from '../../actions/ImageLightBox';
import { photosShow } from '../../helpers/photosShow';
import { claimImagesUploadDir } from '../../config';
import { isRTL } from '../../helpers/formatLocale';
import { COMMON_TEXT_COLOR } from '../../constants/index';

import closeIcon from '/public/SiteIcons/claimPhotoClose.svg';

import s from './HostClaimModal.css'

const nextArrowStyle = {
    right: '-5px',
    background: '#fff', color: COMMON_TEXT_COLOR, zIndex: '5', width: '27px', height: '27px', top: '40%',
    fontSize: '40px', cursor: 'pointer', borderRadius: '50%', textAlign: 'center',
    border: '2px solid transparent', boxShadow: '0px 0px 4px 0px #484848', position: 'absolute'
};

const prevArrowStyle = {
    left: '-8px',
    background: '#fff', color: COMMON_TEXT_COLOR, zIndex: '5', width: '27px', height: '27px', top: '40%',
    fontSize: '40px', cursor: 'pointer', borderRadius: '50%', textAlign: 'center',
    border: '2px solid transparent', boxShadow: '0px 0px 4px 0px #484848', position: 'absolute'
};

function SampleNextArrow(props) {
    const { className, style, onClick } = props
    return (
        <div
            className={className}
            style={nextArrowStyle}
            onClick={onClick}
        >
            <svg viewBox="0 0 18 18" role="img" aria-label="Previous" focusable="false"
                style={{ height: '12px', width: '12px', display: 'block', fill: '#484848', position: 'absolute', top: '27%', right: '6px' }}>
                <path d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z"></path>
            </svg>

        </div>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props
    return (
        <div
            className={className}
            style={prevArrowStyle}
            onClick={onClick}
        >
            <svg viewBox="0 0 18 18" role="img" aria-label="Previous" focusable="false"
                style={{ height: '12px', width: '12px', display: 'block', fill: '#484848', position: 'absolute', top: '27%', left: '5px' }}>
                <path d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z"></path>
            </svg>

        </div>
    );
}

class ClaimImagesSlider extends React.Component {
    state = { isBeginning: true, isEnd: false };

    constructor(props) {
        super(props);
        this.swiper = React.createRef();
    }

    goNext = () => {
        const { current } = this.swiper;
        current?.swiper?.slideNext();
        this.progress();
    }

    goPrev = () => {
        const { current } = this.swiper;
        current?.swiper?.slidePrev();
        this.progress();
    }

    progress = () => {
        const { current } = this.swiper;
        this.setState({ isEnd: current?.swiper?.isEnd, isBeginning: current?.swiper?.isBeginning });
    }

    openSliderClick = (index) => {
        const { openImageLightBox } = this.props;
        let root = document.getElementsByTagName('html')[0];
        root.classList.add('scrollHidden');
        openImageLightBox(index);
    }

    render() {
        const { data, slidesPerView, intl: { locale }, arrow, claimed, removeImage, openImageLightBox, imageLightBox, closeImageLightBox, isUploadComplete } = this.props;
        const { isBeginning, isEnd } = this.state;
        const params = {
            speed: 600,
            parallax: true,
            parallaxEl: {
                el: '.parallax-bg',
                value: '-23%'
            },
            slidesPerView: `${slidesPerView}`,
            spaceBetween: 20,
        }
        let imagePath = photosShow(claimImagesUploadDir)

        return (
            <div className={cx(s.positionRelative, s.sliderBottom, 'claimModalSlider', 'claimModalSliderRTL', { ['claimModalImgCloseIcon']: !claimed }, { ['claimedModalSlider']: claimed })}>
                <ImageSlider
                    imageLightBox={imageLightBox}
                    closeImageLightBox={closeImageLightBox}
                    sources={data.map(value => ({ src: `${imagePath}x_medium_${value}` }))}
                />
                <Swiper {...params} rtl={isRTL(locale)} ref={this.swiper} className={cx('row homeSlickSlider')}>
                    {
                        data && data.map((item, index) => {
                            return (<div className={cx(s.claimImageSection, 'claimImageSection')}>
                                <div className={s.bgImage} style={{ backgroundImage: `url(${imagePath}x_medium_${item}` }} onClick={() => !isUploadComplete && this.openSliderClick(index)}></div>
                                {!claimed && <a onClick={() => removeImage(item)}><img src={closeIcon} className={cx(s.closeIcon, 'claimImageCloseIconRTL')} /></a>}
                            </div>
                            )
                        })
                    }
                </Swiper>
                <div>
                    {arrow && data && data.length > (slidesPerView) && !isBeginning && <SamplePrevArrow className={cx('prevRTL')} onClick={this.goPrev} />}
                    {arrow && data && data.length > (slidesPerView) && !isEnd && <SampleNextArrow className={cx('nextRTL')} onClick={this.goNext} />}
                </div>
            </div>
        )
    }
}
const mapState = (state) => ({
    imageLightBox: state?.viewListing?.imageLightBox
})
const mapDispatch = ({
    openImageLightBox,
    closeImageLightBox
})
export default injectIntl(connect(mapState, mapDispatch)(ClaimImagesSlider));