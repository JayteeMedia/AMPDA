import {
  AgentCapability,
  AgentRegistry,
  ArtworkGeneratorAgent,
  LyricsAgent,
  MetadataGeneratorAgent,
  MusicGeneratorAgent,
  PlannerAgent,
  PromptAgent,
  StubArtworkProvider,
  StubMusicProvider,
} from "@ampda/agent-runtime";

import {
  OpenAIClient,
  OpenAILyricsProvider,
  OpenAIMetadataProvider,
  OpenAIPromptProvider,
} from "@ampda/openai-provider";

import {
  PromptLoader,
  PromptManager,
} from "@ampda/prompts";

import { resolve } from "node:path";

export class AgentCompositionRoot {

  static createRegistry(): AgentRegistry {

    const registry =
      new AgentRegistry();

    //
    // Shared infrastructure
    //

    const client =
      new OpenAIClient();

    const loader =
      new PromptLoader({

        rootDirectory: resolve(
          process.cwd(),
          "packages",
          "prompts",
        ),

      });

    const promptManager =
      new PromptManager({

        loader,

        promptPack:
          "default",

      });

    //
    // Providers
    //

    const lyricsProvider =
      new OpenAILyricsProvider(
        client,
        promptManager,
      );

    const promptProvider =
      new OpenAIPromptProvider(
        client,
      );

    const metadataProvider =
      new OpenAIMetadataProvider(
        client,
      );

    //
    // Planner
    //

    registry.register(

      new PlannerAgent({

        id: "planner",

        name: "Planner",

        capabilities: [
          AgentCapability.Planning,
        ],

        metadata: {},

      }),

    );

    //
    // Lyrics
    //

    registry.register(

      new LyricsAgent(

        {

          id: "lyrics",

          name: "Lyrics Generator",

          capabilities: [
            AgentCapability.Lyrics,
          ],

          metadata: {},

        },

        lyricsProvider,

      ),

    );

    //
    // Prompt
    //

    registry.register(

      new PromptAgent(

        {

          id: "prompt",

          name: "Prompt Generator",

          capabilities: [
            AgentCapability.PromptGeneration,
          ],

          metadata: {},

        },

        promptProvider,

      ),

    );

    //
    // Music
    //

    registry.register(

      new MusicGeneratorAgent(

        {

          id: "music",

          name: "Music Generator",

          capabilities: [
            AgentCapability.MusicGeneration,
          ],

          metadata: {},

        },

        new StubMusicProvider(),

      ),

    );

    //
    // Artwork
    //

    registry.register(

      new ArtworkGeneratorAgent(

        {

          id: "artwork",

          name: "Artwork Generator",

          capabilities: [
            AgentCapability.ArtworkGeneration,
          ],

          metadata: {},

        },

        new StubArtworkProvider(),

      ),

    );

    //
    // Metadata
    //

    registry.register(

      new MetadataGeneratorAgent(

        {

          id: "metadata",

          name: "Metadata Generator",

          capabilities: [
            AgentCapability.MetadataGeneration,
          ],

          metadata: {},

        },

        metadataProvider,

      ),

    );

    return registry;

  }

}
