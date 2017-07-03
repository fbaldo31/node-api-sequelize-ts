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
            console.error(err);
        }
        return this.sql;
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
            console.error(err);
        }
    }

    init() {
        this.sql.authenticate().then(() => {
            this.registerModels();
            this.createTablesIfNotExists();
        });
    }

    /**
     * Set models in ORM cache
     */
    registerModels() {
        const modelFiles =  utils.getFilesNameInFolder('models').filter((file: string) => {
            return (file !== 'index.js') && (file !== 'interfaces');
        });

        modelFiles.forEach((file: string, index: number) => {
            let model = this.sql.import(path.join('../models/', file));
            let name = file.split('.js')[0].toUpperCase();
            name = name.charAt(0).toUpperCase() + name.slice(1);
            this.models[name] = model;

            this.makeRelations();
            if (index === modelFiles.length -1) {
                logger.info('got models', this.models);
            }
        });
    }

    /** Tables relations */
    makeRelations() {
        if (this.models.Project) {
            this.models.Project.hasOne(this.models.User);
        }
    }

    createTablesIfNotExists(): void {
        this.getOrm().sync({force: false})
            .then(() => console.log('Database synced.'))
            .catch((error) => console.error(error));
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
