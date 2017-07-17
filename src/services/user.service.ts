import { Transaction } from 'sequelize';

import { AbstractModelService } from './abstract.model.service';
import User from "../models/user";
import { dbManager } from './database.service';
/**
 * Created by Frederick BALDO on 01/07/2017.
 */
class userService extends AbstractModelService {
    private selectUserAndSkills = '';
    // "SELECT * FROM user LEFT JOIN 'Skill' ON `User`.`skillId` = 'Skill'.'id' WHERE 'User'.'id' = %s";

    getAllUsers(): Promise<Array<any>> {
        let promise = new Promise<Array<any>>((resolve: Function, reject: Function) => {
            dbManager.sql.transaction((t: Transaction) => {
                return dbManager.models.User.findAll().then((users: Array<any>) => {
                    this.logger.info("Get all users.");
                    resolve(users);
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                });
            });
        });

        return promise;
    }

    create(user: any) {
        console.log(`Create user`);

        let promise = new Promise<any>((resolve: Function, reject: Function) => {
            return dbManager.sql.transaction((t: Transaction) => {
                dbManager.models.User.create(user).then((newUser: any) => {
                    this.logger.info(`Created user with name ${user.name}.`);
                    resolve(newUser);
                    return newUser;
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                    return error;
                });
            });
        });

        return promise;
    }

    getOneById(userId: string): Promise<any> | any {
        let user: any;
        let promise = new Promise<any>((resolve: Function, reject: Function) => {
            dbManager.sql.transaction((t: Transaction) => {
                user = dbManager.models.User.findOne({where: {id: userId}}).then((product: any) => {
                    if (product) {
                        this.logger.info(`Retrieved product with name ${userId}.`);
                    } else {
                        this.logger.info(`Product with name ${userId} does not exist.`);
                    }
                    resolve(product);
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                });
            });
        });
        return user || promise;
    }

    update(userId: number, user: any): Promise<void> {
        let promise = new Promise<void>((resolve: Function, reject: Function) => {
            dbManager.sql.transaction((t: Transaction) => {
                return dbManager.models.User.update(user, {where: {id: userId}})
                    .then((results: [number, Array<any>]) => {
                        if (results.length > 0) {
                            this.logger.info(`Updated ${userId}.`);
                        } else {
                            this.logger.info(`User with id ${userId} does not exist.`);
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

    deleteOneById(userId: number): Promise<void> {
        let promise = new Promise<void>((resolve: Function, reject: Function) => {
            dbManager.sql.transaction((t: Transaction) => {
                return dbManager.models.User.destroy({where: {id: userId}}).then((affectedRows: number) => {
                    if (affectedRows > 0) {
                        this.logger.info(`Deleted user with id ${userId}`);
                    } else {
                        this.logger.info(`User with id ${userId} does not exist.`);
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

    getUserAndSkills(userId) {
        let promise = new Promise<void>((resolve: Function, reject: Function) => {
            return dbManager.sql.query(this.selectUserAndSkills)
                .then((results: [number, Array<any>]) => {
                    if (results.length > 0) {
                        this.logger.info(`Got ${userId}.`);
                    } else {
                        this.logger.info(`User with id ${userId} does not exist.`);
                    }
                    resolve(null);
                }).catch((error: Error) => {
                    this.logger.error(error.message);
                    reject(error);
                });
        });

        return promise;
    }
}

export const UserService = new userService();
