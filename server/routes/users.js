"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const next_1 = __importDefault(require("next"));
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const router = express_1.default.Router();
const EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET || "Enter_the_Express_Session_Secret_Here";
const GRAPH_ME_ENDPOINT = process.env.GRAPH_ME_ENDPOINT || "https://graph.microsoft.com/";
router.use((0, express_session_1.default)({
    secret: EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
function isAuthenticated() {
    return (req, res, next) => {
        if (!req.session.isAuthenticated) {
            console.log("res.redirect:(!req.session.isAuthenticated):" + (!req.session.isAuthenticated));
            return res.redirect('/auth/signin');
        }
        next();
    };
}
router.get('/id', isAuthenticated(), async (req, res) => {
    try {
        const idTokenClaimsString = JSON.stringify(req.session.account?.idTokenClaims || {});
        return await app.render(req, res, '/id', { idTokenClaims: idTokenClaimsString });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});
router.get('/profile', isAuthenticated(), async (req, res, next) => {
    try {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${req.session.accessToken}`);
        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };
        console.log('GRAPH_ME_ENDPOINT:' + GRAPH_ME_ENDPOINT);
        const profile = await fetch(GRAPH_ME_ENDPOINT, requestOptions)
            .then(graphResponse => {
            return graphResponse.json();
        })
            .catch(error => {
            next(error);
        });
        return await app.render(req, res, '/profile', { profile });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map