import * as path from 'path';

export abstract class Module {
    protected configDir: string = 'Resources/Config';
    protected publicDir: string = 'Resources/public';
    protected viewsDir: string = 'Resources/views';

    public abstract name(): string;
    public abstract dirname(): string;

    public getViewsDir(): string {
        return path.join(this.dirname(), this.viewsDir);
    }

    public getConfigDir(): string {
        return path.join(this.dirname(), this.configDir);
    }

    public loadRoute() {
        
    }
}
