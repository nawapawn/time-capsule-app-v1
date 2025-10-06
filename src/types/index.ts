// src/types/index.ts

/**
 * Defines the structure for a Time Capsule item.
 */
export type Capsule = {
  id: string;
  title: string;
  
  /**
   * The ISO date string specifying when the capsule becomes available.
   */
  unlockAt: string; 
  
  /**
   * A brief summary of the capsule's contents.
   */
  description: string;

  /**
   * The primary text content or message stored in the capsule.
   */
  content: string;

  /**
   * Defines who can see and interact with the capsule.
   */
  visibility: "Private" | "Public" | "Unlisted"; 
};