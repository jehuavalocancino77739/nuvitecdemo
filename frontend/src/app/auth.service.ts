import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
}

export interface RegistrationPayload {
  email: string;
  password: string;
  fullName: string;
  company: string;
  phone: string;
}

export interface CustomerRequest {
  id: number;
  code: string;
  title: string;
  description: string;
  serviceType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientUser {
  id: number;
  email: string;
  fullName: string;
  company: string;
  phone: string;
  role: string;
  enabled: boolean;
  createdAt: string;
}

export interface AdminCustomerRequest extends CustomerRequest {
  userId: number;
  clientName: string;
  clientEmail: string;
  company: string;
  phone: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  company: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestPayload {
  userId?: number;
  title: string;
  description: string;
  serviceType: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiBase = 'http://127.0.0.1:8080/api';

  readonly currentUser = signal(localStorage.getItem('nuvitec_email') ?? '');
  readonly currentRole = signal(localStorage.getItem('nuvitec_role') ?? '');
  readonly portalRequests = signal<CustomerRequest[]>([]);

  constructor(private readonly http: HttpClient) {
    if (this.currentUser() && !this.currentRole()) {
      this.logout();
      return;
    }

    if (this.token() && this.currentUser() && this.currentRole() === 'CLIENT') {
      this.loadPortalRequests();
    }
  }

  token(): string {
    return localStorage.getItem('nuvitec_token') ?? '';
  }

  isAdmin(): boolean {
    return this.currentRole() === 'ADMIN';
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, { email, password });
  }

  register(payload: RegistrationPayload) {
    return this.http.post<{ id: number; message: string }>(`${this.apiBase}/auth/register`, payload);
  }

  startSession(response: LoginResponse): void {
    localStorage.setItem('nuvitec_token', response.token);
    localStorage.setItem('nuvitec_email', response.email);
    localStorage.setItem('nuvitec_role', response.role);
    this.currentUser.set(response.email);
    this.currentRole.set(response.role);
    if (response.role === 'CLIENT') {
      this.loadPortalRequests(response.token);
    }
  }

  logout(): void {
    localStorage.removeItem('nuvitec_token');
    localStorage.removeItem('nuvitec_email');
    localStorage.removeItem('nuvitec_role');
    this.currentUser.set('');
    this.currentRole.set('');
    this.portalRequests.set([]);
  }

  loadPortalRequests(token = this.token()): void {
    if (!token) {
      this.portalRequests.set([]);
      return;
    }

    this.http.get<CustomerRequest[]>(`${this.apiBase}/portal/requests`, this.authorized(token)).subscribe({
      next: (requests) => this.portalRequests.set(requests),
      error: () => this.portalRequests.set([])
    });
  }

  createPortalRequest(payload: RequestPayload) {
    return this.http.post<{ id: number }>(
      `${this.apiBase}/portal/requests`,
      {
        title: payload.title,
        description: payload.description,
        serviceType: payload.serviceType
      },
      this.authorized()
    );
  }

  getClients() {
    return this.http.get<ClientUser[]>(`${this.apiBase}/admin/clients`, this.authorized());
  }

  createClient(payload: RegistrationPayload) {
    return this.http.post<{ id: number }>(`${this.apiBase}/admin/clients`, payload, this.authorized());
  }

  updateClient(id: number, client: Omit<ClientUser, 'id' | 'role' | 'createdAt'>) {
    return this.http.put<void>(`${this.apiBase}/admin/clients/${id}`, client, this.authorized());
  }

  deleteClient(id: number) {
    return this.http.delete<void>(`${this.apiBase}/admin/clients/${id}`, this.authorized());
  }

  getAdminRequests() {
    return this.http.get<AdminCustomerRequest[]>(`${this.apiBase}/admin/requests`, this.authorized());
  }

  getContactMessages() {
    return this.http.get<ContactMessage[]>(`${this.apiBase}/admin/messages`, this.authorized());
  }

  updateContactMessageStatus(id: number, status: string) {
    return this.http.put<void>(`${this.apiBase}/admin/messages/${id}/status`, { status }, this.authorized());
  }

  createAdminRequest(payload: Required<RequestPayload>) {
    return this.http.post<{ id: number }>(`${this.apiBase}/admin/requests`, payload, this.authorized());
  }

  updateAdminRequest(id: number, payload: Required<RequestPayload>) {
    return this.http.put<void>(`${this.apiBase}/admin/requests/${id}`, payload, this.authorized());
  }

  deleteAdminRequest(id: number) {
    return this.http.delete<void>(`${this.apiBase}/admin/requests/${id}`, this.authorized());
  }

  private authorized(token = this.token()) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
