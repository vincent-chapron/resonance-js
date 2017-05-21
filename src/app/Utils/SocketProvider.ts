import * as fs from 'fs';
import * as http from 'http';
import * as socket from 'socket.io';
import {IRouting} from '../Routing';
import {ModuleProvider} from './ModuleProvider';
import {RouterProvider} from './RouterProvider';

export class SocketProvider {
    private static instance: SocketProvider = null;

    protected moduleProvider: ModuleProvider;

    private constructor() {
        this.moduleProvider = ModuleProvider.getInstance();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new SocketProvider();
        }
        return this.instance;
    }

    public applySockets(server: http.Server) {
        let routers = RouterProvider.getInstance().getAppRouters();
        let io = socket(server);

        io.on('connection', socket => {
            let moduleProvider = ModuleProvider.getInstance();
            routers.map(router => {
                let routing: IRouting[] = router.router.registerRoutes();
                routing.map(r => {
                    let prefix = `${router.prefix}${r.prefix || ''}`.replace(/\/+/g, ':').replace(/^:+/, '');
                    let controllerDir = moduleProvider.getDirname(router.module, r.controller, 'Controller');
                    let ModController = require(controllerDir).default;
                    let controller = new ModController();

                    r.sockets.map(s => {
                        let action = controller[`${s.action}Action`];
                        socket.on(`${prefix}${s.event}`, action(io, socket));
                    });
                });
            });
        });
        return io;
    }
}
