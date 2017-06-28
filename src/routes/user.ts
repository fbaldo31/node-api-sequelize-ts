/**
 * Created by Frederick BALDO on 23/06/2017.
 */
import { NextFunction, Request, Response, Router } from 'express';

import { BaseRoute } from './route';
import { Utils } from '../config/utils';

const UserModel = {};
/**
 * / route
 * @Route User
 * @class UserRoute
 */
export class UserRoute extends BaseRoute {
    private helper: Utils;
    //the User model
    User: any;
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
        //log
        console.log('[UserRoute::create] Creating route.');

        // get users
        router.get('/users', (req: Request, res: Response, next: NextFunction) => {
            new UserRoute().getUsers(req, res, next);
        });
        // create users
        router.post('/users', (req: Request, res: Response, next: NextFunction) => {
            new UserRoute().createUserAccount(req, res, next);
        });
        // Update users
        router.put('/users/:user_id', (req: Request, res: Response, next: NextFunction) => {
            new UserRoute().updateUser(req, res, next);
        });
        // delete user
        router.delete('/users/:user_id', (req: Request, res: Response, next: NextFunction) => {
            new UserRoute().deleteUser(req, res, next);
        });
        // avatar upload
        router.post('/upload', (req: Request, res: Response, next: NextFunction) => {
            new UserRoute().uploadImage(req, res, next);
        });
    }

    getUsers(req: Request, res?: Response, next?) {
        this.User.find((err: any, users: [any]) => {
            super.sendResponseOrError(err, res, users);
        });
    }

    createUserAccount(req: Request, res: Response, next?) {
        this.User.create({
            name: req.body.name || '',
            userName: req.body.userName,
            password: req.body.secret,
            avatar: req.body.avatar,
            skills: req.body.skills,
            startdate: req.body.start,
            endDate: req.body.end,
            createdAt: new Date(),
            deletedAt: null
        }, (err, user) => {
            if (err) {
                res.send(err);
                // this.helper.deleteFileOrFolder(['/uploads/' + req.body.avatar]);
            }

            this.getUsers(req, res);
        });
    }

    updateUser(req: Request, res: Response, next?) {
        //
    }

    deleteUser(req: Request, res: Response, next?) {
        this.User.remove({
            _id: req.params.user_id
        }, (err: any) => {
            if (err)
                res.send(err);

            this.getUsers(req, res);
        });
    }

    uploadImage(req: any, res: Response, next?) {
        this.helper.uploadOneImage(req, res, function (uploadError) {
            this.helper.createImageFolderIfNotExist(res);
            if (uploadError) {
                console.error('error', uploadError);
                return res.status(500).json({message: req.uploadError, uploadError});
            } else {
                console.log('done', req.file);
                return res.json(req.file);
            }
        });
    }
}
