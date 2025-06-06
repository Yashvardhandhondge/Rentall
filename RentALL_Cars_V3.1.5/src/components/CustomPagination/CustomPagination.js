import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col
} from 'react-bootstrap';
import Pagination from 'rc-pagination';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader/!css-loader!./index.css';
import { FormattedMessage, injectIntl } from 'react-intl';
// Locale
import messages from '../../locale/messages';
import { change } from 'redux-form';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

class CustomPagination extends Component {

    static propTypes = {
        total: PropTypes.number.isRequired,
        defaultCurrent: PropTypes.number.isRequired,
        defaultPageSize: PropTypes.number.isRequired,
        change: PropTypes.any.isRequired,
        currentPage: PropTypes.number.isRequired,
        paginationLabel: PropTypes.string
    };

    static defaultProps = {
        paginationLabel: 'items'
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.renderShowTotal = this.renderShowTotal.bind(this);
    }

    handleChange(currentPage, size) {
        const { change } = this.props;
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        change(currentPage);
    }

    renderShowTotal(total, range) {
        const { paginationLabel } = this.props;

        return (
            <div className={s.resultsCount}>
                <span>{range[0]}</span>
                <span>&nbsp;–&nbsp;</span>
                <span>{range[1]}</span>
                <span className='displayInlineRTL'>&nbsp;<FormattedMessage {...messages.of} />&nbsp;</span>
                <span>{total}</span>
                <span>&nbsp;{paginationLabel}</span>
            </div>
        );
    }

    render() {
        const { total, defaultCurrent, defaultPageSize, currentPage } = this.props;
        const locale = { prev_page: 'Previous', next_page: 'Next' };
        return (
            <div className={"spaceTop4 spaceBottom4 tripPagination positionRelative"}>
                <Pagination
                    className="ant-pagination"
                    defaultCurrent={defaultCurrent}
                    current={currentPage}
                    total={total}
                    defaultPageSize={defaultPageSize}
                    onChange={this.handleChange}
                    showTotal={(total, range) => this.renderShowTotal(total, range)}
                    locale={locale}
                    showLessItems
                />
            </div>
        );
    }


}
export default compose(withStyles(s), injectIntl)(CustomPagination);
