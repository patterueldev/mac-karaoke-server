"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GenericResponse_1 = __importDefault(require("./common/GenericResponse"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    var response = GenericResponse_1.default.success('Hello, world!');
    res.send(response);
});
// const { getFilesFromDirectory } = require('./fileUtils');
// const { reserveSong, reservedSongs, skipSong } = require('./karaoke');
// // Usage example
// const directoryPath = process.env.directoryPath;
// const filesArray = getFilesFromDirectory(directoryPath);
// // Routes
// // convert to typescript
// app.get('/test', (req: Request, res: Response) => {
//   res.send('Hello, world!');
// });
// app.get('/', (req, res) => {
//   res.send('Hello, world!');
// });
// app.get('/songs', (req, res) => {
//   res.send(filesArray);
// });
// app.post('/reserve', (req, res) => {
//   console.log(reserveSong);
//   var file = reserveSong(req.body.id);
//   res.send('Song reserved! Title: ' + file);
// });
// app.get('/reserved', (req, res) => {
//   res.send(reservedSongs);
// });
// app.post('/skip', (req, res) => {
//   res.send(skipSong());
// });
// app.get('/testjson', (req, res) => {
//   res.send({'test': 'test'});
// });
exports.default = router;
