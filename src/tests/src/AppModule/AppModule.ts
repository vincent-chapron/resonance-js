import {Module} from '../../../';

export default class AppModule extends Module {
    public name(): string {
        return 'AppModule';
    }

    public dirname(): string {
        return __dirname;
    }
}
