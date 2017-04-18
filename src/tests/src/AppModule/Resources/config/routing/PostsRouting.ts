import {RequestHandler} from 'express';
import {IRouting, IRoute, ISocket} from '../../../../../../'
import paramProvider from '../../../Provider/ParamProvider';

export default class PostsRouting implements IRouting {
    public controller: string = 'PostsController';
    public prefix: string = '/posts';
    public middlewares: RequestHandler[] = [paramProvider('global', true)];
    public routes: IRoute[] = [
        {uri: '/', action: 'getPosts', middlewares: [paramProvider('undefined', true)]},
        {uri: '/:id', action: 'getPost', middlewares: [paramProvider('route', true)]},
    ];
    public sockets: ISocket[] = [
        {event: ':event', action: 'getSocketEvent'}
    ];
}
