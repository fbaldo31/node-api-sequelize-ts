/**
 * Created by Frederick BALDO on 08/07/2017.
 */
import { NextFunction, Request, Response, Router } from 'express';

import { BaseRoute } from './base.route';
import { dbManager } from '../services/database.service';
/**
 * / route
 * @Route csv
 * @class CsvRoute
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
        router.post('/api/csv/:filename', (req: Request, res: Response, next: NextFunction) => {
            thisRoute.handleUpload(req, res, next);
        });
    }
    private handleUpload(req: Request, res: Response, next: NextFunction): void {
        // Create the destination folder if not exists
        this.helper.createFolderIfNotExist(res, '../public/uploads/csv');
        // Move the file
        this.helper.uploadOneFlatFile(req, res)
            .then((fileName) => {
                let mimeType = fileName.split('\.')
                // Flat file case
                this.helper.getObjectFromFlatFile(fileName, req)
                    .then((content) => {
                        // console.log('End', content);
                        dbManager.createTableFromFile(fileName, content);
                        res.status(200).json({file: content})})
                    .catch((error) => {
                        console.error('Fichier non trouvé');
                        res.status(500).json({ error: 'File not founded ' + error.message });
                    });
            })
            .catch((error) => res.status(500).json(error));

        // res.json(done);
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

        // this.helper.uploadOneCsvFile(req, res, function (uploadError) {
        //     console.log(req.body);
        //     if (uploadError) {
        //         console.error(uploadError);
        //     }
        //
        //     res.json(req.body);
        //
        //     let csvFile = req.body;
        //     // this.fileName = req.body.fileName;
        //     // this.binary = JSON.stringify(csvFile);
        //     // this.binary = JSON.parse(this.binary.replace('\\', ''));
        //     console.log(csvFile);
        //     // dbManager.registerModels(this.helper.publicCsvPath);
        // });
    }
}