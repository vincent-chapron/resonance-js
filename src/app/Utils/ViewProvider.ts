import * as fs from 'fs';
import {ModuleProvider} from './ModuleProvider';

export class ViewProvider {
    private static instance: ViewProvider = null;

    protected moduleProvider: ModuleProvider;
    protected viewsDirectories: string[];

    private constructor() {
        this.moduleProvider = ModuleProvider.getInstance();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new ViewProvider();
        }
        return this.instance;
    }

    public getViewDirectories() {
        if (this.viewsDirectories.length === 0) {
            this.moduleProvider.getModules().map(mod => this.addViewsDirectory(mod.getViewsDir()));
        }
        return this.viewsDirectories;
    }

    protected addViewsDirectory(dir: string) {
        if (fs.existsSync(dir)
                && fs.lstatSync(dir).isDirectory()
                && this.viewsDirectories.indexOf(dir) === -1) {
            this.viewsDirectories.push(dir);
        }
    }
}
