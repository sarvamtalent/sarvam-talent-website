import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = 'http://localhost:8080/api/admin';
  private readonly tokenKey = 'sts_admin_token';

  constructor(private readonly http: HttpClient) {}

  login(credentials: AdminLoginRequest): Observable<AdminLoginResponse> {
    const payload = {
      username: credentials.username.trim(),
      password: credentials.password.trim()
    };

    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => localStorage.setItem(this.tokenKey, response.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return Boolean(this.getToken());
  }

  getEnquiries(search = '', sort: 'asc' | 'desc' = 'desc'): Observable<Enquiry[]> {
    return this.http.get<Enquiry[]>(`${this.apiUrl}/contact-messages`, {
      headers: this.getAuthHeaders(),
      params: { search, sort }
    });
  }

  deleteEnquiry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contact-messages/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({ 'X-Admin-Token': this.getToken() ?? '' });
  }
}
