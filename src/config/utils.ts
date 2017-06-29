import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
// import * as del from '';
import * as mkdirp from 'mkdirp';
import * as multer from 'multer';
/**
 * Common functions and constants
 */
export class Utils {
    devMode: string = 'DEV';
    prodMode: string = 'PROD';
    logFile: any;
    imageType = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'tiff', 'TIFF'];
    imageMaxSize = 4194304;
    publicImagesPath = './public/uploads/images';
    storage: any;
    upload: any;

    constructor() {
        this.setupFileUploadStorage();
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
    }

    /**
     * Create the log file if not exists before start the stream
     * @returns {WriteStream}
     */
    createLogFile() {
        try {
            this.createFolder('../logs');
            this.createFile('../logs/server.log');
            console.log('start logging');
            return this.logFile = fs.createWriteStream(path.join(__dirname, '../../logs/server.log'), {flags: 'w'});
        } catch (ex) {
            console.log(ex);
        }
    }

    deleteFileOrFolder(trashed: any) {
        // del([trashed], (err, deleted) => { return !err });
    };

    /**
     * Create folder for uploads
     * @param res
     */
    createImageFolderIfNotExist(res: any) {
        this.createFolder('public/uploads/images', res);
    };

    createFolder(filePath: string, res?: any) {
        return mkdirp(path.join(__dirname, '../' + filePath), (mkdirErr: any) => {
            if (mkdirErr) {
                if (res) {
                    return res.end(mkdirErr.toString());
                }
            }
            return true;
        });
    }

    createFile(name: string, content?: string) {
        let file = path.join(__dirname, '/../' + name);
        fs.open(file, 'wx', (err, fd) => {
            if (err) {
                console.log(err);
            }

            fs.writeFile(file, content ? content : '', (err, fd) => {
                if (err) {
                    console.log(err);
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
        console.log('mime check', this.imageType.indexOf(ext) > -1);
        if (this.imageType.indexOf(ext) === -1) {
            cb(null, false);
            req.uploadError = 'File type is not allowed';
            return cb(new Error(req.uploadError));
        }
        // Then check file size not > 4Mo
        console.log('size check', file.size); // < 4194304);
        if (file.size >= this.imageMaxSize) {
            cb(null, false);
            req.uploadError = 'File max size allowed is 4Mo';
            return cb(new Error(req.uploadError));
        }
        // All tests success
        cb(null, true);
    };

    checkMimeType(req: any, file: any, cb: any) {
        let ext = file.mimetype.split('/')[1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
    }

    getDestinationForImages(req: any, file: any, cb: any) {
        cb(null, this.publicImagesPath);
    }

    uploadOneImage(req: Request, res: Response, cb?) {
        return this.upload.single('file');
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
