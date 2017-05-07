import {RequestHandler} from 'express';
import {IRoute} from './Route';
import {ISocket} from './Socket';
import {IRouterConfiguration} from './Router';

export interface IRouting {
    controller: string;
    middlewares?: RequestHandler[];
    prefix?: string;
    routes?: IRoute[];
    sockets?: ISocket[];
}

export abstract class Routing {
     public abstract registerRouters(): IRouterConfiguration[];
}
