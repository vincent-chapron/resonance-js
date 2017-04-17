import {IRouting, IRoute, ISocket} from '../../../../../../'

export default class PostsRouting implements IRouting {
    public controller: string = 'PostsController';
    public prefix: string = '/posts';
    public routes: IRoute[] = [
        {uri: '/', action: 'getPosts'},
        {uri: '/:id', action: 'getPost'},
    ];
    public sockets: ISocket[] = [
        {event: ':event', action: 'getSocketEvent'}
    ];
}
