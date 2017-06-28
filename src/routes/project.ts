import { NextFunction, Request, Response, Router } from 'express';

import { BaseRoute } from './route';
import { Utils } from '../config/utils';

const ProjectModel = {};
/**
 * / route
 * @Route Project
 * @class ProjectRoute
 */
export class ProjectRoute extends BaseRoute {
    private helper: Utils;
    //the User model
    Project: any;
    /**
     * Constructor
     *
     * @class ProjectRoute
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Create the routes.
     * @class ProjectRoute
     * @method create
     * @static
     */
    public static create(router: Router) {
        //log
        console.log('[ProjectRoute::create] Creating route.');

        // Get Projects
        router.get('/projects', (req: Request, res: Response, next?) => {
            new ProjectRoute().getProjects(req, res);
        });

        // Create a Project and send back all project after.
        router.post('/projects', (req: Request, res: Response, next?) => {
            console.log('save project', req.body);
            new ProjectRoute().createProject(req, res);
        });

        // Update users
        router.put('/projects/:project_id', (req: Request, res: Response, next: NextFunction) => {
            new ProjectRoute().updateProject(req, res, next);
        });

        // delete a Project
        router.delete('/projects/:project_id', (req: Request, res: Response, next?) => {
            console.log('removing', req.params);
            new ProjectRoute().deleteProject(req, res);
        });
    }

    /**
     * Use mongoose to get all projects in the database
     * if there is an error retrieving, send the error. nothing after res.send(err) will execute.
     * @param req
     * @param res
     * @param next
     */
    getProjects(req: Request, res?: Response, next?) {
        this.Project.find((err: any, projects: [any]) => {
            super.sendResponseOrError(err, res, projects);
        });
    }

    /**
     * Create a Project, information comes from AJAX request from Angular
     * @param req
     * @param res
     * @param next
     */
    createProject(req: Request, res: Response, next?) {
        this.Project.create(function (err, projects) {
            this.Project.create({
                name: req.body.name || '',
                createdAt: new Date(),
                deletedAt: null
            }, (err) => {
                if (err) {
                    res.send(err);
                }

                // get and return all the project after you create another
                this.getProjects(req, res);
            });
        })
    };

    updateProject(req: Request, res: Response, next?) {
        //
    }
    
    deleteProject(req: Request, res: Response, next?) {
        this.Project.remove({
            _id: req.params.project_id
        }, (err) => {
            if (err)
                res.send(err);

            this.getProjects(req, res);
        });
    }
}