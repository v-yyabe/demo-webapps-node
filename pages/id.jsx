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
      <br />
      <link_1.default href="https://aka.ms/id-tokens" legacyBehavior>
        <a target="_blank">Learn about claims in this ID token</a>
      </link_1.default>
      <br />
      <link_1.default href="/" legacyBehavior>
        <a>Go back</a>
      </link_1.default>
    </div>);
};
exports.default = IndexPage;
//# sourceMappingURL=id.jsx.map