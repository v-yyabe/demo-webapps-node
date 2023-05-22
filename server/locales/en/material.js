"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.data = {
    "SELECT-MATERIAL": {
        "mildSteel": "Mild Steel",
        "SUS": "Stainless",
        "AL": "Aluminum"
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
    "validationMaterial1Feedback": "Please select a valid Material1.",
    "validationMaterial2Feedback": "Please select a valid Material2."
};
//# sourceMappingURL=material.js.map