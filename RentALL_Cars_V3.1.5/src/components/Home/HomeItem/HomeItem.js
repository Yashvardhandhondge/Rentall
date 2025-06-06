import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col } from 'react-bootstrap';
import cx from 'classnames';
import { FcFlashOn } from 'react-icons/fc';
import { injectIntl } from 'react-intl';

// Component
import StarRating from '../../StarRating';
import CurrencyConverter from '../../CurrencyConverter';
import ListCoverPhoto from '../../ListCoverPhoto';
import WishListIcon from '../../WishListIcon';

// Locale
import messages from '../../../locale/messages';
// Helpers
import { formatURL } from '../../../helpers/formatURL';
import { photosShow } from '../../../helpers/photosShow';
import { fileuploadDir } from '../../../config';

import s from './HomeItem.css';

class HomeSlider extends React.Component {

  static propTypes = {
    formatMessage: PropTypes.func,
    id: PropTypes.number,
    photo: PropTypes.string.isRequired,
    beds: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    basePrice: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    roomType: PropTypes.string.isRequired,
    bookingType: PropTypes.string.isRequired,
    listPhotos: PropTypes.array.isRequired,
    coverPhoto: PropTypes.number,
    reviewsCount: PropTypes.number,
    reviewsStarRating: PropTypes.number,
    wishListStatus: PropTypes.bool,
    isListOwner: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.randomStyleClass = this.randomStyleClass.bind(this);
  }

  randomStyleClass() {
    let styleClasses = {
      0: s.textDarkBlue,
      1: s.textLightBlue,
      3: s.textLightBrown,
      5: s.textBrown,
      6: s.textMaroon,
      7: s.textDarkBrown,
      8: s.textMediumBrown,
      9: s.textSkyBlue
    };

    let currentIndex = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    return styleClasses[currentIndex];
  }

  render() {
    const { id, photo, basePrice, currency, roomType, beds, title, bookingType } = this.props;
    const { listPhotos, coverPhoto, reviewsCount, reviewsStarRating, wishListStatus, isListOwner } = this.props;
    const { formatMessage } = this.props.intl;
    let imagePath, starRatingValue = 0, path;
    path = photosShow(fileuploadDir)
    imagePath = `${path}x_medium_` + photo;

    starRatingValue = 0;
    if (reviewsCount > 0 && reviewsStarRating > 0) {
      starRatingValue = Math.round(reviewsStarRating / reviewsCount)
    }
    return (
      <div>
        <div className={cx(s.imgContainer)}>
          {
            !isListOwner && <WishListIcon listId={id} key={id} isChecked={wishListStatus} />
          }
          <div className={cx(s.parent)}>
            <div className={cx(s.children)}>
              <div className={cx(s.content)}>
                <a href={"/cars/" + formatURL(title) + '-' + id} target={'_blank'}>
                  <ListCoverPhoto
                    className={cx(s.imageContent)}
                    coverPhoto={coverPhoto}
                    listPhotos={listPhotos}
                    photoType={"x_medium"}
                    bgImage
                  />
                </a>

              </div>
            </div>
          </div>
        </div>
        <div className={s.infoContainer}>
          <a className={s.linkContainer} href={"/cars/" + formatURL(title) + '-' + id} target={'_blank'}>
            <Row>
              <Col
                xs={12}
                sm={12}
                md={12}
                className={cx(s.space1, s.textEllipsis, s.infoDesc, s.infoText, s.infoSpace)}>
                <div className={cx(s.listingInfo)}>
                  <span>{roomType}</span>
                  <span>&nbsp;&#183;&nbsp;</span>
                  <span>{beds} {beds > 1 ? 'beds' : 'bed'}</span>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                className={cx(s.textStrong, s.space1, s.textEllipsis, s.infoTitle, s.infoText)}
              >
                <span className={s.roomTitleBlock}>
                  <CurrencyConverter
                    amount={basePrice}
                    from={currency}
                  />
                  {
                    bookingType === "instant" && <span><FcFlashOn className={s.instantIcon} /></span>
                  }
                </span>
                <span>{title}</span>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                className={cx(s.textEllipsis, s.infoReview, s.infoText, 'small-star-rating')}>
                <StarRating className={s.reviewStar} value={starRatingValue} name={'review'} />
                <span className={s.reviewText}>
                  {reviewsCount} {reviewsCount > 1 ? formatMessage(messages.reviews) : formatMessage(messages.review)}
                </span>
              </Col>
            </Row>
          </a>
        </div>
      </div>
    );
  }
}

export default injectIntl(withStyles(s)(HomeSlider));
