import * as path from 'path';
import {Config} from '../app';

export abstract class Module {
    protected configDir: string = 'Resources/Config';
    protected publicDir: string = 'Resources/public';
    protected viewsDir: string = 'Resources/views';

    public abstract name(): string;
    public abstract dirname(): string;

    public getViewsDir(): string {
        return path.join(this.dirname(), this.viewsDir);
    }

    public getPublicDir(): string {
        return path.join(this.dirname(), this.publicDir);
    }

    public getConfigDir(): string {
        return path.join(this.dirname(), this.configDir);
    }

    public addConfiguration(): Config {
        return null;
    }

    public loadRoute() {

    }
}
