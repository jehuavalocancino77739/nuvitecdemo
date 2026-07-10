import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import {
  AdminCustomerRequest,
  AuthService,
  ClientUser,
  ContactMessage,
  RegistrationPayload,
  RequestPayload
} from '../auth.service';

@Component({
  selector: 'app-admin-page',
  imports: [DatePipe, FormsModule, RouterLink],
  template: `
    <main>
      <section class="admin-hero">
        <div>
          <p class="section-kicker">Administración</p>
          <h1>Clientes y solicitudes</h1>
          <p>Control operativo de cuentas, servicios y estados de atención.</p>
        </div>
        <div class="admin-metrics">
          <span><strong>{{ clients.length }}</strong> clientes</span>
          <span><strong>{{ requests.length }}</strong> solicitudes</span>
          <span><strong>{{ contactMessages.length }}</strong> mensajes</span>
          <button type="button" class="ghost-light-btn" (click)="auth.logout()">Cerrar sesión</button>
        </div>
      </section>

      @if (auth.isAdmin()) {
        <section class="admin-workspace">
          <nav class="admin-tabs" aria-label="Secciones administrativas">
            <button type="button" [class.active]="tab === 'clients'" (click)="tab = 'clients'">Clientes</button>
            <button type="button" [class.active]="tab === 'requests'" (click)="tab = 'requests'">Solicitudes</button>
            <button type="button" [class.active]="tab === 'messages'" (click)="tab = 'messages'">Mensajes</button>
          </nav>

          @if (message) {
            <p class="admin-notice" [class.form-error]="error">{{ message }}</p>
          }

          @if (tab === 'clients') {
            <header class="admin-section-header">
              <div>
                <p class="section-kicker">Directorio</p>
                <h2>Clientes registrados</h2>
              </div>
              <button type="button" class="primary-btn" (click)="newClient()">Nuevo cliente</button>
            </header>

            @if (clientFormOpen) {
              <form class="admin-form" (ngSubmit)="saveClient()">
                <h3>{{ editingClientId ? 'Editar cliente' : 'Registrar cliente' }}</h3>
                <label>Nombre<input name="clientName" [(ngModel)]="clientDraft.fullName" required /></label>
                <label>Empresa<input name="clientCompany" [(ngModel)]="clientDraft.company" /></label>
                <label>Correo<input name="clientEmail" type="email" [(ngModel)]="clientDraft.email" required /></label>
                <label>Teléfono<input name="clientPhone" [(ngModel)]="clientDraft.phone" /></label>
                @if (!editingClientId) {
                  <label>
                    Contraseña
                    <input name="clientPassword" type="password" [(ngModel)]="clientDraft.password" required minlength="8" />
                  </label>
                } @else {
                  <label class="toggle-label">
                    <input name="clientEnabled" type="checkbox" [(ngModel)]="clientEnabled" />
                    Cuenta activa
                  </label>
                }
                <div class="form-actions">
                  <button type="button" class="ghost-dark-btn" (click)="clientFormOpen = false">Cancelar</button>
                  <button type="submit" class="primary-btn">Guardar cliente</button>
                </div>
              </form>
            }

            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Empresa</th>
                    <th>Contacto</th>
                    <th>Estado</th>
                    <th>Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (client of clients; track client.id) {
                    <tr>
                      <td><strong>{{ client.fullName }}</strong><small>{{ client.email }}</small></td>
                      <td>{{ client.company || 'Sin empresa' }}</td>
                      <td>{{ client.phone || 'Sin teléfono' }}</td>
                      <td><span class="status-pill">{{ client.enabled ? 'Activo' : 'Inactivo' }}</span></td>
                      <td>{{ client.createdAt | date: 'dd/MM/yyyy' }}</td>
                      <td class="row-actions">
                        <button type="button" (click)="editClient(client)">Editar</button>
                        <button type="button" class="danger-action" (click)="removeClient(client)">Eliminar</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else if (tab === 'requests') {
            <header class="admin-section-header">
              <div>
                <p class="section-kicker">Operaciones</p>
                <h2>Solicitudes de servicio</h2>
              </div>
              <button type="button" class="primary-btn" (click)="newRequest()">Nueva solicitud</button>
            </header>

            @if (requestFormOpen) {
              <form class="admin-form request-admin-form" (ngSubmit)="saveRequest()">
                <h3>{{ editingRequestId ? 'Editar solicitud' : 'Registrar solicitud' }}</h3>
                <label>
                  Cliente
                  <select name="requestClient" [(ngModel)]="requestDraft.userId" required>
                    <option [ngValue]="0">Seleccionar</option>
                    @for (client of clients; track client.id) {
                      <option [ngValue]="client.id">{{ client.fullName }} · {{ client.company || client.email }}</option>
                    }
                  </select>
                </label>
                <label>
                  Servicio
                  <select name="requestService" [(ngModel)]="requestDraft.serviceType" required>
                    @for (service of serviceTypes; track service) {
                      <option [value]="service">{{ service }}</option>
                    }
                  </select>
                </label>
                <label>Asunto<input name="requestTitle" [(ngModel)]="requestDraft.title" required /></label>
                <label>
                  Estado
                  <select name="requestStatus" [(ngModel)]="requestDraft.status" required>
                    @for (status of statuses; track status) {
                      <option [value]="status">{{ status }}</option>
                    }
                  </select>
                </label>
                <label class="form-span">
                  Descripción
                  <textarea name="requestDescription" [(ngModel)]="requestDraft.description" rows="4" required></textarea>
                </label>
                <div class="form-actions form-span">
                  <button type="button" class="ghost-dark-btn" (click)="requestFormOpen = false">Cancelar</button>
                  <button type="submit" class="primary-btn">Guardar solicitud</button>
                </div>
              </form>
            }

            <div class="data-table-wrap">
              <table class="data-table requests-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Solicitud</th>
                    <th>Estado</th>
                    <th>Actualizada</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (request of requests; track request.id) {
                    <tr>
                      <td><strong>{{ request.code }}</strong></td>
                      <td><strong>{{ request.clientName }}</strong><small>{{ request.company || request.clientEmail }}</small></td>
                      <td><strong>{{ request.title }}</strong><small>{{ request.serviceType }}</small></td>
                      <td><span class="status-pill">{{ request.status }}</span></td>
                      <td>{{ request.updatedAt | date: 'dd/MM/yyyy' }}</td>
                      <td class="row-actions">
                        <button type="button" (click)="editRequest(request)">Editar</button>
                        <button type="button" class="danger-action" (click)="removeRequest(request)">Eliminar</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <header class="admin-section-header">
              <div>
                <p class="section-kicker">Formulario web</p>
                <h2>Mensajes de contacto</h2>
              </div>
              <button type="button" class="ghost-dark-btn" (click)="loadMessages()">Actualizar</button>
            </header>

            @if (contactMessages.length) {
              <div class="data-table-wrap">
                <table class="data-table messages-table">
                  <thead>
                    <tr>
                      <th>Remitente</th>
                      <th>Empresa</th>
                      <th>Consulta</th>
                      <th>Mensaje</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (contact of contactMessages; track contact.id) {
                      <tr>
                        <td><strong>{{ contact.name }}</strong><small>{{ contact.email }}</small></td>
                        <td>{{ contact.company || 'Sin empresa' }}</td>
                        <td><strong>{{ contact.subject || 'Consulta general' }}</strong></td>
                        <td class="message-cell">{{ contact.message }}</td>
                        <td><span class="status-pill">{{ contact.status }}</span></td>
                        <td>{{ contact.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td class="row-actions message-actions">
                          <button type="button" (click)="markMessage(contact, 'Leido')">Leido</button>
                          <button type="button" (click)="markMessage(contact, 'Atendido')">Atendido</button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="empty-state">
                <h3>Aún no hay mensajes</h3>
                <p>Las consultas enviadas desde la página de contacto aparecerán aquí.</p>
              </div>
            }
          }
        </section>
      } @else {
        <section class="portal-empty">
          <p class="section-kicker">Acceso restringido</p>
          <h2>Esta sección requiere una cuenta administradora</h2>
          <a routerLink="/" class="primary-btn">Volver al inicio</a>
        </section>
      }
    </main>
  `
})
export class AdminPage implements OnInit {
  protected readonly serviceTypes = [
    'Soporte técnico',
    'Construcción y pavimentaciones',
    'Distribución eléctrica',
    'Apoyo logístico y transporte',
    'Soluciones TI',
    'Seguridad y cámaras'
  ];
  protected readonly statuses = ['Recibida', 'En revisión', 'Cotizada', 'Programada', 'En proceso', 'Atendida', 'Cancelada'];
  protected clients: ClientUser[] = [];
  protected requests: AdminCustomerRequest[] = [];
  protected contactMessages: ContactMessage[] = [];
  protected tab: 'clients' | 'requests' | 'messages' = 'clients';
  protected clientFormOpen = false;
  protected requestFormOpen = false;
  protected editingClientId = 0;
  protected editingRequestId = 0;
  protected clientEnabled = true;
  protected message = '';
  protected error = false;
  protected clientDraft: RegistrationPayload = this.emptyClient();
  protected requestDraft: Required<RequestPayload> = this.emptyRequest();

