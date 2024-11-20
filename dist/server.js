"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./database/db");
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const musicRouter_1 = __importDefault(require("./routes/musicRouter"));
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.pool.connect();
        console.log(`Connection with the database established 🟢`);
        client.release();
        app.use("/api", authRouter_1.default, userRouter_1.default, musicRouter_1.default);
        app.listen(PORT, () => {
            console.log(`Server is running on portrt ${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting servesssr:", error);
    }
});
startServer();
