export interface CreateSongRequest {
  title: string;

  genre: string;

  mood: string;

  theme: string;

  outputDirectory: string;
}

export interface CreateSongResult {
  projectDirectory: string;

  lyrics: string;

  musicPrompt: string;

  artworkPrompt: string;

  metadata: {
    title: string;
    genre: string;
    mood: string;
    theme: string;
    tags: string[];
    description: string;
  };
}

export class CreateSongWorkflow {
  async execute(
    request: CreateSongRequest,
  ): Promise<CreateSongResult> {

    const lyrics = `# ${request.title}

Genre: ${request.genre}

Mood: ${request.mood}

Theme: ${request.theme}

[Placeholder Lyrics]
`;

    const musicPrompt = `Create a ${request.genre} song.

Title:
${request.title}

Mood:
${request.mood}

Theme:
${request.theme}

Lyrics:
${lyrics}`;

    const artworkPrompt = `Album artwork.

Title:
${request.title}

Genre:
${request.genre}

Mood:
${request.mood}

Theme:
${request.theme}`;

    const metadata = {
      title: request.title,
      genre: request.genre,
      mood: request.mood,
      theme: request.theme,
      tags: [
        request.genre,
        request.mood,
        request.theme,
      ],
      description:
        `${request.genre} song about ${request.theme}.`,
    };

    return {
      projectDirectory:
        request.outputDirectory,

      lyrics,

      musicPrompt,

      artworkPrompt,

      metadata,
    };
  }
}
