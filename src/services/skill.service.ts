import { Transaction } from 'sequelize';

import { AbstractModelService } from './abstract.model.service';
import Skill from '../models/skill';
import { dbManager } from './database.service';
/**
 * Created by Frederick BALDO on 01/07/2017.
 */
class skillService extends AbstractModelService {

    getAllSkills(): Promise<Array<any>> {
        let promise = new Promise<Array<any>>((resolve: Function, reject: Function) => {
            return dbManager.sql.transaction((t: Transaction) => {
                dbManager.models.Skill.findAll().then((skills: Array<any>) => {
                    this.logger.info('Get all skills.');
                    resolve(skills);
                    return skills;
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                    return error;
                });
            });
        });

        return promise;
    }

    create(skill: any): Promise<any> {
        let promise = new Promise<any>((resolve: Function, reject: Function) => {
            return dbManager.sql.transaction((t: Transaction) => {

                dbManager.models.Skill.create(skill).then((newSkill: any) => {
                    this.logger.info(`Created skill with name ${newSkill.name}.`);
                    resolve(newSkill);
                    return newSkill;
                }).catch((error: Error) => {
                    console.error(error);
                    this.logger.error(error.message);
                    reject(error);
                    return error;
                });
            });
        });

        return promise;
    }

    getOneById(skillId: string): Promise<any> | any{
        let skill: any;
        let promise = new Promise<any>((resolve: Function, reject: Function) => {
            return dbManager.sql.transaction((t: Transaction) => {
                dbManager.models.Skill.findOne({where: {id: skillId}}).then((skill: any) => {
                    if (skill) {
                        this.logger.info(`Retrieved skill with name ${skillId}.`);
                    } else {
                        this.logger.info(`Skill with name ${skillId} does not exist.`);
                    }
                    resolve(skill);
                    return skill;
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                    throw error;
                });
            });
        });
        return promise;
    }

    update(skillId: number, skill: any): Promise<void> {
        let promise = new Promise<void>((resolve: Function, reject: Function) => {
            return dbManager.sql.transaction((t: Transaction) => {
                dbManager.models.Skill.update(skill, {where: {id: skillId}})
                    .then((results: [number, Array<any>]) => {
                        if (results.length > 0) {
                            this.logger.info(`Updated ${skillId}.`);
                        } else {
                            this.logger.info(`Skill with id ${skillId} does not exist.`);
                        }
                        resolve(null);
                        return skill;
                    }).catch((error: Error) => {
                        this.logger.error(error.message);
                        reject(error);
                        throw error;
                    });
            });
        });

        return promise;
    }

    deleteOneById(skillId: number): Promise<void> {
        let promise = new Promise<void>((resolve: Function, reject: Function) => {
            return dbManager.sql.transaction((t: Transaction) => {
                dbManager.models.Skill.destroy({where: {id: skillId}}).then((affectedRows: number) => {
                    if (affectedRows > 0) {
                        this.logger.info(`Deleted skill with id ${skillId}`);
                    } else {
                        this.logger.info(`Skill with id ${skillId} does not exist.`);
                    }
                    resolve(null);
                    return true;
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                    throw error;
                });
            });
        });

        return promise;
    }
}

export const SkillService = new skillService();
