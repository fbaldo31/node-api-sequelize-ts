import { NextFunction, Request, Response, Router } from 'express';

import { BaseRoute } from './base.route';
import { ProjectService } from '../services/project.service';
/**
 * / route
 * @Route Project
 * @class ProjectRoute
 */
export class ProjectRoute extends BaseRoute {
    private db = ProjectService;
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
        router.get('/api/projects', (req: Request, res: Response, next?) => {
            new ProjectRoute().getProjects(req, res);
        });

        // Create a Project and send back all project after.
        router.post('/api/projects', (req: Request, res: Response, next?) => {
            console.log('save project', req.body);
            new ProjectRoute().createProject(req, res);
        });

        // Update users
        router.put('/api/projects/:project_id', (req: Request, res: Response, next: NextFunction) => {
            new ProjectRoute().updateProject(req, res, next);
        });

        // delete a Project
        router.delete('/api/projects/:project_id', (req: Request, res: Response, next?) => {
            console.log('removing', req.params);
            new ProjectRoute().deleteProject(req, res);
        });
    }

    /**
     * Use ORM to get all projects in the database
     * if there is an error retrieving, send the error. nothing after res.send(err) will execute.
     * @param req
     * @param res
     * @param next
     */
    getProjects(req: Request, res?: Response, next?) {
        return this.db.getAllProjects()
            .then((projects: [any]) => super.sendResponseCollection(res, projects))
            .catch(error => super.sendError(error, res));
    }

    /**
     * Create a Project
     * @param req
     * @param res
     * @param next
     */
    createProject(req: Request, res: Response, next?) {
        let project = {
            name: req.body.name || '',
            createdAt: new Date(),
            deletedAt: null
        };

        return this.db.create(project).then(project =>  this.getProjects(req, res)).catch(error => super.sendError(error, res));
    };

    updateProject(req: Request, res: Response, next?) {
        let project = this.db.getOneById(req.params.id);
        if (req.body.name) { project.name = req.body.name; }
        if (req.body.email) { project.email = req.body.email; }
        if (req.body.password) { project.password = req.body.secret; }
        if (req.body.avatar) { project.avatar = req.body.avatar; }
        if (req.body.projects) { project.projects = req.body.projects; }

        return this.db.update(req.params.id, project)
            .then(nbAffectedRows =>  this.getProjects(req, res))
            .catch(error => super.sendError(error, res));
    }

    deleteProject(req: Request, res: Response, next?) {
        return this.db.deleteOneById(req.params.id)
            .then(project =>  this.getProjects(req, res))
            .catch(error => super.sendError(error, res));
    }
}