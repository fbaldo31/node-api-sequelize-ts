import * as Sequelize from 'sequelize';
import { DataTypes, SequelizeStatic } from 'sequelize';

import { SqlParams } from '../config/sql-params';
/**
 * Created by Frederick BALDO on 27/06/2017.
 */
const sql = new Sequelize(SqlParams.dbName, SqlParams.user, SqlParams.pass, SqlParams.config);

export default function Project(sequelize: SequelizeStatic, dataTypes: DataTypes): Sequelize.Model<any, any> {
    return sql.define<any, any>('project', {
        id: {type: dataTypes.INTEGER, allowNull: false, primaryKey: true},
        name: {type: dataTypes.STRING, allowNull: false, primaryKey: true},
        // description: {type: dataTypes.TEXT, allowNull: true},
        userId: {type: dataTypes.INTEGER},
        createdAt: {type: dataTypes.DATE},
        deletedAt: {type: dataTypes.DATE},
    }, {
        indexes: [],
        classMethods: {},
        timestamps: false
    });
}
