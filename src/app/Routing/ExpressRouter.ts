import {RequestHandler} from 'express';

export interface IExpressRouter {
    getPriority(): number;
    getHandlers(): RequestHandler[];
}
