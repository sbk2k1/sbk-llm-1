const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const ffmpeg = require('fluent-ffmpeg');
const { TranscribeStreamingClient, StartStreamTranscriptionCommand } = require("@aws-sdk/client-transcribe-streaming");
const { PassThrough } = require('stream');
const { fromUtf8, toUtf8 } = require("@aws-sdk/util-utf8-node");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const REGION = 'ap-south-1'; // Change to your AWS region
const transcribeClient = new TranscribeStreamingClient({ region: REGION });

wss.on('connection', async (ws) => {
  console.log('Client connected');

  const audioStream = new PassThrough();

  const command = new StartStreamTranscriptionCommand({
    LanguageCode: 'en-US',
    MediaEncoding: 'pcm',
    MediaSampleRateHertz: 16000,
    AudioStream: async function* () {
      for await (const chunk of audioStream) {
        yield { AudioEvent: { AudioChunk: chunk } };
      }
    }(),
  });

  const response = await transcribeClient.send(command);

  // Send transcribed text back to client
  (async () => {
    for await (const event of response.TranscriptResultStream) {
      for (const result of event.TranscriptEvent.Transcript.Results) {
        const text = result.Alternatives[0]?.Transcript;
        if (text) {
          ws.send(JSON.stringify({
            type: result.IsPartial ? 'interim' : 'final',
            text
          }));
        }
      }
    }
  })();

  // FFmpeg converts to required 16kHz PCM mono stream
  const ffmpegStream = new PassThrough();
  ffmpeg()
    .input(ffmpegStream)
    .audioFrequency(16000)
    .audioChannels(1)
    .format('s16le')
    .on('error', err => console.error('FFmpeg error:', err))
    .pipe(audioStream);

  ws.on('message', (message) => {
    if (Buffer.isBuffer(message)) {
      ffmpegStream.write(message);
    } else if (message.toString() === '{"action":"end_stream"}') {
      ffmpegStream.end();
      audioStream.end();
    }
  });

  ws.on('close', () => {
    ffmpegStream.destroy();
    audioStream.destroy();
  });
});

server.listen(8080, () => {
  console.log('WebSocket server running on ws://localhost:8080');
});
