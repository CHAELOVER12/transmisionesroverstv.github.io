const backendURL = "http://localhost:3000"; // Cambia esto por la URL de Railway

function sumarGol(equipo) {
  const marcador = document.getElementById("score");
  let [local, visitante] = marcador.textContent.split(" - ").map(Number);
  if (equipo === "local") local++;
  else visitante++;
  marcador.textContent = `${local} - ${visitante}`;
}