import {RequestHandler} from 'express';

export interface IRoute {
    uri: string;
    methods?: string[];
    middlewares?: RequestHandler[];
    action: string;
}
