"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const head_1 = __importDefault(require("next/head"));
const script_1 = __importDefault(require("next/script"));
const GetI18n_1 = __importDefault(require("./GetI18n"));
const PageHeader = (props) => {
    console.log(props);
    return (<>
    <head_1.default>
      <meta charSet="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Security-Policy" content="connect-src http://www.amada.co.jp http://localhost:3000 https://comparativeverificationtool.azurewebsites.net; default-src 'self' *://www.amada.co.jp *://localhost:3000 *://comparativeverificationtool.azurewebsites.net 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; "/>
      <title>
        <GetI18n_1.default namespace={props.namespace} i18nKey={props.i18nKey}/>
      </title>
    </head_1.default>
    <script_1.default src="../js/bootstrap.bundle.min.js"/>
    </>);
};
exports.default = PageHeader;
//# sourceMappingURL=PageHeader.jsx.map