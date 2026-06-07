import { Injectable, inject, signal } from '@angular/core';
import { FeatureFlagRepository } from '../repositories/feature-flag.repository';
import { FEATURE_FLAG_KEYS, FeatureFlagKey } from '../models/feature-flag.model';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private repo = inject(FeatureFlagRepository);

  private flagsSignal = signal<Record<string, boolean>>({
    [FEATURE_FLAG_KEYS.CATEGORY_FEATURE]: true,
  });

  flags = this.flagsSignal.asReadonly();

  loadFlags(): void {
    this.repo.fetchAll().subscribe((flags) => this.flagsSignal.set(flags));
  }

  isEnabled(key: FeatureFlagKey): boolean {
    return this.flagsSignal()[key] ?? false;
  }
}
