import * as fs from 'fs';
import * as express from 'express';
import {IRouter, IRouting} from '../Routing';
import {ModuleProvider} from './ModuleProvider';
import {RouterProvider} from './RouterProvider';

export class RouteProvider {
    private static instance: RouteProvider = null;

    protected moduleProvider: ModuleProvider;
    protected routerProvider: RouterProvider;
    protected publicDirectories: string[] = [];

    private constructor() {
        this.moduleProvider = ModuleProvider.getInstance();
        this.routerProvider = RouterProvider.getInstance();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new RouteProvider();
        }
        return this.instance;
    }

    public applyRoutes(): express.Router {
        let routers: IRouter[] = this.routerProvider.getAppRouters();
        let expressRouter = express.Router();
        routers.map(router => {
            let routing: IRouting[] = router.router.registerRoutes();
            routing.map(r => {
                let prefix = `${router.prefix}${r.prefix || ''}`;
                let controllerDir = this.moduleProvider.getDirname(router.module, r.controller, 'Controller');
                let ModController = require(controllerDir).default;
                let controller = new ModController();
                let middlewares = r.middlewares || [];

                r.routes.map(route => {
                    let action = controller[`${route.action}Action`];
                    let methods = route.methods || ['GET'];
                    let m = [...middlewares, ...(route.middlewares || []), action];
                    methods.map(method => {
                        expressRouter[method.toLowerCase()](`${prefix}${route.uri}`, ...m);
                    });
                });
            });
        });
        return expressRouter;
    }

    public applyPublicRoutes(): express.Router {
        let routers: IRouter[] = this.routerProvider.getAppRouters();
        let expressRouter = express.Router();
        routers.map(router => {
            let dir = router.module.getPublicDir();
            if (fs.existsSync(dir)
                    && fs.lstatSync(dir).isDirectory()
                    && this.publicDirectories.indexOf(dir) === -1) {
                this.publicDirectories.push(dir);
                expressRouter.use(router.prefix, express.static(dir));
            }
        });
        return expressRouter;
    }
}
