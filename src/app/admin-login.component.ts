import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin.component.css'
})
export class AdminLoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  submitting = false;
  errorMessage = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly router: Router
  ) {}

  onSubmit(form: NgForm): void {
    if (form.invalid || this.submitting) {
      form.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.adminService.login(this.credentials).pipe(
      finalize(() => {
        this.submitting = false;
      })
    ).subscribe({
      next: () => this.router.navigate(['/admin/enquiries']),
      error: () => {
        this.errorMessage = 'Invalid username or password. Try admin / admin123 for local development.';
      }
    });
  }
}
