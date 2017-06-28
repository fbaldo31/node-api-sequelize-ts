import * as Sequelize from 'sequelize';

import { SqlParams } from '../config/sql-params';
/**
 * Created by Frederick BALDO on 27/06/2017.
 */
const sql = new Sequelize(SqlParams.dbName, SqlParams.user, SqlParams.pass, SqlParams.config);
export const User = sql.define('user', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    userName: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    avatar: {
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
