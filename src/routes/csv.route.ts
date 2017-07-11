/**
 * Created by Frederick BALDO on 08/07/2017.
 */
import { NextFunction, Request, Response, Router } from 'express';

import { BaseRoute } from './base.route';
import { dbManager } from '../services/database.service';
/**
 * / route
 * @Route Skill
 * @class SkillRoute
 */
export class CsvRoute extends BaseRoute {
    fileName: string;
    binary: any;
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
        const thisRoute = new CsvRoute();
        // upload
        router.post('/api/csv', (req: Request, res: Response, next: NextFunction) => {
            thisRoute.handleUpload(req, res, next);
        });
    }
    private handleUpload(req: Request, res: Response, next: NextFunction) {
        this.helper.createFolderIfNotExist(res, this.helper.publicCsvPath);

        // return res.json(req.body);
        // Upload file
        // console.log('start upload csv', this.helper.uploadOneCsvFile(req, res, function (uploadError) {
        //
        //     if (uploadError) {
        //         console.error('error', uploadError);
        //         return res.status(500).json({message: uploadError});
        //     } else {
        //         console.log('done', req.file);
        //         return res.json(req.file);
        //     }
        // });
        this.helper.uploadOneCsvFile(req, res, function (uploadError) {

            if (this.helper.createFolderIfNotExist(res, this.helper.publicCsvPath)) {

                if (uploadError) {
                    console.error('error', uploadError);
                    return res.status(500).json({message: uploadError});
                } else {
                    console.log('done', req.file);
                    return res.json(req.file);
                }
            }
            let csvFile = req.body;
            // this.fileName = req.body.fileName;
            // this.binary = JSON.stringify(csvFile);
            // this.binary = JSON.parse(this.binary.replace('\\', ''));
            console.log(csvFile);
            // dbManager.registerModels(this.helper.publicCsvPath);
        });
    }
}