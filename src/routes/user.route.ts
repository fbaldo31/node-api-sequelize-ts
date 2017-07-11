/**
 * Created by Frederick BALDO on 23/06/2017.
 */
import { NextFunction, Request, Response, Router } from 'express';

import { BaseRoute } from './base.route';
import { UserService } from '../services';
import User from '../models/user';
import {logger} from "../services/logger.service";

/**
 * / route
 * @Route User
 * @class UserRoute
 */
export class UserRoute extends BaseRoute {
    private db = UserService;
    //the User model
    User = User;
    /**
     * Constructor
     *
     * @class UserRoute
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Create the routes.
     * @class IndexRoute
     * @method create
     * @static
     */
    public static create(router: Router) {
        // log
        console.log('[UserRoute::create] Creating route.');

        const thisRoute = new UserRoute();
        // get users
        router.get('/api/users', (req: Request, res: Response, next: NextFunction) => {
            thisRoute.getUsers(req, res, next);
        });
        // create users
        router.post('/api/users', (req: Request, res: Response, next: NextFunction) => {
            thisRoute.createUserAccount(req, res, next);
        });
        // Update users
        router.put('/api/users/:user_id', (req: Request, res: Response, next: NextFunction) => {
            thisRoute.updateUser(req, res, next);
        });
        // delete user
        router.delete('/api/users/:user_id', (req: Request, res: Response, next: NextFunction) => {
            thisRoute.deleteUser(req, res, next);
        });
        // avatar upload
        router.post('/api/upload', (req: Request, res: Response, next: NextFunction) => {
            thisRoute.uploadImage(req, res, next);
        });
    }

    /**
     * Get All users in database
     * @param req
     * @param res
     * @param next
     */
    getUsers(req: Request, res?: Response, next?) {
        return this.db.getAllUsers()
        // return this.db.getUserAndSkills(0)
            .then((users) => super.sendResponseCollection(res, users))
            .catch(error => super.sendError(error, res));
    }

    createUserAccount(req: Request, res: Response, next?) {
        let user = {
            name: req.body.name || '',
            email: req.body.email,
            password: req.body.secret,
            avatar: req.body.avatar,
            // skills: req.body.skills,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        };

        return this.db.create(user)
            .then(user => super.sendResponseCollection(res, user)).catch(error => super.sendError(error, res));
    }

    updateUser(req: Request, res: Response, next?) {
        let user = this.db.getOneById(req.params.id);
        if (req.body.name) { user.name = req.body.name; }
        if (req.body.email) { user.email = req.body.email; }
        if (req.body.password) { user.password = req.body.secret; }
        if (req.body.avatar) { user.avatar = req.body.avatar; }
        // if (req.body.skills) { user.skills = req.body.skills; }

        return this.db.update(req.params.id, user)
            .then(nbAffectedRows =>  this.getUsers(req, res))
            .catch(error => super.sendError(error, res));
    }

    deleteUser(req: Request, res: Response, next?) {
        return this.db.deleteOneById(req.params.id)
            .then(user =>  this.getUsers(req, res))
            .catch(error => super.sendError(error, res));
    }

    uploadImage(req: any, res: Response, next?) {
        this.helper.uploadOneImage(req, res, function (uploadError) {
            this.helper.createFolderIfNotExist(res, this.helper.publicImagesPath);
            if (uploadError) {
                this.logger.error('error', uploadError);
                return res.status(500).json({message: req.uploadError, uploadError});
            } else {
                logger.info('uploaded', req.file);
                return res.json(req.file);
            }
        });
    }
}
