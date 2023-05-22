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
class i18n {
    static SUPPORT_LANG = ["ja", "en"];
    static DEFAULT_LANG = "ja";
    static _lang;
    static _ns;
    static _dir;
    static _dic;
    constructor(lang = "ja", ns = "default", dir = "./locales") {
        if (lang === null || !this.isSupport(lang)) {
            lang = i18n.DEFAULT_LANG;
        }
        i18n._lang = lang;
        i18n._ns = ns;
        i18n._dir = dir;
    }
    async load(lang, ns, dir) {
        const getDic = async (lang, ns, dir) => {
            var _a;
            const dic = await (_a = `${dir}/${lang}/${ns}`, Promise.resolve().then(() => __importStar(require(_a)))).then((moduleData) => {
                return moduleData.data;
            })
                .catch((error) => {
                console.log(error);
                return {};
            });
            return dic;
        };
        const dic = await getDic(lang, ns, dir);
        return dic;
    }
    isSupport(lang) {
        return i18n.SUPPORT_LANG.indexOf(lang) !== -1;
    }
    async t(key) {
        const p = await Promise.resolve().then(() => __importStar(require('./data/projectname'))).then((projectName) => {
            return projectName.data;
        })
            .catch((error) => {
            console.log(error);
            return { name: "" };
        });
        i18n._dic = await this.load(i18n._lang, i18n._ns, i18n._dir);
        if (key in i18n._dic) {
            let value;
            if (typeof i18n._dic[key] == "string") {
                const str = i18n._dic[key];
                value = str.replace("{{name}}", p.name);
            }
            else {
                value = i18n._dic[key];
            }
            return value;
        }
        return `${key}:` + "non-existent key value";
    }
}
exports.default = i18n;
;
//# sourceMappingURL=i18n.js.map