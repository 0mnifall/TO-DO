import { Component, inject, input, output } from '@angular/core';
import { AuthService } from '../../../../core/services/auth';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private authService = inject(AuthService)

  loggedIn = output<boolean>();

  register = output<void>();

  message = input<string | null>();
  
  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formData = this.loginForm.getRawValue();

    this.authService.login(formData.email, formData.password).subscribe({
      next: () => {
        this.loggedIn.emit(true);
      },
      error: () => {
        this.loggedIn.emit(false);
      }
    })
    
  }
}
