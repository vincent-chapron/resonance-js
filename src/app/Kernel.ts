import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as socket from 'socket.io';
import {Module} from '../modules/Module';
import {IRouter, IRouting, IRouterConfiguration} from './Routing';
import {ModuleProvider} from './Utils/ModuleProvider';
import {RouterProvider} from './Utils/RouterProvider';

export abstract class Kernel {
    protected moduleProvider: ModuleProvider;
    protected routerProvider: RouterProvider;

    protected routers: IRouter[] = [];
    protected port: number;
    protected hasSocket: boolean = false;
    protected io: SocketIO.Server = null;
    protected app: express.Express = null;
    protected server: http.Server = null;
    protected viewEngine: string = 'pug';
    protected viewsDirectories: string[] = [];
    protected publicDirectories: string[] = [];

    protected abstract registerModules(): Module[];
    protected abstract dirname(): string;

    public constructor() {
        this.moduleProvider = ModuleProvider.getInstance();
        this.routerProvider = RouterProvider.getInstance();

        this.moduleProvider.setModules(this.registerModules());
        this.routers = this.routerProvider.getAppRouters(this.dirname());

        this.generateViewsDirectories();
    }

    /**
     * Execute will parse args and run command
     */
    public execute() {}

    public enableSocket() {
        this.hasSocket = true;
    }

    public setViewsEngine(engine: string) {
        this.viewEngine = engine;
    }

    /**
     * Listen will run an express server
     */
    public listen(port: number) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);

        this.addSettings();
        // add main middlewares

        this.createPublicRoutes();
        this.createRoutes();
        this.createSockets();

        // add error fallback
        this.server.listen(port);
    }

    public close() {
        if (this.server !== null) {
            this.server.close();
            this.server = null;
        }
    }

    protected addSettings(): void {
        this.app.set('view engine', this.viewEngine);
        this.app.set('views', this.viewsDirectories);
        this.app.set('port', this.port);
    }

    public generateViewsDirectories(): string[] {
        this.moduleProvider.getModules().map(mod => this.addViewsDirectory(mod.getViewsDir()));
        return this.viewsDirectories;
    }

    protected addViewsDirectory(dir: string): Kernel {
        if (fs.existsSync(dir)
                && fs.lstatSync(dir).isDirectory()
                && this.viewsDirectories.indexOf(dir) === -1) {
            this.viewsDirectories.push(dir);
        }
        return this;
    }

    public createPublicRoutes() {
        this.routers.map(router => {
            let dir = router.module.getPublicDir();
            if (fs.existsSync(dir)
                    && fs.lstatSync(dir).isDirectory()
                    && this.publicDirectories.indexOf(dir) === -1) {
                this.publicDirectories.push(dir);
                this.app.use(router.prefix, express.static(dir));
            }
        });
    }

    public createRoutes() {
        let moduleProvider = ModuleProvider.getInstance();
        this.routers.map(router => {
            let routing: IRouting[] = router.router.registerRoutes();
            routing.map(r => {
                let prefix = `${router.prefix}${r.prefix || ''}`;
                let controllerDir = moduleProvider.getDirname(router.module, r.controller, 'Controller');
                let ModController = require(controllerDir).default;
                let controller = new ModController();
                let middlewares = r.middlewares || [];

                r.routes.map(route => {
                    let action = controller[`${route.action}Action`];
                    let methods = route.methods || ['GET'];
                    let m = [...middlewares, ...(route.middlewares || []), action];
                    methods.map(method => {
                        this.app[method.toLowerCase()](`${prefix}${route.uri}`, ...m);
                    });
                });
            });
        });
    }

    createSockets() {
        if (this.hasSocket) {
            this.io = socket(this.server);
            this.io.on('connection', socket => {
                let moduleProvider = ModuleProvider.getInstance();
                this.routers.map(router => {
                    let routing: IRouting[] = router.router.registerRoutes();
                    routing.map(r => {
                        let prefix = `${router.prefix}${r.prefix || ''}`.replace(/\/+/g, ':').replace(/^:+/, '');
                        let controllerDir = moduleProvider.getDirname(router.module, r.controller, 'Controller');
                        let ModController = require(controllerDir).default;
                        let controller = new ModController();
                        
                        r.sockets.map(s => {
                            let action = controller[`${s.action}Action`];
                            socket.on(`${prefix}${s.event}`, action(this.io, socket));
                        });
                    });
                });
            });
        }
    }
}
