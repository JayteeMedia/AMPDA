import { OllamaClient } from "./dist/index.js";

const client = new OllamaClient();

const response = await client.chat({

  model: "qwen3.5:4b",

  messages: [

    {
      role: "user",
      content: "Write exactly four lines of rap lyrics.",
    },

  ],

});

console.log(response);
