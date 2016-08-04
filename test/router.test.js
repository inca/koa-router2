import request from 'supertest';
import Router from '../src/router';

describe('Router', function() {

  context('methods', function() {

    const router = new Router();
    router.get('/', async ctx => ctx.body = 'Hi, get');
    router.post('/', async ctx => ctx.body = 'Hi, post');
    router.all('/', async ctx => ctx.body = 'Hi, everyone');

    it('answers GET requests', done => {
      request(router.app.listen())
        .get('/')
        .expect('Hi, get', done);
    });

    it('answers POST requests', done => {
      request(router.app.listen())
        .post('/')
        .expect('Hi, post', done);
    });

    it('answers other requests', done => {
      request(router.app.listen())
        .put('/')
        .expect('Hi, everyone', done);
    });

  });

  context('paths', function() {

    const router = new Router();
    router.get('/', async ctx => ctx.body = 'Welcome');
    router.get('/hello', async ctx => ctx.body = 'Hello');

    it('matches /', done => {
      request(router.app.listen())
        .get('/')
        .expect('Welcome', done);
    });

    it('matches paths', done => {
      request(router.app.listen())
        .get('/hello')
        .expect('Hello', done);
    });

    it('returns 404 on unknown routes', done => {
      request(router.app.listen())
        .get('/smth')
        .expect(404, done);
    });

  });

  context('params', function() {

    const router = new Router();
    router.get('/hi/:name', async ctx => ctx.body = 'Hi, ' + ctx.params.name);
    router.get('/file/*', async ctx => ctx.body = ctx.params[0]);

    it('captures named parameters', done => {
      request(router.app.listen())
        .get('/hi/jack')
        .expect('Hi, jack', done);
    });

    it('matches splats', done => {
      request(router.app.listen())
        .get('/file/foo/bar/baz')
        .expect('foo/bar/baz', done);
    });

  });

  context('mount', function() {

    const prefixed = new Router();
    prefixed.get('/hi', async ctx => ctx.body = 'Hi!');
    const unprefixed = new Router();
    unprefixed.get('/hello', async ctx => ctx.body = 'Hello!');

    const router = new Router();
    router.mount('/prefix', prefixed);
    router.mount(unprefixed);

    it('mounts with prefix', done => {
      request(router.app.listen())
        .get('/prefix/hi')
        .expect('Hi!', done);
    });

    it('mounts without prefix', done => {
      request(router.app.listen())
        .get('/hello')
        .expect('Hello!', done);
    });

    it('does not match without prefix', done => {
      request(router.app.listen())
        .get('/hi')
        .expect(404, done);
    });

  });

  context('middleware', function() {

    const router = new Router();
    router.use(async (ctx, next) => {
      ctx.body = '1';
      await next();
    });
    router.use(async (ctx, next) => {
      ctx.body += '2';
      await next();
    });
    router.use(async (ctx, next) => {
      ctx.body += '3';
      await next();
    });
    router.get('/', async ctx => {
      ctx.body += '4';
    });

    it('execute .use middleware in order', done => {
      request(router.app.listen())
        .get('/')
        .expect('1234', done);
    });

  });

});

