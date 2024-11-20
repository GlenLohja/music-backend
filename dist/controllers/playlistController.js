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
exports.savePlaylist = exports.getSongsByUserIdAndPlaylistId = exports.getPlaylists = void 0;
const db_1 = require("../database/db");
const getPlaylists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    try {
        const result = yield (0, db_1.query)(`SELECT * FROM playlists WHERE user_id = $1`, [userId.id]);
        const playlists = result.rows;
        if (!playlists) {
            return res.status(404).json({ message: `Playlist not found` });
        }
        return res.status(200).json({ message: 'Playlist data', playlists });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Internal server error` });
    }
});
exports.getPlaylists = getPlaylists;
const getSongsByUserIdAndPlaylistId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const playlistId = req.params.playlistId;
    try {
        console.log(playlistId);
        const result = yield (0, db_1.query)(`SELECT * FROM songs WHERE user_id = $1 AND playlist_id = $2`, [userId.id, playlistId]);
        const songs = result.rows;
        if (!songs) {
            return res.status(404).json({ message: `Songs not found` });
        }
        return res.status(200).json({ message: 'Songs data', songs });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Internal server error` });
    }
});
exports.getSongsByUserIdAndPlaylistId = getSongsByUserIdAndPlaylistId;
const savePlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const { playlist_name } = req.body;
    try {
        yield (0, db_1.query)("INSERT INTO playlists (name, user_id) VALUES ($1, $2)", [playlist_name, userId.id]);
        const result = yield (0, db_1.query)(`SELECT * FROM playlists WHERE user_id = $1`, [userId.id]);
        const playlists = result.rows;
        return res.status(201).json({ playlists, message: "Playlist was saved successfully!" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!" });
    }
});
exports.savePlaylist = savePlaylist;
