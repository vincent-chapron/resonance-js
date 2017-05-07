import {RequestHandler} from 'express';

export interface ISocket {
    event: string;
    action: string;
}
