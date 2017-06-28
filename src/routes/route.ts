import { Request, Response } from "express";
import * as logger from 'morgan';

/**
 * Constructor
 *
 * @class BaseRoute
 */
export class BaseRoute {

  protected title: string;

  private scripts: string[];


  /**
   * Constructor
   *
   * @class BaseRoute
   * @constructor
   */
  constructor() {
    //initialize variables
    this.title = "Tour of Heros";
    this.scripts = [];
  }

  /**
   * Add a JS external file to the request.
   *
   * @class BaseRoute
   * @method addScript
   * @param src {string} The src to the external JS file.
   * @return {BaseRoute} Self for chaining
   */
  public addScript(src: string): BaseRoute {
    this.scripts.push(src);
    return this;
  }

  /**
   * Render a page.
   *
   * @class BaseRoute
   * @method render
   * @param req {Request} The request object.
   * @param res {Response} The response object.
   * @param view {String} The view to render.
   * @param options {Object} Additional options to append to the view's local scope.
   * @return void
   */
  public render(req: Request, res: Response, view: string, options?: Object) {
    //add constants
    res.locals.BASE_URL = "/api";

    //add scripts
    res.locals.scripts = this.scripts;

    //add title
    res.locals.title = this.title;

    //render view
    res.render(view, options);
  }

  /**
   * If there is an error retrieving, send the error. nothing after res.send(err) will execute
   * If not send the response with data.
   * @param err
   * @param res
   * @param data
   */
  public sendResponseOrError(err: any, res: any, data: [any]) {
    if (err) { // send error.
      logger;
      res.send(err);
    }

    res.json(data); // return all users in JSON format
  }
}