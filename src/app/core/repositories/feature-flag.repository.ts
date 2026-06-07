import { Observable } from 'rxjs';
import { FeatureFlagKey } from '../models/feature-flag.model';

export abstract class FeatureFlagRepository {
  abstract isEnabled(key: FeatureFlagKey): Observable<boolean>;
  abstract fetchAll(): Observable<Record<FeatureFlagKey, boolean>>;
}
