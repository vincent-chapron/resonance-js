import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as socket from 'socket.io';
import {Module} from '../modules/Module';
import {IRouter, IRouting, IRouterConfiguration} from './Routing/Router';
import {ModuleProvider} from './Utils/ModuleProvider';

export abstract class Kernel {
    protected modules: Module[];
    protected routers: IRouter[] = [];
    protected routingDir: string;
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
        this.routingDir = `${this.dirname()}/config/Routing`;
        this.modules = this.registerModules();
        ModuleProvider.getInstance().setModules(this.modules);
        this.generateViewsDirectories();
        this.generateRoutes();
    }

    /**
     * Execute will parse args and run command
     */
    public execute() {}

    public enableSocket() {
        this.hasSocket = true;
    }

    /**
     * Listen will run an express server
     */
    public listen(port: number) {
        this.port = port;
        this.createApp();
        this.createServer();
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

    public createApp(): express.Express {
        if (this.app === null)
            this.app = express();
        return this.app;
    }

    public createServer(): http.Server {
        if (this.server === null)
            this.server = http.createServer(this.app);
        return this.server;
    }

    public addSettings(): void {
        this.app.set('view engine', this.viewEngine);
        this.app.set('views', this.viewsDirectories);
        this.app.set('port', this.port);
    }

    public setViewsEngine(engine: string) {
        this.viewEngine = engine;
    }

    public generateViewsDirectories(): string[] {
        this.modules.map(mod => this.addViewsDirectory(mod.getViewsDir()));
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

    public generateRoutes() {
        let AppRouting;
        try {
            AppRouting = require(this.routingDir).default;
        } catch (e) {console.log(e); return null;}
        let routing = new AppRouting();
        let routers: IRouterConfiguration[] = routing.registerRouters();
        let moduleProvider = ModuleProvider.getInstance();
        routers.map(config => {
            let routerDir = moduleProvider.getDirname(null, config.resources, 'Resources/config');
            this.routers.push({
                module: moduleProvider.getModule(config.resources),
                router: new (require(routerDir).default)(),
                routerDir: routerDir,
                prefix: config.prefix || '',
            });
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
