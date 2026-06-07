import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { RoleService } from '../../infrastructure/services/role.service';
import { Role } from '../../core/models/role.model';

@Directive({
  selector: '[appShowForRole]',
  standalone: true
})
export class ShowForRoleDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private roleService = inject(RoleService);

  private allowedRoles: Role[] = [];
  private isCurrentlyShowing = false;

  @Input() set appShowForRole(roles: string | string[]) {
    this.allowedRoles = Array.isArray(roles) ? roles as Role[] : [roles as Role];
    // Reevaluamos en caso de que inputs cambien después de la inicialización
    this.updateView(this.roleService.currentRole());
  }

  constructor() {
    // Effect tracks roleService.currentRole() reactivity
    // Automatically cleans up subscriptions on component destruction.
    effect(() => {
      const currentRole = this.roleService.currentRole();
      this.updateView(currentRole);
    });
  }

  private updateView(currentRole: Role) {
    const hasRole = this.allowedRoles.includes(currentRole);

    if (hasRole && !this.isCurrentlyShowing) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isCurrentlyShowing = true;
    } else if (!hasRole && this.isCurrentlyShowing) {
      this.viewContainer.clear();
      this.isCurrentlyShowing = false;
    }
  }
}
