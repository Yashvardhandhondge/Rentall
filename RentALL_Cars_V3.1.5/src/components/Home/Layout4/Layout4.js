import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import SearchForm from '../SearchForm/SearchForm';
import s from './Layout4.css';
import bt from '../../commonStyle.css';

class Layout4 extends React.Component {


  render() {
    const { title, content, bannerImage } = this.props;
    return (
      <div className={s.bgCss} style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className={s.sectionWidth}>
          <SearchForm id={'layoutFour'}/>
          <div>
            <h1 className={cx(s.bannerCaptionText, bt.paddingTop5)}>
              {title}
              {' '} {content}
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s, bt)(Layout4);