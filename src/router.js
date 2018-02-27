'use strict';

const Koa = require('koa');
const pathToRegexp = require('path-to-regexp');
const mount = require('koa-mount');
const compose = require('koa-compose');
const { METHODS } = require('http');

class Router {

  constructor() {
    this.app = new Koa();
  }

  /**
   * Prefix handler, similar to Express's use
   */
  use(prefix, ...handlers) {
    if (typeof prefix == 'string') {
      this.app.use(createPathHandler(prefix, compose(handlers), { end: false }));
    } else {
      this.app.use(compose([prefix].concat(handlers)));
    }
  }

  routes() {
    return mount(this.app);
  }

  mount(prefix, router) {
    if (typeof prefix == 'string') {
      this.app.use(mount(prefix, convertRouter(router)));
    } else {
      this.app.use(mount(convertRouter(prefix)));
    }

  }

};

module.exports = Router;

for (const METHOD of METHODS) {
  Object.defineProperty(Router.prototype, METHOD.toLowerCase(), {
    value: createRoute(METHOD),
    writable: true,
    enumerable: false,
    configurable: true
  })
}

Object.defineProperty(Router.prototype, 'del', {
  value: Router.prototype.delete,
  writable: true,
  enumerable: false,
  configurable: true
});

Object.defineProperty(Router.prototype, 'all', {
  value: createRoute(),
  writable: true,
  enumerable: false,
  configurable: true
});

function createRoute(method) {
  return function(path, ...handlers) {
    this.app.use((ctx, next) => {
      if (!matchMethod(ctx, method)) {
        return next();
      }
      const handler = compose(handlers);
      return createPathHandler(path, handler)(ctx, next);
    });
  };
}

function convertRouter(handler) {
  if (!handler) {
    throw new Error('Handler should be defined.');
  }
  if (typeof handler.routes === 'function') {
    return handler.routes();
  }
  if (typeof handler == 'function') {
    return handler;
  }
  throw new Error(`Unsupported handler type: ${typeof handler == 'function'}`);
}

function createPathHandler(path, handler, options) {
  options = options || {};
  const keys = [];
  const re = pathToRegexp(path, keys, options);
  return function(ctx, next) {
    const m = re.exec(ctx.path);
    if (m) {
      const args = m.slice(1).map(decode);
      ctx.params = {};
      args.forEach((arg, i) => {
        ctx.params[i] = arg;
      });
      // This is probably incorrect: test with "zero-or-more" feature
      keys.forEach((key, i) => {
        ctx.params[key.name] = args[i];
      });
      return handler(ctx, next);
    }
    return next();
  }
}

function decode(val) {
  return val ? decodeURIComponent(val) : null;
}

function matchMethod(ctx, method) {
  if (!method) {
    return true;
  }
  return ctx.method === method ||
    method === 'GET' && ctx.method === 'HEAD' ||
    false;
}
