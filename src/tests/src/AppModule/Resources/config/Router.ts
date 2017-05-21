import {IExpressRouter, IRouting, Router} from '../../../../../';
import PostsRouting from './routing/PostsRouting';
import MiddlewaresRouter from '../../Router/MiddlewaresRouter';
import SecurityRouter from '../../Router/SecurityRouter';

export default class AppRouter extends Router {
    public registerRoutes(): IRouting[] {
        let routing = [
            new PostsRouting(),
        ]

        return routing;
    }

    public registerRouter(): IExpressRouter[] {
        let routers = [
            new SecurityRouter(),
            new MiddlewaresRouter(),
        ]

        return routers;
    }
}
