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
                config.json     # json modules configuration
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
