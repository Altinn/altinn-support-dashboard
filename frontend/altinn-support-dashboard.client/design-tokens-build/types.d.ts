/* build: v1.6.0 */
import type {} from '@digdir/designsystemet/types';

// Augment types based on theme
declare module '@digdir/designsystemet/types' {
  export interface ColorDefinitions {
    accent: never;
    brand1: never;
    brand2: never;
    neutral: never;
  }
  export interface SeverityColorDefinitions {
    info: never;
    success: never;
    warning: never;
    danger: never;
  }
}
