import * as Sequelize from 'sequelize';
import { DataTypes, SequelizeStatic } from 'sequelize';

import { SqlParams } from '../config/sql-params';
/**
 * Created by Frederick BALDO on 27/06/2017.
 */
const sql = new Sequelize(SqlParams.dbName, SqlParams.user, SqlParams.pass, SqlParams.config);

export default function Skill(sequelize: SequelizeStatic, dataTypes: DataTypes): Sequelize.Model<any, any> {
    return sql.define<any, any>('skill', {
        name: {type: dataTypes.STRING, allowNull: false },
        createdAt: {type: dataTypes.DATE},
        updatedAt: {type: dataTypes.DATE},
        deletedAt: {type: dataTypes.DATE}
    }, {
        indexes: [],
        classMethods: {},
        timestamps: false
    });
}
