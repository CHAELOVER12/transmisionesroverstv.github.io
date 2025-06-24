// URL del backend (cambia localhost por la URL de tu servidor en Railway)
const backendURL = "transmisionesroverstvgithubio-production.up.railway.app"; // Cambia esto por la URL de Railway

// Función para sumar goles
function sumarGol(equipo) {
  const marcador = document.getElementById("score");
  let [local, visitante] = marcador.textContent.split(" - ").map(Number);
  if (equipo === "local") local++;
  else visitante++;
  marcador.textContent = `${local} - ${visitante}`;
}

// Configuración de WebRTC para recibir el stream
const liveVideo = document.getElementById('liveVideo');
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // Servidor STUN para conexiones externas
});
const socket = new WebSocket('wss://transmisionesroverstvgithubio-production.up.railway.app'); // Cambia localhost por la URL de tu servidor WebSocket

// Recibir el stream del emisor
peerConnection.ontrack = (event) => {
  liveVideo.srcObject = event.streams[0];
};

// Recibir la oferta del emisor a través del WebSocket
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'offer') {
    // Configurar la oferta del emisor como la descripción remota
    peerConnection.setRemoteDescription(message.data)
      .then(() => peerConnection.createAnswer()) // Crear una respuesta
      .then(answer => peerConnection.setLocalDescription(answer)) // Configurar la respuesta como la descripción local
      .then(() => {
        // Enviar la respuesta al emisor a través del WebSocket
        socket.send(JSON.stringify({ type: 'answer', data: peerConnection.localDescription }));
      });
  }
};
