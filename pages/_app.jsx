"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("next/router");
const react_1 = require("react");
const PageHeader_1 = __importDefault(require("../components/PageHeader"));
const Container_1 = __importDefault(require("react-bootstrap/Container"));
const Row_1 = __importDefault(require("react-bootstrap/Row"));
const Col_1 = __importDefault(require("react-bootstrap/Col"));
require("./css/bootstrap.min.css");
require("./css/styles.css");
const fetchDataPage = (pathname) => {
    switch (pathname) {
        case '/top/TOP':
            return 'home';
        case '/laser/laser-index.html':
            return 'laser';
        case '/mfm/MFM':
            return 'mfm';
        default:
            return '';
    }
};
function CompareNext({ Component, pageProps }) {
    const { pathname } = (0, router_1.useRouter)();
    console.log('pathname:' + pathname);
    (0, react_1.useEffect)(() => {
        const element = document.body;
        element.dataset.page = fetchDataPage(pathname);
        if (element.dataset.page == 'home') {
            document.body.style.background = 'gray';
        }
    }, [pathname]);
    (0, react_1.useEffect)(() => {
        const loaded = async () => {
            const replaceText = (selector, text) => {
                const element = document.getElementById(selector);
                if (element)
                    element.innerText = text;
            };
            const res = await fetch('/api/process');
            const data = await res.json();
            console.log('process.versions:' + JSON.stringify(data.versions));
            for (const dependency of ['node']) {
                console.log('process.versions[' + dependency + ']:' + data.versions[dependency]);
                replaceText(`${dependency}-version`, data.versions[dependency]);
            }
        };
        loaded();
    }, []);
    return (<>
    <PageHeader_1.default namespace="top" i18nKey="TITLE"/>
    <Component {...pageProps}/>
    <hr />
    <Container_1.default fluid>
      <Row_1.default>
        <Row_1.default className="row-cols-2">
          <Col_1.default>
            We are using Node.js <span id="node-version"></span>,
            
          </Col_1.default>
        </Row_1.default>
      </Row_1.default>
    </Container_1.default>
    </>);
}
exports.default = CompareNext;
//# sourceMappingURL=_app.jsx.map