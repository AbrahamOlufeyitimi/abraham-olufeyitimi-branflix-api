
import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from  'uuid';

const router = express.Router();

const idError = 
    {
        message: "No video with that id exists"
    };

const apiError = { message: "API_KEY required"}


router.route("/").get((req, res) => {
    let apiKey = req.query.api_key;
    if (!apiKey) {
        return res.status(401).json(apiError); 
    }
    let videosJSON = JSON.parse(fs.readFileSync("./data/videos.json", "utf8"));
    res.status(200).json(
        videosJSON.map(({id, title, channel, image}) => ({
            id, title, channel, image,
        }))
    );
}).post((req, res) => {
    let apiKey = req.query.api_key;

    if (!apiKey) {
        return res.status(401).json(apiError);
    }

    let body = req.body;

    if (!body.title || !body.description) {
        return res.status(400).json({message: "Title and description are required"});
    }
    
    let newVideo = {
        id: uuidv4(),
        title:  body.title,
        channel: "Mohan Muruge",
        image: "http://localhost:8080/images/Upload-video-preview.jpg",
        description: body.description,
        views: "0",
        likes: "0",
        duration: "6:45",
        video: "https://unit-3-project-api-0a5620414506.herokuapp.com/",
        timestamp: Date.now(),
        comments: []
    };

    let videosJSON = JSON.parse(fs.readFileSync("./data/videos.json", "utf8"));
    videosJSON.push(newVideo);
    fs.writeFileSync("./data/videos.json", JSON.stringify(videosJSON));
    res.status(201).json(newVideo);

});


router.route("/:id").get((req, res) => {
    let apiKey = req.query.api_key;

    if (!apiKey) {
        return res.status(401).json(apiError);
    }

    let videoID = req.params.id;
    let videosJSON = JSON.parse(fs.readFileSync("./data/videos.json", "utf8"));
    let selectedVideo = videosJSON.find((video) => video.id === videoID);

    if (!selectedVideo) {
        return res.status(404).json(idError);
    }

    return res.status(200).json(selectedVideo);
})

export default router;


