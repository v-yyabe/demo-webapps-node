"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const GetI18n = (props) => {
    const [value, setValue] = (0, react_1.useState)(props.key);
    const i18n = async () => {
        const baseUrl = process.env.BASE_URL;
        const data = {
            namespace: props.namespace,
            i18nKey: props.i18nKey
        };
        let url = new URL(baseUrl + '/api/i18n');
        Object.keys(data).forEach((key) => {
            console.log('key:' + key);
            const value = data[key] || "";
            url.searchParams.append(key, value);
            console.log('value:' + value);
        });
        console.log('url : ' + url);
        const resData = await fetch(url)
            .then(response => response.json())
            .then(data => {
            console.log(JSON.stringify(data.resData));
            return data.resData;
        });
        if (!resData) {
            console.log('resData:' + resData);
            setValue(resData);
        }
        else {
            setValue("");
        }
        console.log("i18n:value:" + value);
    };
    i18n();
    return (<div>{value}</div>);
};
exports.default = GetI18n;
//# sourceMappingURL=GetI18n.jsx.map