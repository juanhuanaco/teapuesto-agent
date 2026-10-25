
import { Mastra } from '@mastra/core/mastra';
// import { PinoLogger } from '@mastra/loggers';
// import { LibSQLStore } from '@mastra/libsql';
// import { DuckDBStore } from "@mastra/duckdb";
// import { MastraCompositeStore } from '@mastra/core/storage';
// import { Observability, MastraStorageExporter, MastraPlatformExporter, SensitiveDataFilter } from '@mastra/observability';
import { serpApiAgent } from './agents/serpapi-agent.js';
import { dailyReportAgent } from './agents/dailyreport-agent.js';

import { MastraModelGateway, type ProviderConfig, type GatewayLanguageModel } from '@mastra/core/llm';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

class MyPrivateGateway extends MastraModelGateway {
  // Required: Unique identifier for the gateway
  // This ID is used as the prefix for all providers from this gateway
  readonly id = 'private';

  // Required: Human-readable name
  readonly name = 'My Private Gateway';

  /**
   * Fetch provider configurations from your gateway
   * Returns a record of provider configurations
   */
  async fetchProviders(): Promise<Record<string, ProviderConfig>> {
    return {
      'my-provider': {
        name: 'My Provider',
        models: ['google/gemma-4-31B-it'],
        apiKeyEnvVar: 'FEATHERLESS_API_KEY',
        gateway: this.id,
        url: 'https://api.featherless.ai/v1',
      },
    };
  }

  /**
   * Build the API URL for a model
   * @param modelId - Full model ID (e.g., "private/my-provider/model-1")
   * @param envVars - Environment variables (optional)
   */
  buildUrl(modelId: string, envVars?: Record<string, string>): string {
    return 'https://api.featherless.ai/v1';
  }

  /**
   * Get the API key for authentication
   * @param modelId - Full model ID
   */
  async getApiKey(modelId: string): Promise<string> {
    const apiKey = process.env.FEATHERLESS_API_KEY;
    if (!apiKey) {
      throw new Error(`Missing FEATHERLESS_API_KEY environment variable`);
    }
    return apiKey;
  }

  /**
   * Create a language model instance
   * @param args - Model ID, provider ID, and API key
   */
  async resolveLanguageModel({
    modelId,
    providerId,
    apiKey,
  }: {
    modelId: string;
    providerId: string;
    apiKey: string;
  }): Promise<GatewayLanguageModel> {
    const baseURL = this.buildUrl(`${providerId}/${modelId}`);
    //@ts-ignore La conversion LanguageModelV4 a GatewayLanguageModel es compatible
    return createOpenAICompatible({
      name: providerId,
      apiKey,
      baseURL,
      supportsStructuredOutputs: true,
    }).chatModel(modelId);
  }
}


export const mastra = new Mastra({
  gateways: {
    myGateway: new MyPrivateGateway(),
  },
  // workflows: { weatherWorkflow },
  agents: { serpApiAgent, dailyReportAgent },
  // storage: new MastraCompositeStore({
  //   id: 'composite-storage',
  //   default: new LibSQLStore({
  //     id: "mastra-storage",
  //     // Uses a hosted database when deployed (mastra env db create --kind turso),
  //     // and a local file during development.
  //     url: process.env.TURSO_DATABASE_URL ?? "file:./mastra.db",
  //     authToken: process.env.TURSO_AUTH_TOKEN,
  //   }),
  //   domains: {
  //     observability: await new DuckDBStore().getStore('observability'),
  //   }
  // }),
  // logger: new PinoLogger({
  //   name: 'Mastra',
  //   level: 'info',
  // }),
  // observability: new Observability({
  //   configs: {
  //     default: {
  //       serviceName: 'mastra',
  //       exporters: [
  //         new MastraStorageExporter(), // Persists observability events to Mastra Storage
  //         new MastraPlatformExporter(), // Sends observability events to Mastra Platform (if MASTRA_PLATFORM_ACCESS_TOKEN is set)
  //       ],
  //       spanOutputProcessors: [
  //         new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
  //       ],
  //     },
  //   },
  // }),
});
