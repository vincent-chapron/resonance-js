import * as express from 'express';
import {Module, Config} from '../../../';

export default class AppModule extends Module {
    public name(): string {
        return 'AppModule';
    }

    public dirname(): string {
        return __dirname;
    }

    public addConfiguration(): Config {
        let c = new Config('app_module');
        c.addKey('host').isString(false).setStringValue('127.0.0.1').end()
         .addKey('port').isNumber(false).setNumberValue(3000).end()
         .addKey('dbname').isString().end()
         .addKey('credentials')
            .addKey('user').isString().setStringValue('root').end()
            .addKey('password').isString().end()
         .end()
        .end();
        return c;
    }

    public appCreated(app: express.Express) {
        app.get('/appmodule/appcreated', (req, res) => res.json({success: true}));
    }
}
