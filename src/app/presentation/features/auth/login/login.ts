import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import Swal from 'sweetalert2';
import { NgxSpinnerModule } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    NgxSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  emailControl = new FormControl('', [Validators.required, Validators.email]);
  isLoading = false;



  onSubmit(event: Event) {
    event.preventDefault();
    if (this.emailControl.invalid) return;

    const email = this.emailControl.value!;
    this.isLoading = true;

    this.authService.findUser(email).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user) {
          this.authService.setCurrentUser(user);
          this.router.navigate(['/tasks']);
        } else {
          this.promptCreateUser(email);
        }
      },
      error: (err) => {
        console.log('error');
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while connecting to the server.',
        });
        console.error(err);
      }
    });
  }

  promptCreateUser(email: string) {
    Swal.fire({
      title: "Create a new user",
      text: "This mail doesn't have registered, do you want to register it?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, register it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.authService.createUser(email).subscribe({
          next: (user) => {
            this.isLoading = false;
            this.authService.setCurrentUser(user);
            Swal.fire({
              title: "Ok!",
              text: "Your can create tasks!.",
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(['/tasks']);
            });
          },
          error: () => {
            this.isLoading = false;
            Swal.fire('Error', 'Could not create user', 'error');
          }
        });
      }
    });
  }
}
