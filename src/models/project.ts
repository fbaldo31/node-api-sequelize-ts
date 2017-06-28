import * as Sequelize from 'sequelize';

import { SqlParams } from '../config/sql-params';
/**
 * Created by Frederick BALDO on 27/06/2017.
 */
const sql = new Sequelize(SqlParams.dbName, SqlParams.user, SqlParams.pass, SqlParams.config);
export const Project = sql.define('user', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    mainImage: {
        type: Sequelize.STRING
    },
    // skills: {
    //     type: Sequelize.ARRAY
    // },
    createdAt: {
        type: Sequelize.DATE
    },
    deletedAt: {
        type: Sequelize.DATE
    }
});
