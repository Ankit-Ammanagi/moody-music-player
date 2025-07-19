const express = require('express');
const routes = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const songModel = require('../models/song.model');
const uploadFiles = require('../service/storage.service');

routes.get('/songs', async (req, res) => {
    const { mood } = req.query

    const songs =await songModel.find({
        mood
    })

    console.log(songs)

    res.status(200).json({
        message: "songs fetched successfully",
        songs
    })
})

routes.post('/song', upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "audioImage", maxCount: 1 }
]), async (req, res) => {
    const { title, artist, mood } = req.body;
    const { audio, audioImage } = await uploadFiles(req.files);

    console.log(audio);
    console.log(audioImage)

    const song = await songModel.create({
        title,
        artist,
        audio: audio.url,
        audioImage: audioImage.url,
        mood
    })

    res.status(201).json({
        message: "song uploaded",
        song
    })
})

module.exports = routes