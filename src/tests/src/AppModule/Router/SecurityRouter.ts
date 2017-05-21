import {Request, Response, NextFunction, RequestHandler, Router} from 'express'
import {IExpressRouter} from '../../../../../';

export default class SecurityRouter implements IExpressRouter {

    public getPriority(): number {
        return 2000;
    }

    public getHandlers(): RequestHandler[] {
        return [
            this.addParamsMiddleware(),
        ]
    }

    protected addParamsMiddleware(): RequestHandler {
        return (req: Request, res: Response, next: NextFunction) => {
            req.params.security = false;
            req.params.router = false;
            next();
        }
    }

}
