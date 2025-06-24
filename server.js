const WebSocket = require('ws');
const fs = require('fs');
const { spawn } = require('child_process');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use('/replays', express.static('uploads'));
app.use(express.static('public'));

const server = app.listen(PORT, () => console.log(`Servidor web escuchando en http://localhost:${PORT}`));
const wss = new WebSocket.Server({ server });
wss.on('connection', ws => {
  const nombreArchivo = `uploads/partido_${Date.now()}.mp4`;
  const ffmpeg = spawn('ffmpeg', ['-i', 'pipe:0', '-c:v', 'libx264', '-preset', 'veryfast', nombreArchivo]);
  ws.on('message', msg => ffmpeg.stdin.write(msg));
  ws.on('close', () => ffmpeg.kill('SIGINT'));
});