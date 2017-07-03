import { NextFunction, Request, Response, Router } from 'express';

import { BaseRoute } from './base.route';
import { Skill } from '../models';
import { SkillService } from '../services/skill.service';
/**
 * / route
 * @Route Skill
 * @class SkillRoute
 */
export class SkillRoute extends BaseRoute {
    private db = SkillService;
    //the model
    Skill = Skill;
    /**
     * Constructor
     *
     * @class SkillRoute
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Create the routes.
     * @class SkillRoute
     * @method create
     * @static
     */
    public static create(router: Router) {
        //log
        console.log('[SkillRoute::create] Creating route.');

        // Get skills
        router.get('/api/skills', (req: Request, res: Response, next?:  NextFunction) => {
            new SkillRoute().getSkills(req, res);
        });

        // Create a Skill and send back all skill after.
        router.post('/api/skills', (req: Request, res: Response, next?) => {
            console.log('save skill', req.body);
            new SkillRoute().createSkill(req, res);
        });

        // delete a Skill
        router.delete('/api/skills/:skill_id', (req: Request, res: Response, next?: NextFunction) => {
            console.log('removing', req.params);
            new SkillRoute().deleteSkill(req, res);
        });
    }

    /**
     * Use ORM to get all skills in the database
     * if there is an error retrieving, send the error. nothing after res.send(err) will execute.
     * @param req
     * @param res
     * @param next
     */
    getSkills(req: Request, res?: Response, next?) {
        return this.db.getAllSkills()
            .then((skills: [any]) => super.sendResponseCollection(res, skills))
            .catch(error => super.sendError(error, res));
    }

    /**
     * Create a Skill
     * @param req
     * @param res
     * @param next
     */
    createSkill(req: Request, res: Response, next?) {
        let skill = {
            name: req.body.name || '',
            createdAt: new Date(),
            deletedAt: null
        };

        return this.db.create(skill).then(skill =>  this.getSkills(req, res)).catch(error => super.sendError(error, res));
    };

    updateSkill(req: Request, res: Response, next?) {
        let skill = this.db.getOneById(req.params.id);
        if (req.body.name) { skill.name = req.body.name; }
        if (req.body.email) { skill.email = req.body.email; }
        if (req.body.password) { skill.password = req.body.secret; }
        if (req.body.avatar) { skill.avatar = req.body.avatar; }
        if (req.body.skills) { skill.skills = req.body.skills; }

        return this.db.update(req.params.id, skill)
            .then(nbAffectedRows =>  this.getSkills(req, res))
            .catch(error => super.sendError(error, res));
    }

    deleteSkill(req: Request, res: Response, next?) {
        return this.db.deleteOneById(req.params.id)
            .then(skill =>  this.getSkills(req, res))
            .catch(error => super.sendError(error, res));
    }
}