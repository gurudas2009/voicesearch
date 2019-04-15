
var  express = require('express');
var  bodyParser = require('body-parser');
var  http = require('http');
var https = require('https');
const path = require('path');
const router = express.Router();
const uuid = require('uuid');
const fs = require('fs');
const multer  = require('multer'); //use multer to upload blob data
const upload = multer(); // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))


var  server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());

server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));


router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
    //__dirname : It will resolve to your project folder.
  });



server.post('/sendAudioToBot',upload.single('soundBlob'), (req, res) => {

   recogniseSpeech(req.file,res);

  });
 


// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

// The name of the audio file to transcribe
///const fileName = './resources/audio.raw';


function recogniseSpeech(_audio,_httpResponse)
{

// Reads a local audio file and converts it to base64
//const file = fs.readFileSync(fileName);
//const audioBytes = file.toString('base64');
const audioBytes = _audio.buffer.toString('base64');


// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const audio = {
  content: audioBytes,
};
const config = {
  //encoding: 'LINEAR16',
 // sampleRateHertz: 16000,
  languageCode: 'en-US',
};
const request = {
  audio: audio,
  config: config,
};

// Detects speech in the audio file
client
  .recognize(request)
  .then(data => {
    const response = data[0];
    //console.log(response);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
//    console.log(`Transcription: ${transcription}`);

return _httpResponse.json({
speechText:transcription

});

  })
  .catch(err => {
    
return _httpResponse.json({
  speechText:'error'
  
  });
  });

}




server.get('/record.js',function(req,resp) {

  fs.readFile("record.js", function (error, pgResp) {
    if (error) {
        resp.writeHead(404);
        resp.write('Contents you are looking are Not Found');
    } else {
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write(pgResp);
    }
     
    resp.end();
});



});

server.get('/record-main.js',function(req,resp) {

  fs.readFile("record-main.js", function (error, pgResp) {
    if (error) {
        resp.writeHead(404);
        resp.write('Contents you are looking are Not Found');
    } else {
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write(pgResp);
    }
     
    resp.end(); 
});



});


server.use('/', router);
server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});