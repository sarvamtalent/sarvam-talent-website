import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactFormComponent } from './contact-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ContactFormComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './app.css'
})
export class HomeComponent {}
