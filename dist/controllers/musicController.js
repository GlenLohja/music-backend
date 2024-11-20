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
exports.deleteSong = exports.saveSong = exports.getSongsFromGenius = void 0;
const db_1 = require("../database/db");
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("redis");
require("dotenv/config");
const GENIUS_API_URL = process.env.GENIUS_HOST + '/search';
const GENIUS_API_TOKEN = process.env.GENIUS_CLIENT_ACCESS_TOKEN;
const DEFAULT_EXPIRATION = Number(process.env.DEFAULT_EXPIRATION_TIME); // Default expiration time for cached data in seconds
const getSongsFromGenius = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(DEFAULT_EXPIRATION);
    const searchQuery = req.query.searchQuery;
    console.log('searchQuery', searchQuery);
    const searchQueryEncoded = encodeURIComponent(searchQuery);
    const userId = req.user.id;
    // Create a Redis client
    const redisClient = (0, redis_1.createClient)({
        url: process.env.REDIS_URL,
        socket: {
            reconnectStrategy: function (retries) {
                if (retries > 20) {
                    console.log("Too many attempts to reconnect. Redis connection was terminated");
                    return new Error("Too many retries.");
                }
                return retries * 500;
            }
        }
    });
    redisClient.on('error', error => console.error('Redis client error:', error));
    redisClient.connect();
    const cachedData = yield redisClient.get(`${searchQuery}`);
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const { rows } = yield (0, db_1.query)('SELECT genius_id FROM songs WHERE user_id=$1', [userId]);
        const updatedHits = parsedData.map((hit) => {
            const isSaved = rows.length > 0 && rows.some((row) => row.genius_id === hit.result.id);
            return Object.assign(Object.assign({}, hit.result), { isSaved });
        });
        return res.json(updatedHits);
    }
    try {
        console.log('searchQueryEncoded', searchQueryEncoded);
        const response = yield axios_1.default.get(GENIUS_API_URL, {
            params: {
                q: searchQueryEncoded
            },
            headers: {
                'Authorization': `Bearer ${GENIUS_API_TOKEN}`
            }
        });
        redisClient.set(`${searchQuery}`, JSON.stringify(response.data.response.hits));
        redisClient.expire(`${searchQuery}`, DEFAULT_EXPIRATION);
        if (response.data && response.data.response && response.data.response.hits) {
            const { rows } = yield (0, db_1.query)('SELECT genius_id FROM songs WHERE user_id=$1', [userId]);
            const updatedHits = response.data.response.hits.map((hit) => {
                const isSaved = rows.length > 0 && rows.some((row) => row.genius_id === hit.result.id);
                return Object.assign(Object.assign({}, hit.result), { isSaved });
            });
            return res.json(updatedHits);
        }
        else {
            return res.status(400).json({ message: 'No songs found' });
        }
    }
    catch (error) {
        console.error('Error fetching songs from Genius API:', error);
        return res.status(500).json({ message: 'Error fetching songs from Genius API' });
    }
});
exports.getSongsFromGenius = getSongsFromGenius;
const saveSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const { title, singer, cover, created_date, description, url, id, playlistId } = req.body;
    try {
        yield (0, db_1.query)("INSERT INTO songs (name, description, singer, cover_image, user_id, created_at, song_url, genius_id, playlist_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [title, description, singer, cover, userId.id, created_date, url, id, playlistId]);
        return res.status(201).json({ message: "Song was saved successfully!" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!" });
    }
});
exports.saveSong = saveSong;
const deleteSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const songId = req.params.id;
    try {
        const result = yield (0, db_1.query)("DELETE FROM songs WHERE user_id = $1 AND genius_id = $2", [userId.id, songId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Song not found` });
        }
        return res.status(200).json({ message: `Song deleted successfully` });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Internal server error` });
    }
});
exports.deleteSong = deleteSong;
