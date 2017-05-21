import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as socket from 'socket.io';
import {Module} from '../modules/Module';
import {IRouter, IRouting, IRouterConfiguration} from './Routing';
import {ModuleProvider, RouteProvider, RouterProvider, SocketProvider, ViewProvider} from './Utils';

export abstract class Kernel {
    protected port: number;
    protected hasSocket: boolean = false;
    protected io: SocketIO.Server = null;
    protected app: express.Express = null;
    protected server: http.Server = null;
    protected viewEngine: string = 'pug';

    protected abstract registerModules(): Module[];
    protected abstract dirname(): string;

    public constructor() {
        let moduleProvider = ModuleProvider.getInstance();
        let routerProvider = RouterProvider.getInstance();

        moduleProvider.setModules(this.registerModules());
        routerProvider.getAppRouters(this.dirname());
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
        let routeProvider = RouteProvider.getInstance();

        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.addSettings();
        // TODO: add main middlewares
        this.app.use(routeProvider.applyPublicRoutes());
        this.app.use(routeProvider.applyRoutes());
        this.createSockets();
        // TODO: add error fallback
        this.server.listen(port);
    }

    public close() {
        if (this.server !== null) {
            this.server.close();
            (ModuleProvider.getInstance() as any)._instance = null;
            (RouterProvider.getInstance() as any)._instance = null;
            (RouteProvider.getInstance() as any)._instance = null;
            (ViewProvider.getInstance() as any)._instance = null;
            this.server = null;
        }
    }

    protected addSettings(): void {
        let viewProvider = ViewProvider.getInstance();

        this.app.set('view engine', this.viewEngine);
        this.app.set('views', viewProvider.getViewDirectories());
        this.app.set('port', this.port);
    }

    protected createSockets() {
        if (this.hasSocket) {
            let socketProvider = SocketProvider.getInstance();

            this.io = socketProvider.applySockets(this.server);
        }
    }
}
