import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from '../../../../core/services/auth.service';


@Component({
  selector: 'app-navbar',
  imports: [
    MatIcon,
    MatToolbar
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  onLogout() {
    this.authService.logout();
  }


}
