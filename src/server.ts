import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import * as cors from 'cors';

import { DbConnection } from './config/sql-server';
import { UserRoute } from './routes/user';
import { SkillRoute } from './routes/skill';
import { ProjectRoute } from './routes/project';
import { IndexRoute } from './routes/index';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  private sql: DbConnection;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    // DB connection
    this.sql = new DbConnection();
    this.connect();

    // configure application
    this.config();

    // add routes
    this.routes();

    // add api
    this.api();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    //empty for now
  }

  public connect() {
    this.sql.authenticate().then(
        DbConnection.createTables()
    );
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    //add static paths
    this.app.use(express.static(path.join(__dirname, 'public')));

    //configure pug
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'pug');

    //mount logger
    this.app.use(logger('dev'));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    //mount cookie parker
    this.app.use(cookieParser('SECRET_GOES_HERE'));

    //mount override?
    this.app.use(methodOverride());

    //use q promises
    global.Promise = require('q').Promise;


    // catch 404 and forward to error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        err.status = 404;
        next(err);
    });

    //error handling
    this.app.use(errorHandler());

    // Allow CORS
    this.app.use(cors());
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    /** Api */
    // Users
    UserRoute.create(router);
    // Skill
    SkillRoute.create(router);
    // Project
    ProjectRoute.create(router);
    /** Front */
    // IndexRoute
    IndexRoute.create(router);

    //use router middleware
    this.app.use(router);
  }

  public getConnection() {
    return this.sql;
  }

}