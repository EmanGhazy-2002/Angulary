import { Component, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/Services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  registerForm: FormGroup = this.fb.group({
    username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/)
    ]],
    rePassword: [null, [Validators.required]]
  }, { validators: this.confirmPassword });

  isLoading = false;
  errorMessage = '';
  success = false;
  registSub?: Subscription;

  registerSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, email, password } = this.registerForm.value;
      this.registSub = this.authService.register({ username, email, password }).subscribe({
        next: (res) => {
          console.log('Register response:', res);
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Register error:', err);
          this.errorMessage = err.error?.message || err.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.registSub?.unsubscribe();
  }

  confirmPassword(g: AbstractControl) {
    return g.get('password')?.value === g.get('rePassword')?.value ? null : { mismatch: true };
  }
}