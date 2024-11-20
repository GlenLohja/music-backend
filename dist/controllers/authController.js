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
exports.loginUser = exports.registerUser = void 0;
const db_1 = require("../database/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const result = yield (0, db_1.query)("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id", [name, email, hashedPassword]);
        const userId = result.rows[0].id;
        yield (0, db_1.query)("INSERT INTO playlists (name, user_id) VALUES ($1, $2)", ['Favorites', userId]);
        return res.status(201).json({ message: "User was created successfully!" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!" });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = req.user;
    try {
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        return res.status(200).json({ user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }, token, message: "User successfully Logged in!" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!" });
    }
});
exports.loginUser = loginUser;
