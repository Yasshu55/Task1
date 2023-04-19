const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

const videosDirectory = path.join(__dirname, 'videos');

const storage = multer.diskStorage({
  destination: videosDirectory,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

//  handle video uploads
app.post('/videos', upload.single('video'), (req, res) => {
  const video = req.file;

  if (!video){
    return res.status(400).send('No video file uploaded :(');
  }
  res.status(201).send('Video uploaded successfully!!!');
});

//stream a video
app.get('/videos/:videoName', (req, res) => {
  const videoName = req.params.videoName;
  const videoPath = path.join(videosDirectory, videoName);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found!!!!');
  }
  const videoStream = fs.createReadStream(videoPath);
  res.setHeader('Content-Type', 'video/mp4');

  videoStream.pipe(res);
});

//download a video
app.get('/videos/:videoName/download', (req, res) => {
  const videoName = req.params.videoName;
  const videoPath = path.join(videosDirectory, videoName);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found!!!!');
  }

  res.setHeader('Content-Disposition', 'attachment');
  res.sendFile(videoPath);
});

// localhost swerver
app.listen(3000, () => {
  console.log('Server running');
});
