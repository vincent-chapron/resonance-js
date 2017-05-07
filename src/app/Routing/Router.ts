import {Module} from '../../modules/Module';
import {IRouting} from './Routing';

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

export abstract class Router {
    protected routing: IRouting[] = [];

    public abstract registerRoutes(): IRouting[];
}
