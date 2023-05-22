"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRAPH_ME_ENDPOINT = exports.POST_LOGOUT_REDIRECT_URI = exports.REDIRECT_URI = exports.msalConfig = void 0;
const dotenv = __importStar(require("dotenv"));
const CLOUD_INSTANCE = process.env.CLOUD_INSTANCE || 'https://login.microsoftonline.com/';
dotenv.config();
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: CLOUD_INSTANCE + process.env.TENANT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
    system: {
        loggerOptions: {
            loggerCallback: (loglevel, message, containsPii) => {
                console.log(`${loglevel}:${message}, containsPii=${containsPii}`);
            },
            piiLoggingEnabled: false,
            logLevel: "Info",
        }
    }
};
exports.msalConfig = msalConfig;
const REDIRECT_URI = process.env.REDIRECT_URI;
exports.REDIRECT_URI = REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI;
exports.POST_LOGOUT_REDIRECT_URI = POST_LOGOUT_REDIRECT_URI;
const GRAPH_ME_ENDPOINT = process.env.GRAPH_API_ENDPOINT + "v2.0/me";
exports.GRAPH_ME_ENDPOINT = GRAPH_ME_ENDPOINT;
console.log('REDIRECT_URI:' + REDIRECT_URI);
console.log('POST_LOGOUT_REDIRECT_URI:' + POST_LOGOUT_REDIRECT_URI);
console.log('GRAPH_ME_ENDPOINT:' + GRAPH_ME_ENDPOINT);
//# sourceMappingURL=authConfig.js.map