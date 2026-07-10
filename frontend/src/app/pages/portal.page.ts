import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService, CustomerRequest, RequestPayload } from '../auth.service';

@Component({
  selector: 'app-portal-page',
  imports: [DatePipe, FormsModule, RouterLink],
  template: `
    <main>
      <section class="page-hero portal-hero" style="--page-hero-image: url('assets/nuvitec/4d.webp')">
        <p class="section-kicker">Portal de clientes</p>
        <h1>Gestión de solicitudes</h1>
      </section>

      @if (auth.currentUser() && auth.currentRole() === 'CLIENT') {
        <section class="workspace-shell">
          <header class="workspace-header">
            <div>
              <p class="section-kicker">Cuenta activa</p>
              <h2>{{ auth.currentUser() }}</h2>
            </div>
            <div class="workspace-actions">
              <button type="button" class="ghost-dark-btn" (click)="auth.logout()">Cerrar sesión</button>
              <button type="button" class="primary-btn" (click)="formOpen.set(!formOpen())">
                {{ formOpen() ? 'Cerrar formulario' : 'Nueva solicitud' }}
              </button>
            </div>
          </header>

          @if (formOpen()) {
            <form class="request-form" (ngSubmit)="createRequest()">
              <label>
                Servicio
                <select name="serviceType" [(ngModel)]="draft.serviceType" required>
                  <option value="">Seleccionar</option>
                  @for (service of serviceTypes; track service) {
                    <option [value]="service">{{ service }}</option>
                  }
                </select>
              </label>
              <label>
                Asunto
                <input name="title" [(ngModel)]="draft.title" required maxlength="180" />
              </label>
              <label class="form-span">
                Descripción
                <textarea name="description" [(ngModel)]="draft.description" required rows="5"></textarea>
              </label>
              @if (formMessage) {
                <p class="form-message form-span" [class.form-error]="formError">{{ formMessage }}</p>
              }
              <div class="form-actions form-span">
                <button type="submit" class="primary-btn" [disabled]="saving">
                  {{ saving ? 'Registrando...' : 'Registrar solicitud' }}
                </button>
              </div>
            </form>
          }

          <section class="request-list">
            <div class="list-heading">
              <div>
                <p class="section-kicker">Seguimiento</p>
                <h2>Mis solicitudes</h2>
              </div>
              <span>{{ auth.portalRequests().length }} registradas</span>
            </div>

            @if (auth.portalRequests().length) {
              @for (request of auth.portalRequests(); track request.id) {
                <article class="request-row">
                  <div class="request-code">
                    <strong>{{ request.code }}</strong>
                    <span>{{ request.createdAt | date: 'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="request-main">
                    <small>{{ request.serviceType }}</small>
                    <h3>{{ request.title }}</h3>
                    <p>{{ request.description }}</p>
                  </div>
                  <span class="status-pill">{{ request.status }}</span>
                  <button type="button" class="print-btn" (click)="print(request)">Imprimir</button>
                </article>
              }
            } @else {
              <div class="empty-state">
                <h3>Aún no tienes solicitudes</h3>
                <p>Registra la primera para comenzar el seguimiento.</p>
              </div>
            }
          </section>
        </section>
      } @else {
        <section class="portal-empty">
          <p class="section-kicker">Sesión requerida</p>
          <h2>Inicia sesión como cliente para acceder al portal</h2>
          <a class="primary-btn" routerLink="/registro">Crear cuenta</a>
        </section>
      }

      @if (printable()) {
        <section class="print-sheet">
          <header>
            <img src="assets/nuvitec/nuviteclogo.png" alt="Nuvitec" />
            <div>
              <strong>Comprobante de solicitud</strong>
              <span>{{ printable()!.code }}</span>
            </div>
          </header>
          <dl>
            <div><dt>Cliente</dt><dd>{{ auth.currentUser() }}</dd></div>
            <div><dt>Fecha</dt><dd>{{ printable()!.createdAt | date: 'dd/MM/yyyy HH:mm' }}</dd></div>
            <div><dt>Servicio</dt><dd>{{ printable()!.serviceType }}</dd></div>
            <div><dt>Estado</dt><dd>{{ printable()!.status }}</dd></div>
            <div class="print-wide"><dt>Asunto</dt><dd>{{ printable()!.title }}</dd></div>
            <div class="print-wide"><dt>Descripción</dt><dd>{{ printable()!.description }}</dd></div>
          </dl>
          <footer>Nuvitec.pe · informes@nuvitecsac.pe · 970 982 915</footer>
        </section>
      }
    </main>
  `
})
export class PortalPage {
  protected readonly formOpen = signal(false);
  protected readonly printable = signal<CustomerRequest | null>(null);
  protected readonly serviceTypes = [
    'Soporte técnico',
    'Construcción y pavimentaciones',
    'Distribución eléctrica',
    'Apoyo logístico y transporte',
    'Soluciones TI',
    'Seguridad y cámaras'
  ];
  protected draft: RequestPayload = { title: '', description: '', serviceType: '' };
  protected saving = false;
  protected formMessage = '';
  protected formError = false;

  constructor(protected readonly auth: AuthService) {}

  protected createRequest(): void {
    this.saving = true;
    this.formMessage = '';
    this.formError = false;
    this.auth.createPortalRequest(this.draft).subscribe({
      next: () => {
        this.saving = false;
        this.formMessage = 'Solicitud registrada correctamente.';
        this.draft = { title: '', description: '', serviceType: '' };
        this.auth.loadPortalRequests();
      },
      error: (response) => {
        this.saving = false;
        this.formError = true;
        this.formMessage = response.error?.message ?? 'No se pudo registrar la solicitud.';
      }
    });
  }

  protected print(request: CustomerRequest): void {
    this.printable.set(request);
    setTimeout(() => window.print());
  }
}
