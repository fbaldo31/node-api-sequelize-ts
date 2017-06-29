/**
 * Created by Frederick BALDO on 29/06/2017.
 */
import * as cron from 'cron';
import * as moment from 'moment';

import { Utils } from './utils';

const CronJob = cron.CronJob;

export class CronJobs {
    allSundaysAtMidnight = '00 00 00 * * 1'; // 'ss mm hh w m dayOfTheWeek'

    constructor() {
    }

    /**
     * Usefull method to start all jobs in one call
     */
    registerAllJobs() {
        this.deleteOldLogsFiles();
    }

    deleteOldLogsFiles() {
        new CronJob(this.allSundaysAtMidnight, () => {
            let logFiles = new Utils().getFilesNameInFolder('../logs');
            logFiles.forEach((file) => {
                if (file === 'server.log') {
                    new Utils().deleteFileOrFolder(file);
                    console.log('Cron Task:', 'deleteOldLogsFiles ' + file);
                }
            });
        }, null, true, moment().zoneName());
    }
}