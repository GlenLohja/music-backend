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
exports.query = exports.pool = void 0;
// db.ts
const pg_1 = require("pg");
require("dotenv/config");
// Configure the PostgreSQL connection pool
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST_SUPERBASE,
    user: process.env.DB_USER_SUPERBASE,
    password: process.env.DB_PASSWORD_SUPERBASE,
    database: process.env.DB_DATABASE_SUPERBASE,
    port: Number(process.env.DB_PORT_SUPERBASE),
});
// Generic query function to interact with PostgreSQL
const query = (text, params) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield exports.pool.connect();
    try {
        const result = yield client.query(text, params);
        return result;
    }
    catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.query = query;
