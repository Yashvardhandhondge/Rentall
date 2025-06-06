import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { injectIntl } from 'react-intl';

import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import CustomPagination from '../../CustomPagination';
import AdminRolesModal from '../AdminRolesModal';
import CommonTable from '../../CommonTable/CommonTable';
import TableAction from '../../CommonTable/TableAction';

import { openAdminRolesModal } from '../../../actions/siteadmin/modalActions';
import { deleteAdminRole } from '../../../actions/siteadmin/AdminRoles/manageAdminRoles';
import adminRolesQuery from './adminRolesQuery.graphql';
import messages from '../../../locale/messages';
import debounce from '../../../helpers/debounce';

import s from './AdminRolesManagement.css';
import cs from '../../../components/commonStyle.css';

class AdminRolesManagement extends React.Component {

  static propTypes = {
    adminRoles: PropTypes.array,
    title: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      searchList: '',
      typing: false,
      typingTimeout: 0
    }
  }
  paginationData = (currentPage) => {
    const { adminRoles: { refetch }, setStateVariable } = this.props;
    let variables = { currentPage };
    setStateVariable(variables);
    refetch(variables);
  }
  handleDelete = async (id) => {
    const { adminRoles: { refetch, getAllAdminRoles }, setStateVariable, currentPage } = this.props;
    const { deleteAdminRole } = this.props;
    let variables = { currentPage: currentPage > 1 && getAllAdminRoles?.results?.length == 1 ? currentPage - 1 : currentPage };
    const response = await deleteAdminRole(id);
    if (response?.status == 200) {
      await setStateVariable(variables);
      await refetch(variables);
    }
  }
  handleKeywordSearch = (e) => { // Keyword search
    const { adminRoles: { refetch }, setStateVariable } = this.props;
    let variables = {
      currentPage: 1,
      searchList: e?.target?.value
    };
    setStateVariable(variables);
    refetch(variables);
  }

  handleModalopen = (value) => {
    const { openAdminRolesModal } = this.props;
    if (value) openAdminRolesModal('edit', value)
    else openAdminRolesModal('add')
  }

  thead = () => {
    const { formatMessage } = this.props.intl;
    return [
      { data: formatMessage(messages.idLabel) },
      { data: formatMessage(messages.name) },
      { data: formatMessage(messages.descriptionAdminLabel) }
    ]
  };


  tbody = () => {
    const { adminRoles: { getAllAdminRoles } } = this.props;
    return getAllAdminRoles?.results?.map((value, key) => {
      return {
        id: key,
        data: [
          { data: value.id },
          {
            data: <div className={cx(cs.displayFlex, cs.alignCenter, cs.spaceBetween)}>
              {value?.name}
              <TableAction
                onClickDelete={() => this.handleDelete(value.id)}
                showDelete={true}
                showEdit={true}
                editAction={() => this.handleModalopen(value)}
              /> </div>
          },
          { data: value.description },
        ]
      }
    })
  }

  render() {
    const { adminRoles: { getAllAdminRoles } } = this.props;
    const { currentPage } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div className={cx(s.pagecontentWrapper)}>
        <AdminRolesModal paginationData={this.paginationData} />
        <CommonTable
          thead={this.thead}
          tbody={this.tbody}
          title={formatMessage(messages.manageAdminRoles)}
          isLink
          addAction={this.handleModalopen}
          redirectionLabel={formatMessage(messages.addNewLabel)}
          isSearch
          onSearch={(e) => debounce(this.handleKeywordSearch(e))}
        />
        {
          getAllAdminRoles?.count > 0
          && <div>
            <CustomPagination
              total={getAllAdminRoles.count}
              currentPage={currentPage}
              defaultCurrent={1}
              defaultPageSize={10}
              change={this.paginationData}
              paginationLabel={formatMessage(messages.roles)}
            />
          </div>
        }
      </div>
    );
  }

}

const mapState = (state) => ({});

const mapDispatch = {
  openAdminRolesModal,
  deleteAdminRole
};

export default compose(
  injectIntl,
  withStyles(s, cs),
  connect(mapState, mapDispatch),
  graphql(adminRolesQuery, {
    name: 'adminRoles',
    options: (props) => ({
      variables: {
        searchList: props.searchList,
        currentPage: props.currentPage,
      },
      fetchPolicy: 'network-only',
      ssr: true
    })
  }),
)(AdminRolesManagement);