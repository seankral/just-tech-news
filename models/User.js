const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model { }

// define table columns and configuration
User.init(
    {
        // id column
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // stops from allowing duplicate email values
            unique: true,
            // validation
            validate: {
                isEmail: true
            }
        },
        // password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // minimum length of 4
                len: 4
            }
        }
    },
    {
        hooks: {
            // beforeCreate lifecycle hook functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // has password after PUT route
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;