import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import {expect} from 'chai';
import {ConfigProvider, ModuleProvider, ViewProvider} from '../../';
import AppKernel from './AppKernel';

describe('App > Kernel >', function() {
    let kernel = new AppKernel();

    after('close server', function() {
        kernel.destroy();
    });

    it('should load AppModule in the kernel', function() {
        let modules = ModuleProvider.getInstance().getModules().filter(m => (m.name() === 'AppModule'));

        expect(modules).to.have.lengthOf(1);
    });

    it('should add AppBundle views directory to the kernel', function() {
        let modules = ModuleProvider.getInstance().getModules().filter(m => (m.name() === 'AppModule'));

        let viewsDir = modules[0].getViewsDir();
        if (!(fs.existsSync(viewsDir) && fs.lstatSync(viewsDir).isDirectory())) mkdirp.sync(viewsDir);
        let viewsDirectories = ViewProvider.getInstance().getViewDirectories();

        expect(viewsDirectories).to.have.lengthOf(1);
        expect(viewsDirectories[0]).to.be.equal(viewsDir);
    });

    it('should generate good path from shortcut string', function() {
        let modules = ModuleProvider.getInstance().getModules().filter(m => (m.name() === 'AppModule'));

        let pathProvider = ModuleProvider.getInstance();
        let c1 = pathProvider.getDirname(modules[0], 'Posts/PostsController', 'Controller');
        let c2 = pathProvider.getDirname(modules[0], '@AppModule:Posts/PostsController', 'Controller');

        let res = path.join(modules[0].dirname(), 'Controller', 'Posts/PostsController');
        expect(c1).to.be.equal(c2).to.be.equal(res);
    });

    it('should read configuration', function() {
        let configProvider = ConfigProvider.getInstance();
        let {user, password} = {user: 'root', password: 'root'};

        expect(configProvider.get('app_module.host')).to.be.equal('mysql');
        expect(configProvider.get('app_module.credentials.user')).to.be.equal(user);
        expect(configProvider.get('app_module.credentials.password')).to.be.equal(password);
        expect(configProvider.get('app_module.credentials')).to.be.eql({user, password});
        expect(configProvider.get('app_module').credentials.user).to.be.equals(user);
    });
});
