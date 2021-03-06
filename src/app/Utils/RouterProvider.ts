import {Application, RequestHandler} from 'express';
import {IRouterConfiguration, IRouter, IExpressRouter} from '../Routing';
import {ModuleProvider} from './ModuleProvider';

export class RouterProvider {
    private static instance: RouterProvider = null;

    public readonly ROUTING: string = '/config/Routing';
    protected moduleProvider: ModuleProvider;
    protected routers: IRouter[] = [];
    protected handlers: RequestHandler[] = [];

    private constructor() {
        this.moduleProvider = ModuleProvider.getInstance();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new RouterProvider();
        }
        return this.instance;
    }

    public getAppRouters(kernelDirectory: string = null): IRouter[] {
        if (this.routers.length === 0 && kernelDirectory !== null) {
            let AppRouting, appRouting;
            try {
                AppRouting = require(`${kernelDirectory}${this.ROUTING}`).default;
                appRouting = new AppRouting();
            } catch (e) {
                console.error('Cannot find application routing.');
                return [];
            }
            let routerConfiguration: IRouterConfiguration[] = appRouting.registerRouters();
            routerConfiguration.map(config => this.addRouterFromConfiguration(config));
        }
        return this.routers;
    }

    public addRouterFromConfiguration(config: IRouterConfiguration) {
        let routerDirectory = this.moduleProvider.getDirname(null, config.resources, 'Resources/config');

        this.routers.push({
            module: this.moduleProvider.getModule(config.resources),
            router: new (require(routerDirectory).default)(),
            routerDir: routerDirectory,
            prefix: config.prefix || '',
        });
    }

    public getHandlers(): RequestHandler[] {
        if (this.handlers.length === 0) {
            let expressRouters: IExpressRouter[] = [];
            this.routers.map(router => expressRouters = [...expressRouters, ...router.router.registerRouter()]);
            expressRouters.sort((a, b) => b.getPriority() - a.getPriority());
            expressRouters.map(router => router.getHandlers().map(handler => this.handlers.push(handler)));
        }
        return this.handlers;
    }
}
