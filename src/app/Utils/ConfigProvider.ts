import * as fs from 'fs';
import * as path from 'path';
import {Config} from '../Configuration/Config';
import {ModuleProvider} from './ModuleProvider';

export class ConfigProvider {
    private static instance: ConfigProvider = null;

    protected config: Config;

    private constructor() {}

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new ConfigProvider();
        }
        return this.instance;
    }

    public getAppConfig(dir: string, env: string = 'dev') {
        let moduleProvider = ModuleProvider.getInstance();
        let modules = moduleProvider.getModules();
        let data = {};
        let config = new Config('config');
        // TODO: load file according to environment
        let configFile = path.join(dir, 'config', 'config.json');

        modules.map(m => {
            let c = m.addConfiguration();
            if (c !== null) {
                config.push(c);
            }
        });
        if (fs.existsSync(configFile)
                && fs.lstatSync(configFile).isFile()) {
            data = require(configFile);
        }
        config.readConfiguration(data);
        this.config = config;
    }

    public get(key: string) {
        let keys = key.split('.');
        let config = this.config;
        keys.map(key => config = config.getKey(key));
        return config.getValue();
    }
}
