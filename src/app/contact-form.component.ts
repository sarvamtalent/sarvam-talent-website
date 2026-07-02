import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, timeout, TimeoutError } from 'rxjs';
import { ContactFormService } from './contact-form.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  model = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  submitting = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private readonly contactFormService: ContactFormService) {}

  onSubmit(form: NgForm) {
    if (form.invalid || this.submitting) {
      form.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';

    this.contactFormService
      .submitContactMessage(this.model)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.submitted = true;
          this.successMessage = 'Thank you for contacting Sarvam Talent Solutions. Our team will reach out shortly.';
          this.model = { name: '', email: '', phone: '', message: '' };
          form.resetForm();
        },
        error: (error: unknown) => {
          this.errorMessage = this.getSubmitErrorMessage(error);
        }
      });
  }

  private getSubmitErrorMessage(error: unknown): string {
    if (error instanceof TimeoutError) {
      return 'Submission timed out. Please check your connection and try again.';
    }

    if (error instanceof HttpErrorResponse && error.status === 0) {
      return 'Unable to reach the server. Please make sure the backend is running and CORS is configured.';
    }

    return 'Something went wrong while submitting the form. Please try again.';
  }
}
