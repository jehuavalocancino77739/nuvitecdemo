import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService, RegistrationPayload } from '../auth.service';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, RouterLink],
  template: `
    <main class="account-shell">
      <section class="account-intro">
        <p class="section-kicker">Portal de clientes</p>
        <h1>Crea tu cuenta empresarial</h1>
        <p>
          Registra tus datos para enviar solicitudes, consultar su avance y conservar un comprobante
          imprimible de cada atención.
        </p>
      </section>

      <section class="account-form-panel">
        <div class="section-heading compact-heading">
          <p class="section-kicker">Nuevo cliente</p>
          <h2>Datos de acceso</h2>
        </div>

        <form class="business-form" (ngSubmit)="submit()">
          <label>
            Nombre completo
            <input name="fullName" [(ngModel)]="model.fullName" required maxlength="160" />
          </label>
          <label>
            Empresa
            <input name="company" [(ngModel)]="model.company" maxlength="160" />
          </label>
          <label>
            Teléfono
            <input name="phone" [(ngModel)]="model.phone" maxlength="40" />
          </label>
          <label>
            Correo
            <input name="email" type="email" [(ngModel)]="model.email" required maxlength="160" />
          </label>
          <label class="form-span">
            Contraseña
            <input
              name="password"
              type="password"
              [(ngModel)]="model.password"
              required
              minlength="8"
              autocomplete="new-password"
            />
          </label>

          @if (message) {
            <p class="form-message form-span" [class.form-error]="error">{{ message }}</p>
          }

          <div class="form-actions form-span">
            <a routerLink="/" class="ghost-dark-btn">Cancelar</a>
            <button type="submit" class="primary-btn" [disabled]="loading">
              {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </div>
        </form>
      </section>
    </main>
  `
})
export class RegisterPage {
  protected model: RegistrationPayload = {
    fullName: '',
    company: '',
    phone: '',
    email: '',
    password: ''
  };
  protected loading = false;
  protected message = '';
  protected error = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  protected submit(): void {
    this.loading = true;
    this.error = false;
    this.message = '';

    this.auth.register(this.model).subscribe({
      next: () => {
        this.auth.login(this.model.email, this.model.password).subscribe({
          next: (session) => {
            this.auth.startSession(session);
            this.router.navigateByUrl('/portal');
          },
          error: () => {
            this.loading = false;
            this.message = 'Cuenta creada. Ya puedes iniciar sesión.';
          }
        });
      },
      error: (response) => {
        this.loading = false;
        this.error = true;
        this.message = response.error?.message ?? 'No se pudo crear la cuenta.';
      }
    });
  }
}

