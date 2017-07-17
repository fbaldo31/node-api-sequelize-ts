import * as SequelizeStatic from 'sequelize';
import { Sequelize } from 'sequelize';
import * as path from 'path';

import { ExampleModels } from '../models/index';
import { utils } from '../config/utils';
import { SqlParams } from '../config/sql-params';
import {logger} from "./logger.service";
/**
 * Sequelize db server config connection
 * @Class DatabaseService
 * @author Frederick BALDO
 * @Date 30/06/2017.
 */
class DatabaseService {
    public sql: Sequelize;
    public models: ExampleModels = ({} as any);
    private params = {
        dbName: 'master',
        user: 'ROOT',
        pass: 'toor',
        config: {
            host: 'DESKTOP-N81OPVP',
            dialect: 'mssql'            // 'mysql'|'sqlite'|'postgres'
        }
    };

    /**
     * Connect the App the the default database
     */
    connect() {
        try {
            this.sql = new SequelizeStatic(SqlParams.dbName, SqlParams.user, SqlParams.pass, SqlParams.config);
        } catch (err) {
            logger.error(err);
        }
        return this.sql;
    }

    createMigrationDB() {
        this.connectToThisDB('baseA');
        this.connectToThisDB('baseB');
    }

    /**
     * Connect the App the the given database
     * @param dbName
     */
    public connectToThisDB(dbName: string) {
        let params = this.params;
        params.dbName = dbName;
        try {
            this.sql = new SequelizeStatic(params.dbName, params.user, params.pass, params.config);
        } catch (err) {
            logger.error(err);
        }
    }

    init() {
        this.sql.authenticate()
            .then(() => { logger.info('Database connected'); })
            .catch(error => logger.error(error.message));
        this.registerModels('models');
    }

    /**
     * Set models in ORM cache and create the tables if not exists
     * @param pathToFolder
     */
    registerModels(pathToFolder: string): void {
        const modelFiles =  utils.getFilesNameInFolder(pathToFolder).filter((file: string) => {
            return (file !== 'index.js') && (file !== 'interfaces');
        });

        if (modelFiles.length)
        {
            modelFiles.forEach((file: string, index: number) =>
            {
                file = file.split('.js')[0];
                let model = this.sql.import(__dirname + '/../' + pathToFolder + '/' + file);

                // let name = file.split('.js')[0];
                let name = file.charAt(0).toUpperCase() + file.slice(1);
                this.models[name] = model;
                this.models[name].sync({alter: true}); // force: true to drop the tables before

                if (index === modelFiles.length -1) {
                    console.log('got models', this.models);
                    this.makeRelations();
                }
            });
        }
    }

    /** Tables relations */
    makeRelations() {
        if (this.models.Project && this.models.User) {
            // this.models.User.hasOne(this.models.Project);
        }
    }

    getModels() {
        return this.models;
    }

    getOrm() {
        return this.sql;
    }
}

export const dbManager = new DatabaseService();
export const models = dbManager.getModels();
