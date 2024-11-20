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
exports.checkUserData = void 0;
const checkUserData = (checkForAllFields) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        try {
            if ((!name && checkForAllFields) || !email || !password) {
                return res.status(403).json({ message: "All fields are required!" });
            }
            else {
                next();
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal server error!" });
        }
    });
};
exports.checkUserData = checkUserData;
