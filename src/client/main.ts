const imageInput = document.getElementById("image-input") as HTMLInputElement;
const previewContainer = document.getElementById(
  "preview-container",
) as HTMLDivElement;
const previewImg = document.getElementById("preview-img") as HTMLImageElement;
const sendBtn = document.getElementById("send-btn") as HTMLButtonElement;
const statusText = document.getElementById("status") as HTMLParagraphElement;

const resultContainer = document.getElementById(
  "result-container",
) as HTMLDivElement;
const speechOutput = document.getElementById(
  "speech-output",
) as HTMLTextAreaElement;
const outputLabel = document.getElementById("output-label") as HTMLLabelElement;
const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;

let base64Payload: string | null = null;

// 1. Leer imagen de la galería y convertirla a Base64
imageInput?.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (!file) {
    window.alert("Debes seleccionar la imagen de las cuotas del dia");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    // reader.result contiene el string Data URL (data:image/png;base64,...)
    base64Payload = reader.result as string;

    // Mostrar vista previa en la interfaz
    previewImg.src = base64Payload;
    previewContainer.classList.remove("hidden");

    // Habilitar el botón de envío
    sendBtn.disabled = false;
    sendBtn.className =
      "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition cursor-pointer";
    statusText.textContent = 'Imagen lista. Presiona "Generar Resultado".';
  };

  reader.onerror = () => {
    statusText.textContent = "Error al leer la imagen de la galería.";
  };

  reader.readAsDataURL(file);
});

// 2. Enviar Base64 al backend
sendBtn?.addEventListener("click", async () => {
  if (!base64Payload) return;

  // Obtener el endpoint activo según el radio button seleccionado
  const selectedRadio = document.querySelector(
    'input[name="agent-mode"]:checked',
  ) as HTMLInputElement;
  const endpoint = selectedRadio?.value || "/api/agents/speech";
  const isSpeech = endpoint === "/api/agents/speech";

  sendBtn.disabled = true;
  sendBtn.className =
    "w-full bg-slate-300 text-slate-500 font-semibold py-3 px-4 rounded-xl transition cursor-not-allowed";
  statusText.textContent = isSpeech
    ? "⏳ Leyendo cuotas y generando speech..."
    : "⏳ Analizando cuotas y generando reporte diario...";
  resultContainer.classList.add("hidden");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: base64Payload,
    });

    const data: { status: string; message: string } = await res.json();

    if (res.ok && data.status == "ok") {
      statusText.textContent = "✅ ¡Procesamiento completado!";
      outputLabel.textContent = isSpeech
        ? "Speech Generado:"
        : "Reporte Diario Generado:";
      speechOutput.value = data.message;
      resultContainer.classList.remove("hidden");
    } else {
      statusText.textContent = `❌ Error: ${data.message}`;
    }
  } catch (error) {
    statusText.textContent = "❌ Error de conexión con el servidor.";
  } finally {
    sendBtn.disabled = false;
    sendBtn.className =
      "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition cursor-pointer";
  }
});

// 3. Funcionalidad para copiar al portapapeles
copyBtn?.addEventListener("click", async () => {
  if (!speechOutput.value) return;

  try {
    await navigator.clipboard.writeText(speechOutput.value);

    // Feedback visual temporal en el botón
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = "✅ ¡Copiado!";
    copyBtn.classList.replace("bg-slate-800", "bg-emerald-600");

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.classList.replace("bg-emerald-600", "bg-slate-800");
    }, 2000);
  } catch (err) {
    statusText.textContent =
      "No se pudo copiar automáticamente. Puedes seleccionar el texto manualmente.";
  }
});
