import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { LoginForm } from './features/auth/components/login-form/login-form';
import { AuthService } from './core/services/auth';
import { RegisterForm } from './features/auth/components/register-form/register-form';
import { SidebarStateService } from './core/services/sidebar-state';
import { SidebarOutlet } from './shared/sidebar-outlet/sidebar-outlet';
import { UserStatus } from './models/auth.models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, SidebarOutlet, LoginForm, RegisterForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly sidebarState = inject(SidebarStateService);

  readonly isSidebarOpen = computed(() => this.sidebarState.selection() !== null);

  readonly userName = this.authService.userName
  readonly authForm = signal<'login' | 'register' | null>(null);
  readonly authMessage = signal<string | null>(null);

  formDone(success: boolean) {
    if (success){
      this.authForm.set(null);
    }
    else {
      if(this.authForm() == 'login'){
        this.authMessage.set("Невдалий вхід! Перевірте електронну пошту і пароль!");
      }
      else {
        this.authMessage.set("Обліковий запис з цією електронною поштою вже існує! Спробуйте іншу!");
      }
    }
  }

  registerClick() {
    this.authMessage.set(null);
    this.authForm.set('register');
  }

  loginClick() {
    this.authMessage.set(null);
    this.authForm.set('login');
  }

  closeAuth(): void {
    this.authMessage.set(null);
    this.authForm.set(null);
  }

  logout() {
    this.authService.logout().subscribe({
    next: () => {
      this.userName.set(null);
    }
  });
  }

  ngOnInit() {
    this.authService.getUserStatus().subscribe({
      next: (res: UserStatus) => {
        if (res.isAuthenticated) {
          this.authService.isAuthenticated.set(true);
          this.userName.set(res.username);
          this.authForm.set(null);
        }
      },
      error: () => {
        this.authService.isAuthenticated.set(false);
        this.authForm.set('login');
      }
    });
  }
}
