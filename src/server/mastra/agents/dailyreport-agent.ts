import { Agent } from '@mastra/core/agent';


export const dailyReportAgent = new Agent({
  id: 'dailyreport-agent',
  name: 'DailyResport Agent',
  instructions: `You are a helpful AI with vision capabilies, in each request your user will attach an image with its daily sales report.
  - Analyze the image, you should check for PERIODO and AGENTE fields. The rest of the fields you'll need will be on the VENTAS table, you must ignore other tables.
  - Based on your findings from the image, your final answer must be a spanish text with this format:
  """
  Comercial Benita
  Fecha: {{La fecha del campo PERIODO}}
  POS: {{Valor del campo AGENTE, por defecto '127786'}}
  🍀 AVANCE DIARIO 🍀
  🌷 RapiTinka: {{El valor bruto de RASPE sin decimales}}
  🌷 Ganagol: {{El valor bruto de GANAGOL sin decimales}}
  🌷 GanaDiario: {{El valor bruto de GANADIARIO sin decimales}}
  🌷 Kabala: {{El valor bruto de KABALA sin decimales}}
  🌷 Tinka: {{El valor bruto de TINKA sin decimales}}
  🌷 TeApuesto: {{El valor bruto de iFLEX sin decimales}}

  --CIERRE DEL DIA--
  """`,
  model: 'private/my-provider/google/gemma-4-31B-it',
});
