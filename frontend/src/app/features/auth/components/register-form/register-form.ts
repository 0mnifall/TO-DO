import { Component, inject, input, output } from '@angular/core';
import { AuthService } from '../../../../core/services/auth';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  private readonly authService = inject(AuthService)

  message = input<string | null>();


  registered = output<boolean>();

  login = output<void>();

  registerForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),
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
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.getRawValue();

    this.authService.registerAndLogin(formData.username, formData.email, formData.password).subscribe({
      next: () => {
            this.registered.emit(true);
          },
      error: () => {
        this.registered.emit(false);
      }
    });
  }
}