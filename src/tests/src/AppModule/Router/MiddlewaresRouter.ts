import {Request, Response, NextFunction, RequestHandler, Router} from 'express'
import {IExpressRouter} from '../../../../../';

export default class MiddlewaresRouter implements IExpressRouter {

    public getPriority(): number {
        return 1000;
    }

    public getHandlers(): RequestHandler[] {
        return [
            this.addParamsMiddleware(),
        ]
    }

    protected addParamsMiddleware(): RequestHandler {
        return (req: Request, res: Response, next: NextFunction) => {
            req.params.router = true;
            next();
        }
    }

}
