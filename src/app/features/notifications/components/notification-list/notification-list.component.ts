import { Component, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationService } from '../../../../infrastructure/services/notification.service';
import { RoleService } from '../../../../infrastructure/services/role.service';
import { ShowForRoleDirective } from '../../../../shared/directives/show-for-role.directive';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, ShowForRoleDirective, DatePipe],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationListComponent {
  notificationService = inject(NotificationService);
  roleService = inject(RoleService);
  private authService = inject(AuthService);

  readonly newNotificationAlert = signal<string | null>(null);
  private previousCount = 0;

  constructor() {
    // Escucha cambios en las notificaciones para anunciar nuevas a los SR (Screen Readers)
    effect(() => {
      const notes = this.notificationService.notifications();
      if (notes.length > this.previousCount && notes.length > 0) {
        this.newNotificationAlert.set(`Nueva notificación recibida: ${notes[0].title}`);
        setTimeout(() => this.newNotificationAlert.set(null), 3000);
      }
      this.previousCount = notes.length;
    });
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id);
  }

  logout() {
    this.authService.logout();
  }
}
