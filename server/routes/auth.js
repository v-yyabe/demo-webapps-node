"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const msal_node_1 = require("@azure/msal-node");
var { msalConfig, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } = require('../authConfig');
const router = express_1.default.Router();
const msalInstance = new msal_node_1.ConfidentialClientApplication(msalConfig);
const cryptoProvider = new msal_node_1.CryptoProvider();
async function redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams) {
    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
    req.session.pkceCodes = {
        challengeMethod: 'S256',
        verifier: verifier,
        challenge: challenge,
    };
    req.session.authCodeUrlRequest = {
        redirectUri: REDIRECT_URI,
        responseMode: 'form_post',
        codeChallenge: req.session.pkceCodes.challenge,
        codeChallengeMethod: req.session.pkceCodes.challengeMethod,
        ...authCodeUrlRequestParams,
    };
    req.session.authCodeRequest = {
        redirectUri: REDIRECT_URI,
        code: "",
        ...authCodeRequestParams,
    };
    try {
        const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
        res.redirect(authCodeUrlResponse);
    }
    catch (error) {
        next(error);
    }
}
router.get('/signin', async function (req, res, next) {
    req.session.csrfToken = cryptoProvider.createNewGuid();
    const state = cryptoProvider.base64Encode(JSON.stringify({
        csrfToken: req.session.csrfToken,
        redirectTo: '/'
    }));
    const authCodeUrlRequestParams = {
        state: state,
        scopes: [],
    };
    const authCodeRequestParams = {
        scopes: [],
    };
    return redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams);
});
router.get('/acquireToken', async function (req, res, next) {
    req.session.csrfToken = cryptoProvider.createNewGuid();
    const state = cryptoProvider.base64Encode(JSON.stringify({
        csrfToken: req.session.csrfToken,
        redirectTo: '/users/profile'
    }));
    const authCodeUrlRequestParams = {
        state: state,
        scopes: ["User.Read"],
    };
    const authCodeRequestParams = {
        scopes: ["User.Read"],
    };
    return redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams);
});
router.post('/redirect', async function (req, res, next) {
    if (req.body.state) {
        const state = JSON.parse(cryptoProvider.base64Decode(req.body.state));
        console.log('state.csrfToken:' + state.csrfToken);
        console.log('req.session.csrfToken:' + req.session.csrfToken);
        if (state.csrfToken === req.session.csrfToken) {
            req.session.authCodeRequest = {
                code: req.body.code,
                codeVerifier: req.session.pkceCodes?.verifier,
                scopes: ["openid", "profile", "offline_access"],
                redirectUri: process.env.MY_REDIRECT_URI || "http://localhost:3000/auth/redirect"
            };
            try {
                const tokenResponse = await msalInstance.acquireTokenByCode(req.session.authCodeRequest);
                req.session.accessToken = tokenResponse.accessToken;
                req.session.idToken = tokenResponse.idToken;
                req.session.account = tokenResponse.account;
                req.session.isAuthenticated = true;
                console.log('state.redirectTo:' + state.redirectTo);
                res.redirect(state.redirectTo);
            }
            catch (error) {
                next(error);
            }
        }
        else {
            next(new Error('csrf token does not match'));
        }
    }
    else {
        next(new Error('state is missing'));
    }
});
router.get('/signout', function (req, res) {
    const logoutUri = `${msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;
    console.log('logoutUri:' + logoutUri);
    req.session.destroy(() => {
        res.redirect(logoutUri);
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map