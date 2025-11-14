"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
async function main() {
    const server = app_1.default.listen(config_1.default.port || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
}
main();
