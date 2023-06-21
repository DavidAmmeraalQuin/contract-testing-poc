class FeatureFlagsService {
  featureFlags: { [key: string]: boolean } = {};

  constructor() {
    this.featureFlags = JSON.parse(process.env.FEATURE_FLAGS || "{}");
  }

  getFeatureFlag(name: string) {
    return this.featureFlags[name];
  }
}

export default new FeatureFlagsService();
