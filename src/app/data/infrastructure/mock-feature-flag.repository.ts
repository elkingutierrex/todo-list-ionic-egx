import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FeatureFlagRepository } from '../../core/repositories/feature-flag.repository';
import { FEATURE_FLAG_KEYS, FeatureFlagKey } from '../../core/models/feature-flag.model';

const DEFAULT_FLAGS: Record<FeatureFlagKey, boolean> = {
  [FEATURE_FLAG_KEYS.CATEGORY_FEATURE]: true,
};

@Injectable({ providedIn: 'root' })
export class MockFeatureFlagRepository extends FeatureFlagRepository {
  isEnabled(key: FeatureFlagKey): Observable<boolean> {
    return of(DEFAULT_FLAGS[key] ?? false);
  }

  fetchAll(): Observable<Record<FeatureFlagKey, boolean>> {
    return of({ ...DEFAULT_FLAGS });
  }
}
