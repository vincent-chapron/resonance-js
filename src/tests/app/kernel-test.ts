import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import {expect} from 'chai';
import {ModuleProvider} from '../../';
import AppKernel from './AppKernel';

describe('App > Kernel >', function() {
    it('should load AppModule in the kernel', function() {
        let kernel = new AppKernel();
        let _kernel = (kernel as any);
        let modules = _kernel.moduleProvider.getModules().filter(m => (m.name() === 'AppModule'));

        expect(modules).to.have.lengthOf(1);
    });

    it('sould add AppBundle views directory to the kernel', function() {
        let kernel = new AppKernel();
        let _kernel = (kernel as any);
        let modules = _kernel.moduleProvider.getModules().filter(m => (m.name() === 'AppModule'));

        let viewsDir = modules[0].getViewsDir();
        if (!(fs.existsSync(viewsDir) && fs.lstatSync(viewsDir).isDirectory())) mkdirp.sync(viewsDir);
        let viewsDirectories = kernel.generateViewsDirectories();
        
        expect(viewsDirectories).to.have.lengthOf(1);
        expect(viewsDirectories[0]).to.be.equal(viewsDir);
    });

    it('sould generate good path from shortcut string', function() {
        let kernel = new AppKernel();
        let _kernel = (kernel as any);
        let modules = _kernel.moduleProvider.getModules().filter(m => (m.name() === 'AppModule'));

        let pathProvider = ModuleProvider.getInstance();
        let c1 = pathProvider.getDirname(modules[0], 'Posts/PostsController', 'Controller');
        let c2 = pathProvider.getDirname(modules[0], '@AppModule:Posts/PostsController', 'Controller');

        let res = path.join(modules[0].dirname(), 'Controller', 'Posts/PostsController');
        expect(c1).to.be.equal(c2).to.be.equal(res);
    });
});
