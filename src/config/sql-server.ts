// /**
//  * Sequelize db server config connection
//  * @author: Frederick BALDO
//  * @Date: 27/06/2017.
//  */
// import * as Sequelize from 'sequelize';
//
// import { User } from '../models/index';
// import { SqlParams } from './sql-params';
//
// /**
//  * Used for getting active connection
//  * @returns {Sequelize}
//  */
// function connect() {
//     try {
//         return new Sequelize(SqlParams.dbName, SqlParams.user, SqlParams.pass, SqlParams.config);
//         // console.log(this.sql);
//     } catch (err) {
//         console.error(err);
//     }
//     return this;
// }
//
// class DbConnection {
//     public sql: any;
//     private params = {
//         dbName: 'master',
//         user: 'ROOT',
//         pass: 'toor',
//         config: {
//             host: 'DESKTOP-N81OPVP',
//             dialect: 'mssql'            // 'mysql'|'sqlite'|'postgres'
//         }
//     };
//
//     /**
//      * Connect the App the the default database
//      */
//     constructor() {
//         this.sql = connect();
//     }
//
//     /** Get the active connection if exists */
//     public getActiveConnection() {
//         return this.sql;
//     }
//
//     /**
//      * Connect the App the the given database
//      * @param dbName
//      */
//     public connectToThisDB(dbName: string) {
//         let params = this.params;
//         params.dbName = dbName;
//         try {
//             this.sql = new Sequelize(params.dbName, params.user, params.pass, params.config);
//
//             // console.log(this.sql);
//         } catch (err) {
//             console.error(err);
//         }
//     }
//
//     authenticate() {
//         return this.sql.authenticate();
//     }
//
//     public static createTables() {
//         User.sync({force: false}) // Use true to delete table before
//             .then(
//                 () => console.log('User table found'),
//                 error => console.error(error)
//             );
//     }
//
// }
//
// export { connect, DbConnection };
