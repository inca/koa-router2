'use strict';

const request = require('supertest');
const Router = require('../src/router');

describe('Router', function() {
  let server = null;

  afterEach(done => {
    if (server) {
      server.close(() => done());
      server = null;
    }
  });

  context('methods', function() {

    const router = new Router();
    router.get('/', async ctx => ctx.body = 'Hi, get');
    router.post('/', async ctx => ctx.body = 'Hi, post');
    router.all('/', async ctx => ctx.body = 'Hi, everyone');

    beforeEach(() => {
      server = router.app.listen();
    });

    it('answers GET requests', done => {
      request(server)
        .get('/')
        .expect('Hi, get', done);
    });

    it('answers POST requests', done => {
      request(server)
        .post('/')
        .expect('Hi, post', done);
    });

    it('answers other requests', done => {
      request(server)
        .put('/')
        .expect('Hi, everyone', done);
    });

  });

  context('paths', function() {

    const router = new Router();
    router.get('/', async ctx => ctx.body = 'Welcome');
    router.get('/hello', async ctx => ctx.body = 'Hello');

    beforeEach(() => {
      server = router.app.listen();
    });

    it('matches /', done => {
      request(server)
        .get('/')
        .expect('Welcome', done);
    });

    it('matches paths', done => {
      request(server)
        .get('/hello')
        .expect('Hello', done);
    });

    it('returns 404 on unknown routes', done => {
      request(server)
        .get('/smth')
        .expect(404, done);
    });

  });

  context('params', function() {

    const router = new Router();
    router.get('/hi/:name', async ctx => ctx.body = 'Hi, ' + ctx.params.name);
    router.get('/file/*', async ctx => ctx.body = ctx.params[0]);

    beforeEach(() => {
      server = router.app.listen();
    });

    it('captures named parameters', done => {
      request(server)
        .get('/hi/jack')
        .expect('Hi, jack', done);
    });

    it('matches splats', done => {
      request(server)
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

    beforeEach(() => {
      server = router.app.listen();
    });

    it('mounts with prefix', done => {
      request(server)
        .get('/prefix/hi')
        .expect('Hi!', done);
    });

    it('mounts without prefix', done => {
      request(server)
        .get('/hello')
        .expect('Hello!', done);
    });

    it('does not match without prefix', done => {
      request(server)
        .get('/hi')
        .expect(404, done);
    });

  });

  context('middleware', function() {

    const router = new Router();

    beforeEach(() => {
      server = router.app.listen();
    });

    router.use(async (ctx, next) => {
      ctx.body = '1';
      await next();
      ctx.body += '1';
    });
    router.use(async (ctx, next) => {
      ctx.body += '2';
      await next();
      ctx.body += '2';
    });
    router.use(async (ctx, next) => {
      ctx.body += '3';
      await next();
      ctx.body += '3';
    });
    router.get('/', async ctx => {
      ctx.body += '4';
    });

    it('execute .use middleware in order', done => {
      request(server)
        .get('/')
        .expect('1234321', done);
    });

  });

});

