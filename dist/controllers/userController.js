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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const db_1 = require("../database/db");
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const result = yield (0, db_1.query)(`SELECT id, name, email FROM users WHERE id = $1`, [userId]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: `User not found` });
        }
        return res.status(200).json({ message: 'Profile data', user });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Internal server error` });
    }
});
exports.getUserProfile = getUserProfile;
