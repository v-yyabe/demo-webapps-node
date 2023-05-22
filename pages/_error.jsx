"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _404_1 = __importDefault(require("./404"));
const _500_1 = __importDefault(require("./500"));
const react_1 = __importDefault(require("react"));
const error_1 = __importDefault(require("next/error"));
const Error = ({ statusCode, title }) => {
    if (statusCode === 404) {
        return <_404_1.default />;
    }
    if (statusCode === 500) {
        return <_500_1.default />;
    }
    return (<div>
      <h1>{statusCode}</h1>
      <p>{title}</p>
    </div>);
};
Error.getInitialProps = async ({ err, res, AppTree, pathname, query }) => {
    const errorInitialProps = await error_1.default.getInitialProps({ err, res, AppTree, pathname, query });
    const statusCode = res?.statusCode || err?.statusCode || 404;
    return { ...errorInitialProps, statusCode };
};
exports.default = Error;
//# sourceMappingURL=_error.jsx.map