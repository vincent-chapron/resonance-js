import {Request, Response, NextFunction, RequestHandler} from 'express'

export default function (param: string, value: any): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        req.params[param] = value;
        next();
    }
}
