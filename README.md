# Resonance JS

- Using Express and SocketIo
- Real-Time App
- Typescript
- Works with it own Module System

### Architecture

    # Project
    my-project/
        app/
            config/
                Routing.ts      # Load Modules routes
            AppKernel.ts        # Register Modules
        bin/                    # WIP
        src/
            AppModule/          # Create your own modules
            OtherModule/
        node_modules/           # Use community resonance modules
        .gitignore
        app.ts
        package.json
        tsconfig.json

    # Module
    AppModule/
        Controller/
            PostsController.ts          # Create your controllers
        Resources/
            config/
                routing/
                    PostsRouting.ts     # Bind routes to controller action
                Router.ts               # Expose all your routes
            public/                     # Expose static files
            views/
                posts.pug               # Create your own views
        AppModule.ts

    

### Todo

- [ ] module configuration
- [x] apply middlewares
- [ ] security
- [ ] resonance command line
- [ ] boilerplate, compile .ts + move other files
- [ ] orm ?
- [ ] json configuration
- [ ] decorators configuration
