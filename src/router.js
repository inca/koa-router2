'use strict';

const Koa = require('koa');
const pathToRegexp = require('path-to-regexp');
const mount = require('koa-mount');
const compose = require('koa-compose');
const { METHODS } = require('http');

module.exports = class Router {

  constructor() {
    this.app = new Koa();
    for (const METHOD of METHODS) {
      this[METHOD.toLowerCase()] = this._createRoute(METHOD);
    }
    this.del = this.delete;
    this.all = this._createRoute();
  }

  _createRoute(method) {
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
