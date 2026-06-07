import { Injectable } from '@angular/core';
import { Observable, from, map, of } from 'rxjs';
import { FeatureFlagRepository } from '../../core/repositories/feature-flag.repository';
import { FEATURE_FLAG_KEYS, FeatureFlagKey } from '../../core/models/feature-flag.model';
import { fetchAndActivate, getValue, getRemoteConfig } from 'firebase/remote-config';
import { getApp } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class FirebaseFeatureFlagRepository extends FeatureFlagRepository {
  private remoteConfig = getRemoteConfig(getApp());

  constructor() {
    super();
    this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour cache
    (this.remoteConfig as any).defaultConfig = {
      [FEATURE_FLAG_KEYS.CATEGORY_FEATURE as string]: true,
    };
  }

  isEnabled(key: FeatureFlagKey): Observable<boolean> {
    return from(fetchAndActivate(this.remoteConfig)).pipe(
      map(() => getValue(this.remoteConfig, key).asBoolean())
    );
  }

  fetchAll(): Observable<Record<FeatureFlagKey, boolean>> {
    return from(fetchAndActivate(this.remoteConfig)).pipe(
      map(() => ({
        [FEATURE_FLAG_KEYS.CATEGORY_FEATURE]: getValue(
          this.remoteConfig,
          FEATURE_FLAG_KEYS.CATEGORY_FEATURE
        ).asBoolean(),
      }))
    );
  }
}
