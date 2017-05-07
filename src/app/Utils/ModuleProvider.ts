import * as path from 'path';
import {Module} from '../../modules/Module';

export class ModuleProvider {
    private static instance: ModuleProvider = null;
    private modules: Module[] = [];

    private constructor() {}

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new ModuleProvider();
        }
        return this.instance;
    }

    public getModules() {
        return this.modules;
    }

    public setModules(modules: Module[]): ModuleProvider {
        this.modules = modules;
        return this;
    }

    public getDirname(_module: Module, shortcut: string, subpath: string = '') {
        let mod = this.getModule(shortcut);
        if (mod !== null) {
            return path.join(mod.dirname(), subpath, shortcut.replace(/^[^:]+:/, ''));
        } else if (_module !== null) {
            return path.join(_module.dirname(), subpath, shortcut);
        }
    }

    public getModule(shortcut: string): Module {
        let results = shortcut.match(/^@([^:]+):/);
        if (results !== null) {
            for (let i = 0; i < this.modules.length; i += 1) {
                let mod = this.modules[i];
                if (mod.name() === results[1]) {
                    return mod;
                }
            }
        }
        return null;
    }
}
