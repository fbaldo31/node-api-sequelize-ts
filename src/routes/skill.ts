import { NextFunction, Request, Response, Router } from 'express';

import { BaseRoute } from './route';
import { Utils } from '../config/utils';
import { Skill } from '../models/index';
/**
 * / route
 * @Route Skill
 * @class SkillRoute
 */
export class SkillRoute extends BaseRoute {
    private helper: Utils;
    //the User model
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
        router.get('/api/skills', (req: Request, res: Response, next?) => {
            new SkillRoute().getSkills(req, res);
        });

        // Create a Skill and send back all skill after.
        router.post('/api/skills', (req: Request, res: Response, next?) => {
            console.log('save skill', req.body);
            new SkillRoute().createSkill(req, res);
        });

        // delete a Skill
        router.delete('/api/skills/:skill_id', (req: Request, res: Response, next?) => {
            console.log('removing', req.params);
            new SkillRoute().deleteSkill(req, res);
        });
    }

    /**
     * Use mongoose to get all skills in the database
     * if there is an error retrieving, send the error. nothing after res.send(err) will execute.
     * @param req
     * @param res
     * @param next
     */
    getSkills(req: Request, res?: Response, next?) {
        this.Skill.find((err: any, skills: [any]) => {
            super.sendResponseOrError(err, res, skills);
        });
    }

    /**
     * Create a Skill, information comes from AJAX request from Angular
     * @param req
     * @param res
     * @param next
     */
    createSkill(req: Request, res: Response, next?) {
        this.Skill.create(function (err, skills) {
            this.Skill.create({
                name: req.body.name || '',
                createdAt: new Date(),
                deletedAt: null
            }, (err) => {
                if (err) {
                    res.send(err);
                }

                // get and return all the skill after you create another
                this.getSkills(req, res);
            });
        })
    };

    deleteSkill(req: Request, res: Response, next?) {
        // this.Skill.remove({
        //     _id: req.params.skill_id
        // }, (err) => {
        //     if (err)
        //         res.send(err);
        //
        //     this.getSkills(req, res);
        // });
    }
}