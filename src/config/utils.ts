import { Request, Response } from 'express';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as del from 'del';
import * as mkdirp from 'mkdirp';
import * as multer from 'multer';
import * as os from 'os';
import * as cluster from 'cluster';
import * as fileUploader from 'formidable';
import { Worker } from "cluster";
import * as csvtojson from 'csvtojson';

import { CronJobs } from './cron.jobs';
import { AgentOptions } from './agent.options';
import { logger } from "../services/logger.service";
import { ServerAddress } from './server.config';

const converter = csvtojson({ noheader: true, delimiter: 'auto' });
/**
 * Common functions and constants
 * Cron tasks are launched from the constructor
 */
class Utils {
    devMode: string = 'DEV';
    prodMode: string = 'PROD';
    logFile: any;
    imageType = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'tiff', 'TIFF'];
    imageMaxSize = 4194304;
    publicImagesPath = '../public/uploads/images';
    publicCsvPath = '../public/uploads/csv';
    storage: any;
    upload: any;
    csvStorage: any;
    uploadcsv: any;
    cron = new CronJobs();

    constructor() {
        this.setupFileUploadStorage();
        this.cron.registerAllJobs();
    }

    /**
     * Use one storage and upload by folder/type
     */
    setupFileUploadStorage() {
        // Images
        this.storage = multer.diskStorage({
            destination: this.getDestinationForImages,
            filename: this.checkMimeType
        });
        // var upload = multer({dest: './uploads'});
        this.upload = multer({storage: this.storage, fileFilter: this.filterImageBeforeUpload});

        // CSV
        this.csvStorage = multer.diskStorage({destination: this.getDestinationForCsv,});
        this.uploadcsv = multer({storage: this.csvStorage, fileFilter: this.trustCsvFile});
    }

    /**
     * Create the log file if not exists before start the stream
     * @returns {WriteStream}
     */
    createLogFile() {
        try {
            this.createFolderIfNotExist(null, '../logs');
            this.createFile('../logs/server.log');
            logger.info('start logging');
            return this.logFile = fs.createWriteStream(path.join(__dirname, '../../logs/server.log'), {flags: 'w'});
        } catch (ex) {
            logger.info(ex);
        }
    }

    launchKeepAliveAgent() {
        return http.request(AgentOptions, res => {
            logger.info('STATUS: ' + res.statusCode);
            logger.info('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            // res.on('data', function (chunk) {
            //   logger.info('BODY: ' + chunk);
            // });
        }).on('error', e => {
            logger.info('problem with request: ' + e.message);
        }).end();
    }

    createServerClusters() {
        for (let c = 0; c < os.cpus().length; c++) {
            cluster.fork();
        }

        for (const id in cluster.workers) {
            cluster.workers[id].on('message', logger.info);
        }

        cluster.on("exit", (worker: Worker, code: number, signal: string) => {
            logger.info(`Worker ${worker.process.pid} died.`);
        });

        cluster.on("listening", (worker: Worker, address: ServerAddress) => {
            logger.info(`Worker ${worker.process.pid} connected to port ${address.port}.`);
        });
    }

    /**
     * Used for delete file or folder
     * @param trashed string: full path from /src
     * @Return boolean
     */
    deleteFileOrFolder(trashed: any) {
        let toDelete = [];
        toDelete.push(path.join(__dirname, '../' + trashed));
        del(toDelete, (err, deleted) => { return !err });
    };

    /**
     * Create folder for uploads
     * @param res
     */
    createFolderIfNotExist(res: any, folder: string) {
        logger.info('Create folder', folder);
        mkdirp(path.join(__dirname, '../' + folder), (mkdirErr: any) => {
            if (!mkdirErr) {
                return true;
            }
            if (mkdirErr) {
                if (res) {
                    return res.send(mkdirErr.toString());
                }
            }
        });
    }

    createFile(name: string, content?: string) {
        let file = path.join(__dirname, '/../' + name);
        fs.open(file, 'wx', (err, fd) => {
            if (err) {
                logger.info(err.message);
            }

            fs.writeFile(file, content ? content : '', (err, fd) => {
                if (err) {
                    logger.info(err);
                }
                return true;
            });
        });
    }

    /**
     * File upload
     * @param req
     * @param file
     * @param cb
     * @returns {any}
     */
    filterImageBeforeUpload(req: any, file: any, cb: any) {
        let ext = file.mimetype.split('/')[1];
        // First Check Mime Type
        logger.info('mime check', this.imageType.indexOf(ext) > -1);
        if (this.imageType.indexOf(ext) === -1) {
            cb(null, false);
            req.uploadError = 'File type is not allowed';
            return cb(new Error(req.uploadError));
        }
        // Then check file size not > 4Mo
        logger.info('size check', file.size); // < 4194304);
        if (file.size >= this.imageMaxSize) {
            cb(null, false);
            req.uploadError = 'File max size allowed is 4Mo';
            return cb(new Error(req.uploadError));
        }
        // All tests success
        cb(null, true);
    };

    trustCsvFile(req: any, file: any, cb: any) {
        console.log('Check', file.mimetype);
        let isCsv = file.mimetype.split('.')[1] === 'octet-stream' || file.mimetype.split('/')[1] === 'plain';
        // First Check Mime Type
        logger.info('mime check', isCsv);
        if (!isCsv) {
            cb(null, false);
            req.uploadError = 'File type is not allowed';
            return cb(new Error(req.uploadError));
        }
        // Then check file size not > 4Mo
        logger.info('size check', file.size); // < 4194304);
        if (file.size >= this.imageMaxSize) {
            cb(null, false);
            req.uploadError = 'File max size allowed is 4Mo';
            return cb(new Error(req.uploadError));
        }
        // All tests success
        cb(null, true);
    }

    checkMimeType(req: any, file: any, cb: any) {
        let ext = file.mimetype.split('/')[1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
    }

    getDestinationForImages(req: any, file: any, cb: any) {
        cb(null, this.publicImagesPath);
    }
    getDestinationForCsv(req: any, file: any, cb: any) {
        cb(null, this.publicCsvPath);
    }

    uploadOneImage(req: Request, res: Response, cb?) {
        return this.upload.single('file');
    }

    /**
     * Get the file name from request, then move the file into uploads
     * @param req
     * @param res
     * @returns {string}
     */
    uploadOneFlatFile(req: Request, res: Response): Promise<any> {
        let form = new fileUploader.IncomingForm();
        let promise = new Promise<Array<any>>((resolve: Function, reject: Function) => {
            // Manage upload
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    console.error(err);
                    res.json(err);
                }
                let fileName = req.params.filename;
                resolve(fileName);
                console.log('File uploaded', fileName);

                // Move the file
                fs.rename(files.file.path, __dirname + '/../' + this.publicCsvPath + '/' + fileName, (err) => {
                    if (err) {
                        console.error(err.message);
                        res.json(err);
                    }
                });
            });
        });
        return promise;
    }

    getObjectFromFlatFile(file: string, req?: Request) {
        let fileLocation: string = __dirname + '/../' + this.publicCsvPath + '/' + file;
        // console.log('../' + this.publicCsvPath + '/' + file);

        // let fileContent = converter.csv({ path: __dirname + '/../' + this.publicCsvPath + '/' + file }, (data) => {
        //     console.log('reading file', data);
        //     return data;
        // });
        // console.log('Got content:', fileContent);
        //
        // return fileContent;

        // let fileContent = fs.readFileSync(fileLocation);

        // let promise = new Promise<any>((resolve: Function, reject: Function) => {
        //     flatFile.db({ path: fileLocation }, (data, err) => {
        //         if (err) {
        //             console.error(err);
        //             reject(err);
        //             return err;
        //         }
        //         console.log('got:', data);
        //         if (req) {
        //             req.file = data;
        //         }
        //         resolve(data);
        //     }); // .then(data =>  { resolve(data); return data }).catch(error => reject(error));
        // });
        //
        // return promise;

        let content = [];
        let promise = new Promise<any>((resolve: Function, reject: Function) => {
            return converter.fromFile(fileLocation)
                .transf((json: any, csvRow: any, index: number) => {
                    // csvRow[2] = csvRow[2] === 'L' ? 'LLL' : csvRow[2];
                    content.push([
                        '\'' + csvRow[1] + '\'',
                        '\'' + csvRow[2] + '\'',
                        '\'' + csvRow[4] + '\'',
                        '\'' + csvRow[5] + '\'',
                        '\'' + csvRow[12] + '\'',
                        '\'' + csvRow[13] + '\''
                    ]);
                    // console.log('got', csvRow);
                })
                .on('done', (error) => {
                    if (error) {
                        reject(error);
                        console.error('error:', error);
                        return error;
                    }
                    console.log('Got flat file content:', content[0]);
                    resolve(content);
                })
            });
        return promise;
    }

    /**
     * Give the files names as array.
     * Please provide the whole path from src (excluding src)
     * @param folderName
     * @returns {string[]}
     */
    getFilesNameInFolder(folderName: string) {
        return fs.readdirSync(__dirname + '/../' + folderName);
    }
}

export const utils = new Utils();
