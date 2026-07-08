import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-portal-page',
  imports: [RouterLink],
  template: `
    <main>
      <section class="page-hero portal-hero" style="--page-hero-image: url('assets/nuvitec/4d.jpg')">
        <p class="section-kicker">Portal de clientes</p>
        <h1>Área privada</h1>
      </section>

      @if (auth.currentUser()) {
        <section class="portal-page">
          <div class="portal-summary">
            <div>
              <p class="section-kicker">Bienvenido</p>
              <h2>{{ auth.currentUser() }}</h2>
              <p>Consulta solicitudes, presupuestos y estados de atención registrados para tu cuenta.</p>
            </div>
            <button type="button" class="ghost-light-btn" (click)="auth.logout()">Cerrar sesión</button>
          </div>

          <div class="portal-requests">
            <h2>Solicitudes</h2>
            @if (auth.portalRequests().length) {
              @for (request of auth.portalRequests(); track request.code) {
                <article>
                  <strong>{{ request.code }}</strong>
                  <span>{{ request.title }}</span>
                  <em>{{ request.status }}</em>
                </article>
              }
            } @else {
              <p>No hay solicitudes registradas.</p>
            }
          </div>
        </section>
      } @else {
        <section class="portal-empty">
          <p class="section-kicker">Sesión requerida</p>
          <h2>Inicia sesión para acceder al portal</h2>
          <p>Usa el botón Clientes en la parte superior para ingresar con tu cuenta.</p>
          <a class="primary-btn" routerLink="/">Volver al inicio</a>
        </section>
      }
    </main>
  `
})
export class PortalPage {
  constructor(protected readonly auth: AuthService) {}
}
