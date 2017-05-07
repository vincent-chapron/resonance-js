import {IRouterConfiguration, IRouter} from '../Routing';
import {ModuleProvider} from './ModuleProvider';

export class RouterProvider {
    private static instance: RouterProvider = null;

    public readonly ROUTING: string = '/config/Routing';
    protected moduleProvider: ModuleProvider;
    protected routers: IRouter[] = [];

    private constructor() {
        this.moduleProvider = ModuleProvider.getInstance();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new RouterProvider();
        }
        return this.instance;
    }

    public getAppRouters(kernelDirectory: string): IRouter[] {
        if (this.routers.length === 0) {
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
}
