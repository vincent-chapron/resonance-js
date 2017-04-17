import {Kernel, Module} from '../../';
import AppModule from '../src/AppModule/AppModule';

export default class AppKernel extends Kernel {
    protected registerModules(): Module[] {
        let modules: Module[] = [
            new AppModule(),
        ];

        return modules;
    }

    protected dirname(): string {
        return __dirname;
    }
}
