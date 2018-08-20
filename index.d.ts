import * as Koa from 'koa';
export = Router;

declare class Router {
    constructor();

    app: Koa;

    routes(): Koa.Middleware;

    mount(prefix: string, router: Router): void;
    acl(prefix: string, ...handlers: Koa.Middleware[]): void;
    bind(prefix: string, ...handlers: Koa.Middleware[]): void;
    checkout(prefix: string, ...handlers: Koa.Middleware[]): void;
    connect(prefix: string, ...handlers: Koa.Middleware[]): void;
    copy(prefix: string, ...handlers: Koa.Middleware[]): void;
    delete(prefix: string, ...handlers: Koa.Middleware[]): void;
    get(prefix: string, ...handlers: Koa.Middleware[]): void;
    head(prefix: string, ...handlers: Koa.Middleware[]): void;
    link(prefix: string, ...handlers: Koa.Middleware[]): void;
    lock(prefix: string, ...handlers: Koa.Middleware[]): void;
    'm-search'(prefix: string, ...handlers: Koa.Middleware[]): void;
    merge(prefix: string, ...handlers: Koa.Middleware[]): void;
    mkactivity(prefix: string, ...handlers: Koa.Middleware[]): void;
    mkcalendar(prefix: string, ...handlers: Koa.Middleware[]): void;
    mkcol(prefix: string, ...handlers: Koa.Middleware[]): void;
    move(prefix: string, ...handlers: Koa.Middleware[]): void;
    notify(prefix: string, ...handlers: Koa.Middleware[]): void;
    options(prefix: string, ...handlers: Koa.Middleware[]): void;
    patch(prefix: string, ...handlers: Koa.Middleware[]): void;
    post(prefix: string, ...handlers: Koa.Middleware[]): void;
    propfind(prefix: string, ...handlers: Koa.Middleware[]): void;
    proppatch(prefix: string, ...handlers: Koa.Middleware[]): void;
    purge(prefix: string, ...handlers: Koa.Middleware[]): void;
    put(prefix: string, ...handlers: Koa.Middleware[]): void;
    rebind(prefix: string, ...handlers: Koa.Middleware[]): void;
    report(prefix: string, ...handlers: Koa.Middleware[]): void;
    search(prefix: string, ...handlers: Koa.Middleware[]): void;
    subscribe(prefix: string, ...handlers: Koa.Middleware[]): void;
    trace(prefix: string, ...handlers: Koa.Middleware[]): void;
    unbind(prefix: string, ...handlers: Koa.Middleware[]): void;
    unlink(prefix: string, ...handlers: Koa.Middleware[]): void;
    unlock(prefix: string, ...handlers: Koa.Middleware[]): void;
    unsubscribe(prefix: string, ...handlers: Koa.Middleware[]): void;

    del(prefix: string, ...handlers: Koa.Middleware[]): void;
    use(prefix: string, ...handlers: Koa.Middleware[]): void;
}
