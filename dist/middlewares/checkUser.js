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
exports.checkIfUserExists = void 0;
const db_1 = require("../database/db");
const checkIfUserExists = (checkForExistence) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        try {
            const result = yield (0, db_1.query)("SELECT * FROM users WHERE email=$1", [email]);
            if (checkForExistence) {
                if (result.rows.length > 0) {
                    req.user = result.rows[0];
                    next();
                }
                else {
                    return res.status(400).json({ message: "User does not exist!" });
                }
            }
            else {
                if (result.rows.length > 0) {
                    return res.status(404).json({ message: "User already exists" });
                }
                next();
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal server error!" });
        }
    });
};
exports.checkIfUserExists = checkIfUserExists;
