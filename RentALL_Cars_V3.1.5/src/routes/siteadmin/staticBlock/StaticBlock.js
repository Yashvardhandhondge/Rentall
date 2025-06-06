import React from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import StaticBlockForm from '../../../components/siteadmin/StaticBlockForm/StaticBlockForm';
import Loader from '../../../components/Loader/Loader';

import getStaticInfo from './getStaticInfo.graphql'

import s from './StaticBlock.css';
class StaticBlock extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      getStaticInfo: PropTypes.object,
    })
  };


  render() {
    const { data: { getStaticInfo, loading }, title } = this.props;
    let settingsCollection = {};

    if (loading) {
      return <Loader type={"text"} />;
    } else {
      getStaticInfo?.map((item, key) => {
        settingsCollection[item.name] = item.value
      });
      return <StaticBlockForm initialValues={settingsCollection} title={title} />
    }
  }

}

export default compose(
  withStyles(s),
  graphql(getStaticInfo, {
    options: (props) => ({
      ssr: true,
      fetchPolicy: 'network-only'
    })
  }),
)(StaticBlock);
