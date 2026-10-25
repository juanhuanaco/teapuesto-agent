import express from "express";
import path from "path";
import { mastra } from "./mastra/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text({ limit: '2mb' }));

// Endpoint de prueba para la PWA
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Servidor de TeApuesto activo y listo." });
});

app.post("/api/agents/speech", async (_req, res) => {
  if (
    _req.body && (typeof _req.body == 'string') &&
    ((_req.body as string).startsWith("data:image/jpeg;base64,") ||
      (_req.body as string).startsWith("data:image/png;base64,"))
  ) {
    let message = {
      role: "user",
      content: [
        {
          type: "image",
          image: _req.body,
        },
      ],
    };
    //@ts-ignore la estructura de message es valida
    var output = await mastra.getAgent("serpApiAgent").generate(message);
    console.log(output.toolCalls);
    console.log(output.toolResults[0]?.payload?.result);
    res.json({ status: "ok", message: output.text });
  } else {
    res.statusCode = 400;
    res.json({ status: "err", message: "No se envió el payload correcto" });
  }
});

app.post("/api/agents/dailyreport", async (_req, res) => {
  if (
    _req.body && (typeof _req.body == 'string') &&
    ((_req.body as string).startsWith("data:image/jpeg;base64,") ||
      (_req.body as string).startsWith("data:image/png;base64,"))
  ) {
    let message = {
      role: "user",
      content: [
        {
          type: "image",
          image: _req.body,
        },
      ],
    };
    //@ts-ignore la estructura de message es valida
    var output = await mastra.getAgent("dailyReportAgent").generate(message);
    res.json({ status: "ok", message: output.text });
  } else {
    res.statusCode = 400;
    res.json({ status: "err", message: "No se envió el payload correcto" });
  }
});

// En producción servimos los archivos estaticos
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(process.cwd(), "dist/client");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
