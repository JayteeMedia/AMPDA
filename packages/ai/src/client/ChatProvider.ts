import type {

  ChatRequest,

} from "./ChatRequest.js";

import type {

  ChatResponse,

} from "./ChatResponse.js";

export interface ChatProvider {

  chat(

    request: ChatRequest,

  ): Promise<ChatResponse>;

}
