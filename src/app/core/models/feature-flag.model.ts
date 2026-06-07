export interface FeatureFlag {
  key: string;
  isEnabled: boolean;
}

export const FEATURE_FLAG_KEYS = {
  CATEGORY_FEATURE: 'categoryFeatureEnabled',
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAG_KEYS)[keyof typeof FEATURE_FLAG_KEYS];
