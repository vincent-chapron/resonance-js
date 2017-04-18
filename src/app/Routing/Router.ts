import {Module} from '../../modules/Module';
import {RequestHandler} from 'express';

export interface IRoute {
    uri: string;
    methods?: string[];
    middlewares?: RequestHandler[];
    action: string;
}

export interface ISocket {
    event: string;
    action: string;
}

export interface IRouterConfiguration {
    prefix?: string;
    resources: string; 
}

export interface IRouter {
    module: Module;
    router: Router;
    routerDir: string;
    prefix: string;
}

export interface IRouting {
    controller: string;
    middlewares?: RequestHandler[];
    prefix?: string;
    routes?: IRoute[];
    sockets?: ISocket[];
}

export abstract class Router {
    protected routing: IRouting[] = [];

    public abstract registerRoutes(): IRouting[];
}

export abstract class Routing {
     public abstract registerRouters(): IRouterConfiguration[];
}
