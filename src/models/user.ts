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
        id: {type: dataTypes.INTEGER, allowNull: false, primaryKey: true},
        name: {type: dataTypes.STRING, allowNull: false, primaryKey: true},
        // description: {type: dataTypes.TEXT, allowNull: true},
        firstName: {type: dataTypes.STRING},
        lastName: {type: dataTypes.STRING},
        email: {type: dataTypes.STRING},
        password: {type: dataTypes.STRING},
        avatar: {type: dataTypes.STRING},
    }, {
        indexes: [],
        classMethods: {},
        timestamps: false
    });
}
