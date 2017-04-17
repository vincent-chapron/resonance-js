import {Controller} from '../../../../';

export default class PostsController extends Controller {
    getPostsAction(req, res) {
        res.render('posts.pug');
    }

    getPostAction(req, res) {
        res.json({post: req.params.id});
    }

    getSocketEventAction(io, socket) {
        return (data: any) => {
            socket.emit('say:hello', 'Hello Socket !');
        }
    }
}
