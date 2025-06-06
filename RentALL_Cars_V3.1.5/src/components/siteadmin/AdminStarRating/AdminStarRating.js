import React from 'react';
import PropTypes from 'prop-types';

import StarRatingComponent from 'react-star-rating-component';
import { COMMON_COLOR } from '../../../constants/index'; 

class AdminStarRating extends React.Component {

    static propTypes = {
      name: PropTypes.string.isRequired,
      className: PropTypes.string,
      change: PropTypes.any,
      editing: PropTypes.bool,
      value: PropTypes.number
    }; 

    static defaultProps = {
      editing: true,
      value: 0 
    };

    constructor (props) {
      super (props);  
      this.state = {
        rating: 0
      }
      this.onStarClick= this.onStarClick.bind(this);
    }
  
    onStarClick(nextValue, prevValue, name) {
      const {change} = this.props;
      this.setState({rating: nextValue});
      change(nextValue);
    }

    render() {
      const { rating } = this.state;
      const { className, name, editing, value } = this.props;
      return (
        <div className={className}>
          <StarRatingComponent 
            name={name}
            starCount={5}
            editing={editing}
            value={value}
            starColor={COMMON_COLOR}
            emptyStarColor={`#7D7D7D`}
            onStarClick={this.onStarClick}
          />
        </div>
      );
    }
}

export default AdminStarRating;
 

