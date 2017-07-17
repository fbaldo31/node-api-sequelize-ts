// import * as SequelizeStatic from 'sequelize';

import { SqlParams } from '../config/sql-params';

import * as Sequelize from "sequelize";
import { DataTypes, SequelizeStatic } from "sequelize";
/**
 * Created by Frederick BALDO on 27/06/2017.
 */
const sql = new Sequelize(SqlParams.dbName, SqlParams.user, SqlParams.pass, SqlParams.config);
export default function User(sequelize: SequelizeStatic, dataTypes: DataTypes): Sequelize.Model<any, any> {
    return sql.define<any, any>('user', {
        name: {type: dataTypes.STRING, allowNull: false},
        firstName: {type: dataTypes.STRING},
        lastName: {type: dataTypes.STRING},
        email: {type: dataTypes.STRING, allowNull: false},
        password: {type: dataTypes.STRING, allowNull: false},
        avatar: {type: dataTypes.STRING},
        createdAt: {type: dataTypes.DATE},
        updatedAt: {type: dataTypes.DATE},
        deletedAt: {type: dataTypes.DATE},
        role: {type: dataTypes.STRING}
    }, {
        indexes: [],
        classMethods: {},
        timestamps: false
    });
}
