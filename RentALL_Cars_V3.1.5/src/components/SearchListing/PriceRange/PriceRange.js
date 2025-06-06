import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// External component
import Slider from 'rc-slider';

// Redux form
import { change } from 'redux-form';
// Helper
import { convert } from '../../../helpers/currencyConvertion';

// Styles
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from '!isomorphic-style-loader!css-loader!rc-slider/assets/index.css';

class PriceRange extends Component {
    static propTypes = {
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        from: PropTypes.string.isRequired,
        base: PropTypes.string.isRequired,
        rates: PropTypes.object.isRequired,
        change: PropTypes.any.isRequired,
        handleSubmit: PropTypes.any
    };

    static defaultProps = {
        min: 0,
        max: 0
    };

    constructor(props) {
        super(props);
        this.state = {
            minPrice: 0,
            maxPrice: 0
        };
        this.updateValue = this.updateValue.bind(this);
        this.onAfterChange = this.onAfterChange.bind(this);
    }

    componentDidMount() {
        const { minPrice, maxPrice } = this.props;
        this.setState({
            minPrice,
            maxPrice
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { minPrice, maxPrice } = nextProps;
        this.setState({
            minPrice,
            maxPrice
        });
    }

    async updateValue(sliderState) {
        const { change, min, max } = this.props;

        if (sliderState && sliderState.length) {
            this.setState({
                minPrice: sliderState[0],
                maxPrice: sliderState[1]
            });
            if (sliderState[0] == min && sliderState[1] == max) {
                await change('SearchForm', 'priceRangeLabel', [min, max]);
            } else {
                await change('SearchForm', 'priceRangeLabel', sliderState);
            }
        }
    }

    async onAfterChange(sliderState) {
        const { change, from, base, rates, handleSubmit, min, max } = this.props;
        let minPrice, maxPrice, values;
        values = sliderState;

        if (sliderState) {
            this.setState({
                minPrice: sliderState[0],
                maxPrice: sliderState[1]
            });
        }

        if (rates != null && rates != undefined) {
            minPrice = convert(base, rates, sliderState[0], from);
            maxPrice = convert(base, rates, sliderState[1], from);
            values = [minPrice, maxPrice];
        }
        if (sliderState[0] == min && sliderState[1] == max) {
            await change('SearchForm', 'priceRange', null);
        } else {
            await change('SearchForm', 'priceRange', values);
        }
        await change('SearchForm', 'priceRangeLabel', sliderState);
        await change('SearchForm', 'currentPage', 1);
        // await handleSubmit();
    }

    render() {
        const { min, max } = this.props;
        const { minPrice, maxPrice } = this.state;

        return (
            <div>
                <Slider
                    range
                    min={min}
                    max={max}
                    defaultValue={[min, max]}
                    value={[minPrice, maxPrice]}
                    onChange={this.updateValue}
                    onAfterChange={this.onAfterChange}
                    allowCross={true}
                    step={1}
                />
            </div>
        );
    }
}

const mapState = (state) => ({
    base: state.currency.base,
    rates: state.currency.rates
});

const mapDispatch = {
    change
};

export default withStyles(s)(connect(mapState, mapDispatch)(PriceRange));