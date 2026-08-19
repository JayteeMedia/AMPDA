export interface WorkflowPlan {

  /**
   * Ordered workflow executed by the orchestrator.
   */
  steps: string[];

  /**
   * Song information.
   */
  title?: string;

  genre?: string;

  mood?: string;

  theme?: string;

  /**
   * Music planning.
   */
  bpm?: number;

  key?: string;

  timeSignature?: string;

  duration?: string;

  structure?: string[];

  vocalStyle?: string;

  productionStyle?: string;

  /**
   * Artwork planning.
   */
  artworkStyle?: string;

  /**
   * Marketing.
   */
  targetAudience?: string;

  commercialGoal?: string;

}
