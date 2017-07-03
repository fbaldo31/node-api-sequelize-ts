import { Transaction } from 'sequelize';

import { AbstractModelService } from './abstract.model.service';
import Project from '../models/project';
/**
 * Created by Frederick BALDO on 01/07/2017.
 */
class projectService extends AbstractModelService {

    getAllProjects(): Promise<Array<any>> {
        let promise = new Promise<Array<any>>((resolve: Function, reject: Function) => {
            this.db.transaction((t: Transaction) => {
                return this.models.Project.findAll().then((products: Array<any>) => {
                    this.logger.info('Get all projects.');
                    resolve(products);
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                });
            });
        });

        return promise;
    }

    create(project: any): Promise<any> {
        let promise = new Promise<any>((resolve: Function, reject: Function) => {
            this.db.transaction((t: Transaction) => {
                return this.models.Project.create(project).then((product: any) => {
                    this.logger.info(`Created project with name ${project.name}.`);
                    resolve(product);
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                });
            });
        });

        return promise;
    }

    getOneById(projectId: string): Promise<any> | any{
        let project: any;
        let promise = new Promise<any>((resolve: Function, reject: Function) => {
            this.db.transaction((t: Transaction) => {
                project = this.models.Project.findOne({where: {id: projectId}}).then((product: any) => {
                    if (product) {
                        this.logger.info(`Retrieved project with name ${projectId}.`);
                    } else {
                        this.logger.info(`Project with name ${projectId} does not exist.`);
                    }
                    resolve(product);
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                });
            });
        });
        return project || promise;
    }

    update(projectId: number, project: any): Promise<void> {
        let promise = new Promise<void>((resolve: Function, reject: Function) => {
            this.db.transaction((t: Transaction) => {
                return this.models.Project.update(project, {where: {id: projectId}})
                    .then((results: [number, Array<any>]) => {
                        if (results.length > 0) {
                            this.logger.info(`Updated ${projectId}.`);
                        } else {
                            this.logger.info(`Project with id ${projectId} does not exist.`);
                        }
                        resolve(null);
                    }).catch((error: Error) => {
                        this.logger.error(error.message);
                        reject(error);
                    });
            });
        });

        return promise;
    }

    deleteOneById(projectId: number): Promise<void> {
        let promise = new Promise<void>((resolve: Function, reject: Function) => {
            this.db.transaction((t: Transaction) => {
                return this.models.Project.destroy({where: {id: projectId}}).then((affectedRows: number) => {
                    if (affectedRows > 0) {
                        this.logger.info(`Deleted project with id ${projectId}`);
                    } else {
                        this.logger.info(`Project with id ${projectId} does not exist.`);
                    }
                    resolve(null);
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                });
            });
        });

        return promise;
    }
}

export const ProjectService = new projectService();
