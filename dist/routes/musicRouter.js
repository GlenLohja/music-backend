"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const musicController_1 = require("../controllers/musicController");
const playlistController_1 = require("../controllers/playlistController");
const jwtMiddleware_1 = require("../middlewares/jwtMiddleware");
const musicRouter = express_1.default.Router();
musicRouter.get('/songs/:playlistId', jwtMiddleware_1.authenticateJWT, playlistController_1.getSongsByUserIdAndPlaylistId);
musicRouter.get('/music', jwtMiddleware_1.authenticateJWT, musicController_1.getSongsFromGenius);
musicRouter.post('/save-song', jwtMiddleware_1.authenticateJWT, musicController_1.saveSong);
musicRouter.delete('/songs/:id', jwtMiddleware_1.authenticateJWT, musicController_1.deleteSong);
musicRouter.get('/playlists/', jwtMiddleware_1.authenticateJWT, playlistController_1.getPlaylists);
musicRouter.post('/playlists', jwtMiddleware_1.authenticateJWT, playlistController_1.savePlaylist);
exports.default = musicRouter;
