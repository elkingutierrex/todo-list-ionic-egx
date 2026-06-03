import { Injectable, computed, inject } from '@angular/core';
import { Role } from '../../domain/models/role.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private authService = inject(AuthService);

  readonly currentRole = computed<Role>(() => {
    const user = this.authService.currentUser();
    return user ? user.role : 'GUEST';
  });
}
