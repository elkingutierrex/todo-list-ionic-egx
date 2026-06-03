import { Injectable, signal, computed } from '@angular/core';
import { Role } from '../../domain/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // Signal privado y computed para lectura
  readonly #currentRole = signal<Role>('USER');
  
  readonly currentRole = computed(() => this.#currentRole());

  setRole(role: Role) {
    this.#currentRole.set(role);
  }
}
