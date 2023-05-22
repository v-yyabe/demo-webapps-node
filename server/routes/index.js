"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const i18n_1 = __importDefault(require("../i18n"));
const router = express_1.default.Router();
const EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET || "Enter_the_Express_Session_Secret_Here";
router.use((0, express_session_1.default)({
    secret: EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
router.get('/', async (req, res) => {
    const isAuthenticated = req.session.isAuthenticated !== undefined ? req.session.isAuthenticated.toString() : 'false';
    const username = req.session.account?.username ?? '';
    console.log("isAuthenticated :" + isAuthenticated);
    console.log("username :" + username);
    const locale = req.acceptsLanguages()[0] || 'en';
    console.log(locale);
    const localeResource = new i18n_1.default(locale, "top");
    console.log(await localeResource.t("TITLE"));
    return res.redirect('/index');
});
exports.default = router;
//# sourceMappingURL=index.js.map