"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./src/router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', router_1.default);
app.listen(3000, () => {
    console.log(`Server listening on port 3000`);
});
