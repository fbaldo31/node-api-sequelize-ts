import { logger } from '../services';
import { dbManager } from './database.service'
/**
 * Created by Frederick BALDO on 03/07/2017.
 */
export abstract class AbstractModelService {
    logger = logger;
    db = dbManager.getOrm();
    models = dbManager.getModels();
}