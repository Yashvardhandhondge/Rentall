import DataType from 'sequelize';
import Model from '../sequelize';

const Banner = Model.define('Banner', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataType.STRING,
        allowNull: false
    },

    content: {
        type: DataType.TEXT,
        allowNull: false
    },

    isEnable: {
        type: DataType.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },

    image: {
        type: DataType.STRING
    }
});

export default Banner; 