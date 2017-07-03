import { Transaction } from 'sequelize';

import { AbstractModelService } from './abstract.model.service';
import Skill from '../models/skill';
/**
 * Created by Frederick BALDO on 01/07/2017.
 */
class skillService extends AbstractModelService {

    getAllSkills(): Promise<Array<any>> {
        let promise = new Promise<Array<any>>((resolve: Function, reject: Function) => {
            this.db.transaction((t: Transaction) => {
                return this.models.Skill.findAll().then((products: Array<any>) => {
                    this.logger.info('Get all skills.');
                    resolve(products);
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                });
            });
        });

        return promise;
    }

    create(skill: any): Promise<any> {
        let promise = new Promise<any>((resolve: Function, reject: Function) => {
            this.db.transaction((t: Transaction) => {
                return this.models.Skill.create(skill).then((product: any) => {
                    this.logger.info(`Created product with name ${skill.name}.`);
                    resolve(product);
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                });
            });
        });

        return promise;
    }

    getOneById(skillId: string): Promise<any> | any{
        let skill: any;
        let promise = new Promise<any>((resolve: Function, reject: Function) => {
            this.db.transaction((t: Transaction) => {
                skill = this.models.Skill.findOne({where: {id: skillId}}).then((product: any) => {
                    if (product) {
                        this.logger.info(`Retrieved product with name ${skillId}.`);
                    } else {
                        this.logger.info(`Product with name ${skillId} does not exist.`);
                    }
                    resolve(product);
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                });
            });
        });
        return skill || promise;
    }

    update(skillId: number, skill: any): Promise<void> {
        let promise = new Promise<void>((resolve: Function, reject: Function) => {
            this.db.transaction((t: Transaction) => {
                return this.models.Skill.update(skill, {where: {id: skillId}})
                    .then((results: [number, Array<any>]) => {
                        if (results.length > 0) {
                            this.logger.info(`Updated ${skillId}.`);
                        } else {
                            this.logger.info(`Skill with id ${skillId} does not exist.`);
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

    deleteOneById(skillId: number): Promise<void> {
        let promise = new Promise<void>((resolve: Function, reject: Function) => {
            this.db.transaction((t: Transaction) => {
                return this.models.Skill.destroy({where: {id: skillId}}).then((affectedRows: number) => {
                    if (affectedRows > 0) {
                        this.logger.info(`Deleted skill with id ${skillId}`);
                    } else {
                        this.logger.info(`Skill with id ${skillId} does not exist.`);
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

export const SkillService = new skillService();
