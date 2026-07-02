import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactMessageRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactMessageResponse extends ContactMessageRequest {
  id: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ContactFormService {
  private readonly apiUrl = 'http://localhost:8080/api/contact-messages';

  constructor(private readonly http: HttpClient) {}

  submitContactMessage(message: ContactMessageRequest): Observable<ContactMessageResponse> {
    return this.http.post<ContactMessageResponse>(this.apiUrl, message);
  }
}
