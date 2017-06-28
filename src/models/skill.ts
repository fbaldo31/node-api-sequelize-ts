import * as Sequelize from 'sequelize';

import { SqlParams } from '../config/sql-params';
/**
 * Created by Frederick BALDO on 27/06/2017.
 */
const sql = new Sequelize(SqlParams.dbName, SqlParams.user, SqlParams.pass, SqlParams.config);
export const Skill = sql.define('skill', {
    name: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE
    },
    deletedAt: {
        type: Sequelize.DATE
    }
});
