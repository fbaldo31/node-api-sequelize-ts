import { Request, Response } from 'express';
import * as fs from 'fs';
// const del = require('delete');
import * as mkdirp from 'mkdirp';               // Used for make directory
import * as multer from 'multer';

export class Utils {
    imageType = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'tiff', 'TIFF'];
    imageMaxSize = 4194304;
    publicImagesPath = './public/uploads/images';
    storage: any;
    upload: any;

    constructor() {
        this.storage = multer.diskStorage({
            destination: this.getDestinationForImages,
            filename: this.checkMimeType
        });
        this.upload = multer({storage: this.storage, fileFilter: this.filterImageBeforeUpload});
        // var upload = multer({dest: './uploads'});
    }

    deleteFileOrFolder(trashed: any) {
        // del([trashed], function (err, deleted) {
        //     if (err) {
        //         return false;
        //     }
        //     return true;
        // });
    };

    createImageFolderIfNotExist(res: any) {
        mkdirp('./public/uploads/images', (mkdirErr: any) => {
            if (mkdirErr) {
                return res.end(mkdirErr.toString());
            }
        });
    };
// File upload

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