  constructor(protected readonly auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.isAdmin()) {
      this.refresh();
    }
  }

  protected newClient(): void {
    this.editingClientId = 0;
    this.clientEnabled = true;
    this.clientDraft = this.emptyClient();
    this.clientFormOpen = true;
  }

  protected editClient(client: ClientUser): void {
    this.editingClientId = client.id;
    this.clientEnabled = client.enabled;
    this.clientDraft = {
      fullName: client.fullName,
      company: client.company ?? '',
      phone: client.phone ?? '',
      email: client.email,
      password: ''
    };
    this.clientFormOpen = true;
  }

  protected saveClient(): void {
    const operation: Observable<unknown> = this.editingClientId
      ? this.auth.updateClient(this.editingClientId, {
          email: this.clientDraft.email,
          fullName: this.clientDraft.fullName,
          company: this.clientDraft.company,
          phone: this.clientDraft.phone,
          enabled: this.clientEnabled
        })
      : this.auth.createClient(this.clientDraft);

    operation.subscribe({
      next: () => {
        this.notice('Cliente guardado correctamente.');
        this.clientFormOpen = false;
        this.loadClients();
      },
      error: (response: any) => this.notice(response.error?.message ?? 'No se pudo guardar el cliente.', true)
    });
  }

  protected removeClient(client: ClientUser): void {
    if (!confirm(`¿Eliminar a ${client.fullName} y todas sus solicitudes?`)) return;
    this.auth.deleteClient(client.id).subscribe({
      next: () => {
        this.notice('Cliente eliminado.');
        this.refresh();
      },
      error: (response) => this.notice(response.error?.message ?? 'No se pudo eliminar el cliente.', true)
    });
  }

  protected newRequest(): void {
    this.editingRequestId = 0;
    this.requestDraft = this.emptyRequest();
    this.requestFormOpen = true;
  }

  protected editRequest(request: AdminCustomerRequest): void {
    this.editingRequestId = request.id;
    this.requestDraft = {
      userId: request.userId,
      title: request.title,
      description: request.description,
      serviceType: request.serviceType,
      status: request.status
    };
    this.requestFormOpen = true;
  }

  protected saveRequest(): void {
    const operation: Observable<unknown> = this.editingRequestId
      ? this.auth.updateAdminRequest(this.editingRequestId, this.requestDraft)
      : this.auth.createAdminRequest(this.requestDraft);

    operation.subscribe({
      next: () => {
        this.notice('Solicitud guardada correctamente.');
        this.requestFormOpen = false;
        this.loadRequests();
      },
      error: (response: any) => this.notice(response.error?.message ?? 'No se pudo guardar la solicitud.', true)
    });
  }

  protected removeRequest(request: AdminCustomerRequest): void {
    if (!confirm(`¿Eliminar la solicitud ${request.code}?`)) return;
    this.auth.deleteAdminRequest(request.id).subscribe({
      next: () => {
        this.notice('Solicitud eliminada.');
        this.loadRequests();
      },
      error: (response) => this.notice(response.error?.message ?? 'No se pudo eliminar la solicitud.', true)
    });
  }

  private refresh(): void {
    this.loadClients();
    this.loadRequests();
    this.loadMessages();
  }

  private loadClients(): void {
    this.auth.getClients().subscribe({
      next: (clients) => (this.clients = clients),
      error: () => this.notice('No se pudieron cargar los clientes.', true)
    });
  }

  private loadRequests(): void {
    this.auth.getAdminRequests().subscribe({
      next: (requests) => (this.requests = requests),
      error: () => this.notice('No se pudieron cargar las solicitudes.', true)
    });
  }

  protected loadMessages(): void {
    this.auth.getContactMessages().subscribe({
      next: (messages) => (this.contactMessages = messages),
      error: () => this.notice('No se pudieron cargar los mensajes.', true)
    });
  }

  protected markMessage(contact: ContactMessage, status: 'Nuevo' | 'Leido' | 'Atendido'): void {
    this.auth.updateContactMessageStatus(contact.id, status).subscribe({
      next: () => {
        this.notice(`Mensaje marcado como ${status}.`);
        this.loadMessages();
      },
      error: (response) => this.notice(response.error?.message ?? 'No se pudo actualizar el mensaje.', true)
    });
  }

  private notice(message: string, error = false): void {
    this.message = message;
    this.error = error;
  }

  private emptyClient(): RegistrationPayload {
    return { fullName: '', company: '', phone: '', email: '', password: '' };
  }

  private emptyRequest(): Required<RequestPayload> {
    return {
      userId: 0,
      title: '',
      description: '',
      serviceType: this.serviceTypes[0],
      status: this.statuses[0]
    };
  }
}
