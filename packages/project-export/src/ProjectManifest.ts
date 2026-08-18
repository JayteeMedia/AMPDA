export interface ProjectManifest {
  id: string;

  title: string;

  createdAt: string;

  genre: string;

  mood: string;

  theme: string;

  files: {
    lyrics: string;

    musicPrompt: string;

    artworkPrompt: string;

    metadata: string;

    workflow: string;
  };
}

export interface WorkflowManifest {
  version: string;

  generatedAt: string;

  status: "completed";

  steps: string[];

  request: {
    title: string;

    genre: string;

    mood: string;

    theme: string;
  };
}
