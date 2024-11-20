"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtMiddleware_1 = require("../middlewares/jwtMiddleware");
const userController_1 = require("../controllers/userController");
const userRouter = (0, express_1.Router)();
userRouter.get('/profile', jwtMiddleware_1.authenticateJWT, userController_1.getUserProfile);
exports.default = userRouter;
