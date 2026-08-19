import type {

  ChatProvider,

} from "./ChatProvider.js";

import type {

  ChatRequest,

} from "./ChatRequest.js";

import type {

  ChatResponse,

} from "./ChatResponse.js";

export class AIClient {

  constructor(

    private readonly provider: ChatProvider,

  ) {}

  async chat(

    request: ChatRequest,

  ): Promise<ChatResponse> {

    return this.provider.chat(

      request,

    );

  }

}
