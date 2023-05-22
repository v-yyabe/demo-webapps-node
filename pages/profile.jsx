"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const IndexPage = () => {
    return (<div>
      <h1>Hello, World!</h1>
      <link_1.default href="/" legacyBehavior>
        <a>Go back</a>
      </link_1.default>
    </div>);
};
exports.default = IndexPage;
//# sourceMappingURL=profile.jsx.map