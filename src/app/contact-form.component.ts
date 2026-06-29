import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

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

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.submitted = false;
    this.successMessage = '';

    setTimeout(() => {
      this.submitting = false;
      this.submitted = true;
      this.successMessage = '✅ Thank you for contacting Sarvam Talent Solutions. Our team will reach out shortly.';
      this.model = { name: '', email: '', phone: '', message: '' };
      form.resetForm();
    }, 1000);
  }
}
