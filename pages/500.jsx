"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const Custom500Page = () => {
    return (<div>
      <h1>500 - Internal Server Error</h1>
      <p>Sorry, something went wrong on our end.</p>
      <link_1.default href="/" legacyBehavior>
        <a>Go back to the homepage</a>
      </link_1.default>
    </div>);
};
exports.default = Custom500Page;
//# sourceMappingURL=500.jsx.map