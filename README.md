# Koa 2 mini router

No kidding, yet another flavour of Koa 2 routing is here.

Everything works pretty close to your expectations:

```es6
// router.js

import Router from 'koa-router2';

const router = new Router();

export default router;

// Simple routes

router.get('/', async ctx => ctx.body = 'Hi');

// URL params

router.get('/users/:id', async ctx => {
   const userId = ctx.params.id;
   const user = await User.findOne(userId);
   ctx.body = user.toJSON();
});

// Express-style middleware routes

router.use('/auth', requireAuth());

router.use('/auth/login', async (ctx, next) => {
   // do stuff
   return next();
});

router.get('/auth/login', async ctx => {
  // both requireAuth and "do stuff" were executed
  // ...
});

// Multiple routers can be composed (with or without prefix)

router.use('/users', usersRouter);

router.use(pagesRouter);
```

Routers are mounted to Koa application as middlewares using `.routes()` method:

```es6
// app.js
import Koa from 'koa';
import router from './router';

const app = new Koa();

// Mount router
app.use(router.routes());
```

See [test](test) for more examples. Have fun!
