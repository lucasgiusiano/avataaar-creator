window.addEventListener("load", () => {
  document.getElementById("rotacion").addEventListener("input", () => {
    const slider = document.getElementById("rotacion");

    document.getElementById("valor").textContent = `${slider.value}°`;
  });

  document.getElementById("zoom").addEventListener("input", () => {
    const slider = document.getElementById("zoom");
    document.getElementById("valorZoom").textContent = `${slider.value - 100}%`;
  });

  ocultarTemaRopa(document.getElementById("ropa").value);
  document.getElementById("ropa").addEventListener("input", (e) => {
    ocultarTemaRopa(e.target.value);
  });

  ocultarCabelloSombrero(document.getElementById("gorros").value);
  document.getElementById("gorros").addEventListener("input", (e) => {
    ocultarCabelloSombrero(e.target.value);
  });

  ocultarColorBarba(document.getElementById("barba").value);
  document.getElementById("barba").addEventListener("input", () => {
    ocultarColorBarba(e.target.value);
  });

  ocultarColorCabello(document.getElementById("barba").value);
  document.getElementById("cabello").addEventListener("input", () => {
    ocultarColorCabello(e.target.value);
  });

  // Escucha todos los elementos interactuables del formulario
  const elementosInteractuables = document.querySelectorAll("input, select, textarea");

  elementosInteractuables.forEach((elemento) => {
    // "input" para texto, sliders y "change" para radios y select
    const tipoEvento = elemento.type === "radio" || elemento.tagName === "SELECT" ? "change" : "input";
    elemento.addEventListener(tipoEvento, () => {
      generarAvatar();
    });
  });
});

function generarAvatar() {
  const nombre = document.getElementById("nombre").value;
  const colorSeleccionado = "&backgroundColor=" + document.querySelector('input[name="colorFondo"]:checked')?.value;
  const voltearCheckbox = document.getElementById("voltear");
  const voltear = "&flip=" + voltearCheckbox.checked.toString();
  const rotacion = "&rotate=" + document.getElementById("rotacion").value;
  const zoom = "&scale=" + document.getElementById("zoom").value;

  const colorPiel = "&skinColor=" + document.querySelector('input[name="colorPiel"]:checked')?.value;
  const cejas = "&eyebrows=" + document.getElementById("cejas").value;
  const ojos = "&eyes=" + document.getElementById("ojos").value;
  const boca = "&mouth=" + document.getElementById("boca").value;
  const barbaValor = document.getElementById("barba").value;
  const barba = barbaValor ? `&facialHair=${barbaValor}` : "";
  const colorBarba = barbaValor ? `&facialHairColor=${document.querySelector('input[name="colorBarba"]:checked')?.value || ""}` : "";
  const probabilidadBarba = barba === "" ? "0" : "100";

  const gorroVal = document.getElementById("gorros").value;
  const sombrero = "&top=" + gorroVal;
  const colorSombrero = "&hatColor=" + document.querySelector('input[name="colorSombrero"]:checked')?.value;
  const pelo = gorroVal !== "" ? "" : "&top=" + document.getElementById("cabello").value;
  const colorPelo = gorroVal !== "" ? "" : "&hairColor=" + document.querySelector('input[name="colorPelo"]:checked')?.value;

  const gafasValor = document.getElementById("gafas").value;
  const gafas = gafasValor ? `&accessories=${gafasValor}` : "";
  const colorGafas = gafasValor ? `&accessoriesColor=${document.querySelector('input[name="colorGafas"]:checked')?.value || ""}` : "";
  const probabilidadGafas = gafas === "" ? "0" : "100";

  const ropa = "&clothing=" + document.getElementById("ropa").value;
  const colorRopa = "&clothesColor=" + document.querySelector('input[name="colorRopa"]:checked')?.value;
  const temaRopa = "&clothingGraphic=" + document.getElementById("tema").value;

  const url = `https://api.dicebear.com/9.x/avataaars/svg?seed=${nombre}${colorSeleccionado}${voltear}${rotacion}${zoom}${colorPiel}${cejas}${ojos}${boca}${colorGafas}${gafas}${barba}${colorBarba}${pelo}${colorPelo}${sombrero}${colorSombrero}&accessoriesProbability=${probabilidadGafas}${colorRopa}${ropa}${temaRopa}&facialHairProbability=${probabilidadBarba}&radius=50`;

  fetch(url)
    .then((response) => response.text())
    .then((svg) => {
      // Insertamos el SVG directamente en el DOM
      document.getElementById("avatar").innerHTML =
        svg +
        `<button id="btnDescargar" class="download-btn" onclick="descargarAvatar()">
          <i class="fa-solid fa-download fa-2xl"></i>
        </button>`;
    })
    .catch((error) => {
      console.error("Error al generar avatar:", error);
    });
}

function ocultarTemaRopa(valor) {
  if (valor != "graphicShirt") {
    document.getElementById("temaGrafico").hidden = true;
  } else {
    document.getElementById("temaGrafico").hidden = false;
  }
}

function ocultarCabelloSombrero(sombrero) {
  if (sombrero != "") {
    document.getElementById("pelo").hidden = true;
    document.getElementById("colorCabello").style.display = "none";
  } else {
    document.getElementById("pelo").hidden = false;
    document.getElementById("colorCabello").style.display = "flex";
  }
}

function ocultarColorBarba(valor) {
  if (valor == "") {
    document.getElementById("colorBarba").style.display = "none";
  } else {
    document.getElementById("colorBarba").style.display = "flex";
  }
}

function ocultarColorCabello(valor) {
  if (valor == "") {
    document.getElementById("colorCabello").style.display = "none";
  } else {
    document.getElementById("colorCabello").style.display = "flex";
  }
}

function descargarAvatar() {
  // Obtener el SVG generado
  const svgElement = document.getElementById("avatar").querySelector("svg");

  // Si no hay un SVG, no hacemos nada
  if (!svgElement) return;

  // Convertir el SVG a una cadena de texto
  const svgString = new XMLSerializer().serializeToString(svgElement);

  // Crear una imagen a partir del SVG
  const img = new Image();
  const svgData = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));
  img.src = svgData;

  img.onload = function () {
    // Crear un canvas para dibujar la imagen
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Ajustar el tamaño del canvas según el tamaño del SVG
    canvas.width = 512;
    canvas.height = 512;

    // Dibujar la imagen en el canvas
    ctx.drawImage(img, 0, 0);

    // Convertir el canvas a una imagen PNG
    const pngData = canvas.toDataURL("image/png");

    // Crear un enlace para descargar el PNG
    const link = document.createElement("a");
    link.href = pngData;
    link.download = "avatar.png"; // Nombre del archivo de descarga
    link.click(); // Hacer clic en el enlace para iniciar la descarga
  };
}
