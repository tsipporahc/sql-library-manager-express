'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Book.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false, // disallow null
                validate: {
                    notEmpty: true,
                    // custom error message
                    msg: 'Please provide a value for "title"',
                },
            },
            author: {
                type: DataTypes.STRING,
                allowNull: false, // disallow null
                validate: {
                    notEmpty: true,
                    // custom error message
                    msg: 'Please provide a value for "author"',
                },
            },
            genre: DataTypes.STRING,
            year: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Book',
        }
    );
    return Book;
};
