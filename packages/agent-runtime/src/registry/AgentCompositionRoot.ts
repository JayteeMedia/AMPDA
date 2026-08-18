import { AgentRegistry } from "./AgentRegistry.js";
import { PlannerAgent } from "../agents/PlannerAgent.js";
import { LyricsAgent } from "../agents/LyricsAgent.js";
import { PromptAgent } from "../agents/PromptAgent.js";
import { MusicGeneratorAgent } from "../agents/MusicGeneratorAgent.js";
import { ArtworkGeneratorAgent } from "../agents/ArtworkGeneratorAgent.js";
import { MetadataGeneratorAgent } from "../agents/MetadataGeneratorAgent.js";
import { StubMusicProvider } from "../providers/StubMusicProvider.js";
import { StubArtworkProvider } from "../providers/StubArtworkProvider.js";
import { StubMetadataProvider } from "../providers/StubMetadataProvider.js";
import { AgentCapability } from "../types/AgentCapability.js";

export class AgentCompositionRoot {
  static createRegistry(): AgentRegistry {
    const registry = new AgentRegistry();

    registry.register(
      new PlannerAgent({
        id: "planner",
        name: "Planner",
        capabilities: [AgentCapability.Planning],
        metadata: {},
      })
    );

    registry.register(
      new LyricsAgent({
        id: "lyrics",
        name: "Lyrics Generator",
        capabilities: [AgentCapability.Lyrics],
        metadata: {},
      })
    );

    registry.register(
      new PromptAgent({
        id: "prompt",
        name: "Prompt Generator",
        capabilities: [AgentCapability.PromptGeneration],
        metadata: {},
      })
    );

    registry.register(
      new MusicGeneratorAgent({
        id: "music",
        name: "Music Generator",
        capabilities: [AgentCapability.MusicGeneration],
        metadata: {},
      }, new StubMusicProvider())
    );

    registry.register(
      new ArtworkGeneratorAgent({
        id: "artwork",
        name: "Artwork Generator",
        capabilities: [AgentCapability.ArtworkGeneration],
        metadata: {},
      }, new StubArtworkProvider())
    );

    registry.register(
      new MetadataGeneratorAgent({
        id: "metadata",
        name: "Metadata Generator",
        capabilities: [AgentCapability.MetadataGeneration],
        metadata: {},
      }, new StubMetadataProvider())
    );

    return registry;
  }
}
