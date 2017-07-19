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

    /**
     * Redirect on the correct method to manage file upload depend on mime type
     * @param {Request} req
     * @param {Response} res
     * @param {e.NextFunction} next
     */
    private handleUpload(req: Request, res: Response, next: NextFunction): void {
        // Create the destination folder if not exists
        this.helper.createFolderIfNotExist(res, '../public/uploads/csv');
        // Move the file
        this.helper.uploadOneFlatFile(req, res)
            .then((fileName) => {
                let mimeType = fileName.split('\.')[fileName.split('\.').length -1];
                console.log('Type is', mimeType);
                switch (mimeType) {
                    case 'txt': // Flat file case
                    case 'TXT': this.uploadFlatFile(req, res, fileName);
                        break;
                    case 'cvs': // csv file case
                    case 'CSV': this.uploadCsvFile(req, res, fileName);
                        break;
                    case 'xml': // xml file case
                    case 'XML': this.uploadXmlFile(req, res, fileName);
                        break;
                    default: res.status(500).json({ error: 'File not supported'});
                }
            })
            .catch((error) => res.status(500).json(error));
    }

    private uploadFlatFile(req: Request, res: Response, fileName: string) {
        this.helper.getObjectFromFlatFile(fileName, req)
            .then((content) => CsvRoute.uploadSuccess(req, res, fileName, content))
            .catch((error) => CsvRoute.uploadError(req, res, error));
    }
    private uploadCsvFile(req: Request, res: Response, fileName: string) {
        this.helper.getObjectFromCsv(fileName, req)
            .then((content) => CsvRoute.uploadSuccess(req, res, fileName, content))
            .catch((error) => CsvRoute.uploadError(req, res, error));
    }
    private uploadXmlFile(req: Request, res: Response, fileName: string) {
        this.helper.getObjectFromXml(fileName, req)
            .then((content) => CsvRoute.uploadSuccess(req, res, fileName, content))
            .catch((error) => CsvRoute.uploadError(req, res, error));
    }

    private static uploadSuccess(req: Request, res: Response, fileName: string, content: any) {
        console.log('uploded', fileName);
        dbManager.createTableFromFile(fileName, content);
        res.status(200).json({file: content});
    }
    private static uploadError(req: Request, res: Response, error: any) {
        console.error('Fichier non trouvé');
        res.status(500).json({ error: 'File not founded ' + error.message });
    }
}