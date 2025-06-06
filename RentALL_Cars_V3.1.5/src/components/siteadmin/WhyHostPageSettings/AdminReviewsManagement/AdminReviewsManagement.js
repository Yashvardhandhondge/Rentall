import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { injectIntl } from 'react-intl';

import CustomPagination from '../../../CustomPagination';
import CommonTable from '../../../CommonTable/CommonTable';
import TableAction from '../../../CommonTable/TableAction';

import { deleteWhyHostReview } from '../../../../actions/siteadmin/WhyHostReview/deleteWhyHostReview';
import debounce from '../../../../helpers/debounce';
import messages from '../../../../locale/messages';
import reviewsManagement from './reviewsManagement.graphql';

import s from './AdminReviewsManagement.css';
import bt from '../../../../components/commonStyle.css';

class AdminReviewsManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      currentPage: 1,
      searchList: '',
    }

  }

  paginationData = (currentPage) => {
    const { reviewsManagement: { refetch }, setStateVariable } = this.props;
    let variables = { currentPage };
    setStateVariable({ currentPage });
    refetch(variables);
  }

  handleSearchChange = (e) => {
    const { reviewsManagement: { refetch }, setStateVariable } = this.props;
    let variables = {
      currentPage: 1,
      searchList: e?.target?.value,
    };
    setStateVariable(variables);
    refetch(variables);
  }

  deleteReview = async ({ reviewId }) => {
    const { deleteWhyHostReview, setStateVariable, currentPage } = this.props;
    const { reviewsManagement: { refetch, getWhyHostAllReviews } } = this.props;
    let variables = { currentPage: currentPage > 1 && getWhyHostAllReviews?.results?.length == 1 ? currentPage - 1 : currentPage };
    const response = await deleteWhyHostReview({ reviewId });
    if(response?.status == 200){
      await setStateVariable({ currentPage: variables?.currentPage });
      await refetch(variables);
    }
  }

  thead = () => {
    const { formatMessage } = this.props.intl;
    return [
      { data: formatMessage(messages.idLabel) },
      { data: formatMessage(messages.userNameLabel) },
      { data: formatMessage(messages.reviewContentLabel) }
    ]
  };


  tbody = () => {
    const { reviewsManagement: { getWhyHostAllReviews } } = this.props;

    return getWhyHostAllReviews?.results?.map(value => {
      return {
        id: value?.id,
        data: [
          { data: value?.id, },
          {
            data: <div>{value?.userName}<TableAction
              onClickDelete={() => this.deleteReview({ reviewId: value.id })}
              showDelete={true}
              showEdit={true}
              editLink={"/siteadmin/whyHost/review/edit/" + value.id}
            /> </div>
          },
          {
            data: value?.reviewContent
          },
        ]
      }
    })
  }

  render() {
    const { currentPage } = this.props;
    const { reviewsManagement: { getWhyHostAllReviews } } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div className={cx(s.pagecontentWrapper, 'pagecontentAR')}>
        <CommonTable
          thead={this.thead}
          tbody={this.tbody}
          title={formatMessage(messages.WhyBecomeOwnerBlock6)}
          isLink
          href={`/siteadmin/whyHost/review/add`}
          redirectionLabel={formatMessage(messages.addNewLabel)}
          isSearch
          onSearch={this.handleSearchChange}
        />
        {
          getWhyHostAllReviews?.results?.length > 0
          && <div>
            <CustomPagination
              total={getWhyHostAllReviews.count}
              currentPage={currentPage}
              defaultCurrent={1}
              defaultPageSize={10}
              change={this.paginationData}
              paginationLabel={formatMessage(messages.reviews)}
            />
          </div>
        }
      </div>
    );
  }

}

const mapState = (state) => ({});

const mapDispatch = {
  deleteWhyHostReview,
};

export default compose(injectIntl,
  withStyles(s, bt),
  connect(mapState, mapDispatch),
  graphql(reviewsManagement, {
    name: 'reviewsManagement',
    options: (props) => ({
      variables: {
        currentPage: props.currentPage,
        searchList: props.searchList,
      },
      fetchPolicy: 'network-only',
    })
  })
)(AdminReviewsManagement);