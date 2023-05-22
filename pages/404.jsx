"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
const Custom404 = () => {
    const router = (0, router_1.useRouter)();
    console.log(router);
    return (<div>
      <h1>404 - Page Not Found</h1>
      <p>
        The page you are looking for does not exist.{' '}
        <link_1.default href="/" legacyBehavior>
          <a>Go back to the homepage</a>
        </link_1.default>
      </p>
    </div>);
};
exports.default = Custom404;
//# sourceMappingURL=404.jsx.map