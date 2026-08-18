import {
  AgentRegistry,
  AgentCapability,
  PlannerAgent,
  LyricsAgent,
  PromptAgent,
  MusicGeneratorAgent,
  ArtworkGeneratorAgent,
  MetadataGeneratorAgent,
  StubMusicProvider,
  StubArtworkProvider,
  StubMetadataProvider,
} from "@ampda/agent-runtime";
import {
  OpenAIClient,
  OpenAILyricsProvider,
  OpenAIPromptProvider,
} from "@ampda/openai-provider";

export class AgentCompositionRoot {
  static createRegistry(): AgentRegistry {
    const registry = new AgentRegistry();
    const client = new OpenAIClient();

    registry.register(
      new PlannerAgent({
        id: "planner",
        name: "Planner",
        capabilities: [AgentCapability.Planning],
        metadata: {},
      }),
    );

    registry.register(
      new LyricsAgent(
        {
          id: "lyrics",
          name: "Lyrics Generator",
          capabilities: [AgentCapability.Lyrics],
          metadata: {},
        },
        new OpenAILyricsProvider(client),
      ),
    );

    registry.register(
      new PromptAgent(
        {
          id: "prompt",
          name: "Prompt Generator",
          capabilities: [AgentCapability.PromptGeneration],
          metadata: {},
        },
        new OpenAIPromptProvider(client),
      ),
    );

    registry.register(
      new MusicGeneratorAgent(
        {
          id: "music",
          name: "Music Generator",
          capabilities: [AgentCapability.MusicGeneration],
          metadata: {},
        },
        new StubMusicProvider(),
      ),
    );

    registry.register(
      new ArtworkGeneratorAgent(
        {
          id: "artwork",
          name: "Artwork Generator",
          capabilities: [AgentCapability.ArtworkGeneration],
          metadata: {},
        },
        new StubArtworkProvider(),
      ),
    );

    registry.register(
      new MetadataGeneratorAgent(
        {
          id: "metadata",
          name: "Metadata Generator",
          capabilities: [AgentCapability.MetadataGeneration],
          metadata: {},
        },
        new StubMetadataProvider(),
      ),
    );

    return registry;
  }
}
