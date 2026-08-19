import type {
  MetadataProvider,
  MetadataGenerationRequest,
  MetadataGenerationResult,
} from "@ampda/agent-runtime";

import type {
  SongMetadata,
} from "@ampda/core";

import { OpenAIClient } from "./OpenAIClient.js";

export class OpenAIMetadataProvider
  implements MetadataProvider
{
  constructor(
    private readonly client: OpenAIClient,
  ) {}

  async generate(
    request: MetadataGenerationRequest,
  ): Promise<MetadataGenerationResult> {

    const systemPrompt = `
You are a music metadata specialist.

Return valid JSON only.
`.trim();

    const userPrompt = `
Generate metadata for:

Title: ${request.title}

Genre: ${request.genre}

Mood: ${request.mood}

Theme: ${request.theme}

Return:

{
"title":"",
"genre":"",
"mood":"",
"theme":"",
"description":"",
"tags":[],
"bpm":120,
"key":"",
"version":"1.0"
}
`.trim();

    const raw =
      await this.client.generateChat([
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ]);

    const metadata =
      this.parseMetadata(
        raw,
        request,
      );

    return {
      metadata,
    };

  }

  private parseMetadata(
    raw: string,
    request: MetadataGenerationRequest,
  ): SongMetadata {

    const cleaned =
      raw
        .replace(
          /^```(?:json)?\s*/i,
          "",
        )
        .replace(
          /\s*```$/,
          "",
        )
        .trim();

    const parsed =
      JSON.parse(
        cleaned,
      ) as SongMetadata;

    return {

      title:
        parsed.title ??
        request.title,

      genre:
        parsed.genre ??
        request.genre,

      mood:
        parsed.mood ??
        request.mood,

      theme:
        parsed.theme ??
        request.theme,

      description:
        parsed.description ??
        "",

      tags:
        parsed.tags ??
        [],

      bpm:
        parsed.bpm ??
        120,

      key:
        parsed.key ??
        "C Minor",

      version:
        parsed.version ??
        "1.0",

    };

  }

}
