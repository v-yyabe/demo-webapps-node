"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.data = {
    "SELECT-MATERIAL": {
        "mildSteel": "軟鋼",
        "SUS": "ステンレス",
        "AL": "アルミ"
    },
    "VALIDATE-ASSISTGAS": {
        "mildSteel": ["oxygen", "nitrogen"],
        "SUS": ["nitrogen"],
        "AL": ["nitrogen"]
    },
    "VALIDATE-PARTS": {
        "mildSteel": ["1", "2", "3", "4"],
        "SUS": ["1", "2", "3", "4"],
        "AL": ["1", "3", "4"]
    },
    "VALIDATE-PLATETHICKNESS": {
        "mildSteel": ["1.0", "6.0", "9.0", "12.0", "19.0"],
        "SUS": ["1.0", "8.0", "15.0"],
        "AL": ["1.0", "8.0", "15.0"]
    },
    "validationMaterial1Feedback": "有効な材質1を選択してください。",
    "validationMaterial2Feedback": "有効な材質2を選択してください。"
};
//# sourceMappingURL=material.js.map