import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactFormComponent } from './contact-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContactFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sarvam-talent');
}
