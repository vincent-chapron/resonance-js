import {Router, IRouting} from '../../../../../'
import PostsRouting from './routing/PostsRouting';

export default class AppRouter extends Router {
    public registerRoutes(): IRouting[] {
        let routing = [
            new PostsRouting(),
        ]

        return routing;
    }
}
