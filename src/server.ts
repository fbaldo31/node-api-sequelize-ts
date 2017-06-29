import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as http from 'http';
import * as path from 'path';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import * as cors from 'cors';

import { DbConnection } from './config/sql-server';
import { UserRoute } from './routes/user';
import { SkillRoute } from './routes/skill';
import { ProjectRoute } from './routes/project';
import { IndexRoute } from './routes/index';
import { Utils } from './config/utils';
import { AgentOptions } from './config/agent.options';
import { AgentParams } from './config/agent.params';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;
  public env: string;

  private sql: DbConnection;
  private agentOptions = AgentOptions;
  private agent = AgentParams;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server(new Utils());
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor(private helper: Utils) {
    if (process.env.npm_config_env && process.env.npm_config_env.toUpperCase() === this.helper.devMode) {
      this.env = this.helper.devMode;
    } else {
      this.env = this.helper.prodMode;
    }

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
    // add static paths
    this.app.use(express.static(path.join(__dirname, 'public')));

    // optional: configure pug
    this.app.set('views', path.join(__dirname, 'public/views'));
    this.app.set('view engine', 'pug');

    // mount logger
    this.app.use(logger('common', {stream: this.helper.createLogFile()}));
    this.app.use(logger('dev'));

    // mount json form parser
    this.app.use(bodyParser.json());

    // mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    // mount cookie parker
    this.app.use(cookieParser('SECRET_GOES_HERE'));

    // mount override?
    this.app.use(methodOverride());

    // use q promises
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

    // Keep alive
    const req = http.request(AgentOptions, res => {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      // res.on('data', function (chunk) {
      //   console.log('BODY: ' + chunk);
      // });
    });
    req.on('error', e => {
      console.log('problem with request: ' + e.message);
    });
    req.end();

    setTimeout(() => {
      if (this.agent.statusChanged) {
        console.log('[%s] agent status changed: %j', Date(), this.agent.getCurrentStatus());
      }
    }, 2000);
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