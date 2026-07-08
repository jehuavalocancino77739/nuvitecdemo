import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
}

export interface CustomerRequest {
  code: string;
  title: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiBase = 'http://127.0.0.1:8080/api';

  readonly currentUser = signal(localStorage.getItem('nuvitec_email') ?? '');
  readonly portalRequests = signal<CustomerRequest[]>([]);

  constructor(private readonly http: HttpClient) {
    const token = this.token();
    if (token && this.currentUser()) {
      this.loadPortalRequests(token);
    }
  }

  token(): string {
    return localStorage.getItem('nuvitec_token') ?? '';
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, { email, password });
  }

  startSession(response: LoginResponse): void {
    localStorage.setItem('nuvitec_token', response.token);
    localStorage.setItem('nuvitec_email', response.email);
    this.currentUser.set(response.email);
    this.loadPortalRequests(response.token);
  }

  logout(): void {
    localStorage.removeItem('nuvitec_token');
    localStorage.removeItem('nuvitec_email');
    this.currentUser.set('');
    this.portalRequests.set([]);
  }

  loadPortalRequests(token = this.token()): void {
    if (!token) {
      this.portalRequests.set([]);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<CustomerRequest[]>(`${this.apiBase}/portal/requests`, { headers }).subscribe({
      next: (requests) => this.portalRequests.set(requests),
      error: () => this.portalRequests.set([])
    });
  }
}
