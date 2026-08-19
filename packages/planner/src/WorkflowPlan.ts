export interface WorkflowPlan {

  song: {

    title: string;

    genre: string;

    subgenre: string;

    bpm: number;

    key: string;

    duration: string;

    structure: string[];

  };

  vocals: {

    style: string;

    tone: string;

    delivery: string;

    quality: string;

  };

  production: {

    style: string;

    instrumentation: string[];

    drumStyle: string;

    bassStyle: string;

    atmosphere: string;

    mixDirection: string;

    masterDirection: string;

  };

  artwork: {

    style: string;

    palette: string[];

    setting: string;

    lighting: string;

  };

  release: {

    audience: string;

    commercialGoal: string;

  };

}