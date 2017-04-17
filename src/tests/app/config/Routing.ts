import {Routing, IRouterConfiguration} from '../../../';

export default class AppRouting extends Routing {
    public registerRouters(): IRouterConfiguration[] {
        return [
            {prefix: '/app', resources: '@AppModule:Router'}
        ]
    }
}
