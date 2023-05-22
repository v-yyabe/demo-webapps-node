"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const next_1 = __importDefault(require("next"));
const path_1 = __importDefault(require("path"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const i18n_1 = __importDefault(require("./i18n"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
// const auth_1 = __importDefault(require("./routes/auth"));
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const server = (0, express_1.default)();
dotenv_1.default.config();
const baseUrl = process.env.BASE_URL;
console.log('process.env.BASE_URL:' + baseUrl);
app.prepare().then(() => {
    console.log('views folder:' + path_1.default.join(__dirname, '../pages'));
    server.set('views', path_1.default.join(__dirname, '../pages'));
    server.set('view engine', 'jsx');
    server.use((0, morgan_1.default)('dev'));
    server.use(express_1.default.json());
    server.use(express_1.default.urlencoded({ extended: false }));
    server.use((0, cookie_parser_1.default)());
    server.use(express_1.default.static(path_1.default.join(__dirname, '../pages')));
    server.use((0, serve_favicon_1.default)(path_1.default.join(__dirname, '../pages', 'favicon.ico')));
    server.use('/_next', express_1.default.static(path_1.default.join(__dirname, '../.next')));
    server.use((0, express_session_1.default)({
        secret: process.env.EXPRESS_SESSION_SECRET || "",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
        }
    }));
    server.use('/', index_1.default);
    //server.use('/users', users_1.default);
    //server.use('/auth', auth_1.default);
    server.get('/about', (req, res) => {
        return app.render(req, res, '/about');
    });
    server.get('/index', async (req, res) => {
        //const isAuthenticated = req.session.isAuthenticated !== undefined ? req.session.isAuthenticated.toString() : 'false';
        //const username = req.session.account?.username ?? '';
        //console.log("isAuthenticated :" + isAuthenticated);
        //.log("username :" + username);
        const locale = req.acceptsLanguages()[0] || 'en';
        console.log(locale);
        const localeResource = new i18n_1.default(locale, "top");
        console.log(await localeResource.t("TITLE"));
        return app.render(req, res, '/index');
    });
    server.get('/api', async (req, res) => {
        console.log('server.get:/api');
        const locale = req.acceptsLanguages()[0] || 'en';
        console.log(locale);
        const localeResource = new i18n_1.default(locale, "top");
        console.log(await localeResource.t("TITLE"));
        console.log('server.get:req.method:' + req.method);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: 'This is a GET request' });
    });
    server.get('/api/process', async (req, res) => {
        console.log('server.get:/api/process');
        const locale = req.acceptsLanguages()[0] || 'en';
        console.log(locale);
        const localeResource = new i18n_1.default(locale, "top");
        console.log(await localeResource.t("TITLE"));
        console.log('server.get:req.method:' + req.method);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ versions: process.versions });
    });
    server.get('/api/i18n', async (req, res) => {
        console.log('server.get:/api/i18n');
        console.log('server.get:req.method:' + req.method);
        const locale = req.acceptsLanguages()[0] || 'en';
        console.log(locale);
        console.log("req.params" + JSON.stringify(req.params));
        console.log("req.query" + JSON.stringify(req.query));
        const { namespace, i18nKey } = req.query;
        console.log('namespace:' + namespace);
        console.log('i18nKey:' + i18nKey);
        const localeResource = new i18n_1.default(locale, namespace?.toString());
        console.log(await localeResource.t(i18nKey?.toString() || ""));
        const data = await localeResource.t(i18nKey?.toString() || "");
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ resData: data });
    });
    server.all('*', (req, res) => {
        return handle(req, res);
    });
    server.use(function (req, res, next) {
        console.log(req.originalUrl);
        console.log(res.location);
        next((0, http_errors_1.default)(404));
    });
    server.use(function (err, req, res) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    });
    server.use((req, res) => {
        return handle(req, res);
    }).listen(port, (err) => {
        if (err)
            throw err;
        if (dev) {
            console.log(`> Ready on http://localhost:${port}`);
        }
        else {
            console.log(`> Ready on ${baseUrl}`);
        }
    });
}).catch(ex => {
    console.log('error:' + ex.stack);
    process.exit(1);
});
module.exports = server;
//# sourceMappingURL=server.js.map