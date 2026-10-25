  import { createTool } from '@mastra/core/tools';
  import { z } from 'zod';

  interface SerpApiResponse {
    search_parameters: {
      engine: string;
      q: string;
      google_domain: string;
      device: string;
    },
    organic_results: {
      position: number;
      title: string;
      snippet: string;
      source: string;
      }[],
    // Puede tener campos diferentes dependiendo de la liga, asi que mejor aceptamos toda la estructura para pasarlo al agente
    sports_results?: Record<string, any>,
  }

  export const serpapiTool = createTool({
    id: 'query-serpapi',
    description: 'Query Google search through ServApi',
    inputSchema: z.object({
      query: z.string().describe('Query'),
    }),
    outputSchema: z.object({
      query_result: z.union([
          z.record(z.string(), z.any()),
          z.array(z.record(z.string(), z.any()))
        ]),
    }),
    execute: async (inputData) => {
      return await searchSerpApi(inputData.query);
    },
  });
let serpApiData: SerpApiResponse;
const searchSerpApi = async (query: string) => {
  query = query.replaceAll(" ", "+");
  try {
    if (!process.env.SERP_API_KEY) {
      throw new Error("Missing SERP_API_KEY environment variable")
    }
    const serpApiUrl = `https://serpapi.com/search.json?engine=google&q=${query}&google_domain=google.com&api_key=${process.env.SERP_API_KEY}`;
    const serpApiResponse = await fetch(serpApiUrl);
    serpApiData = (await serpApiResponse.json()) as SerpApiResponse;
  } catch (e) {
    return {
      query_result: {
        error: `Ocurrió el siguiente error ${e}. Informar al usuario que hubo un error al hacer la búsqueda web.`
      }
    }
  }


  if (!serpApiData.sports_results) {
    console.log("No se ha detectado campos sports_results, se enviará organic_results al agente");
    return {
      query_result: serpApiData.organic_results
    }
  }
  return {
    query_result: serpApiData.sports_results
  }
  };
