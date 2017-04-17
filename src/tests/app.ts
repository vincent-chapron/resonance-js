import AppKernel from './app/AppKernel';

let kernel = new AppKernel();
kernel.enableSocket();
kernel.listen(3000);
(kernel as any).server.on('listening', () => console.log('running ...'));
