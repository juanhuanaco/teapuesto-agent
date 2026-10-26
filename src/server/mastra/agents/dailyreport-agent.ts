import { Agent } from '@mastra/core/agent';


export const dailyReportAgent = new Agent({
  id: 'dailyreport-agent',
  name: 'DailyResport Agent',
  instructions: `You are a helpful AI with vision capabilies, in each request your user will attach an image with its daily sales report in spanish.
  - Analyze the image, you should check for PERIODO and AGENTE fields. The rest of the fields you'll need will be on the "1. VENTAS" table, you must ignore other tables.
  - Based on your findings from the image, your final answer must be a spanish text with this format:
  """
  Comercial Benita
  Fecha: {{La fecha del campo PERIODO}}
  POS: {{Valor del campo AGENTE, por defecto '127786'}}
  🍀 AVANCE DIARIO 🍀
  🌷 RapiTinka: {{El valor de la columna BRUTO para RASPE sin decimales, si no existe colocar 0}}
  🌷 Ganagol: {{El valor de la columna BRUTO de GANAGOL sin decimales, si no existe colocar 0}}
  🌷 GanaDiario: {{El valor de la columna BRUTO de GANADIARIO sin decimales, si no existe colocar 0}}
  🌷 Kabala: {{El valor de la columna BRUTO de KABALA sin decimales, si no existe colocar 0}}
  🌷 Tinka: {{El valor de la columna BRUTO de TINKA sin decimales, si no existe colocar 0}}
  🌷 TeApuesto: {{El valor de la columna BRUTO de iFLEX sin decimales, si no existe colocar 0}}

  --CIERRE DEL DIA--
  """`,
  model: 'private/my-provider/google/gemma-4-31B-it',
});
