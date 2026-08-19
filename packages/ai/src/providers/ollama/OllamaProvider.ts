import { AIClient } from "../../client/AIClient.js";
import { OllamaClient } from "./OllamaClient.js";

export class OllamaProvider {

  private readonly ai: AIClient;

  constructor() {

    this.ai =
      new AIClient(
        new OllamaClient(),
      );

  }

  get client(): AIClient {

    return this.ai;

  }

}
