import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ContactPayload {
  name: string;
  company: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  ok: boolean;
  message: string;
}

@Component({
  selector: 'app-contact-page',
  imports: [FormsModule],
  template: `
    <main>
      <section class="page-hero contact-hero" style="--page-hero-image: url('assets/nuvitec/contactenos.webp')">
        <p class="section-kicker">Contacto</p>
        <h1>Solicita una visita o presupuesto</h1>
      </section>

      <section class="contact modern-section">
        <div class="contact-info">
          <p class="section-kicker">Contáctenos</p>
          <h2>Analizamos la solución que necesita tu empresa</h2>
          <p>Puede comunicarse en horario de oficina o completar el formulario.</p>

          <div class="contact-cards">
            <article><strong>Oficina central</strong><span>Av. 2 de mayo nro. 647, Urb. Nueva Esperanza - Lima 35</span></article>
            <article><strong>Operaciones</strong><span>Av. Pedro Silva 830-984, Lima 29</span></article>
            <article><strong>Teléfono</strong><span>970 982 915 - 994 152 707</span></article>
            <article><strong>Correo</strong><span>informes@nuvitecsac.pe / ventas@nuvitecsac.pe</span></article>
            <article><strong>Horario</strong><span>Lunes a sábado de 08:00 a 18:00</span></article>
            <article><strong>Redes sociales</strong><span>Facebook · LinkedIn · WhatsApp</span></article>
          </div>
        </div>

        <form class="contact-form" aria-label="Formulario de contacto" (ngSubmit)="sendMessage()">
          <label>
            Nombre
            <input name="name" type="text" placeholder="Tu nombre" autocomplete="name" [(ngModel)]="draft.name" required />
          </label>
          <label>
            Empresa
            <input name="company" type="text" placeholder="Nombre de la empresa" autocomplete="organization" [(ngModel)]="draft.company" />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="correo@empresa.com" autocomplete="email" [(ngModel)]="draft.email" required />
          </label>
          <label>
            Teléfono
            <input name="phone" type="tel" placeholder="999 999 999" autocomplete="tel" [(ngModel)]="phone" />
          </label>
          <label class="full">
            Servicio
            <input name="subject" type="text" placeholder="Servicio solicitado" [(ngModel)]="draft.subject" required />
          </label>
          <label class="full">
            Mensaje
            <textarea name="message" rows="5" placeholder="Describe el servicio que necesitas" [(ngModel)]="draft.message" required></textarea>
          </label>
          @if (notice) {
            <p class="form-message contact-message" [class.form-error]="error">{{ notice }}</p>
          }
          <button class="primary-btn" type="submit" [disabled]="sending">
            {{ sending ? 'Enviando...' : 'Enviar mensaje' }}
          </button>
        </form>

        <iframe
          class="map-frame"
          title="Ubicación Nuvitec"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000.5631455135708!2d-76.9685745443935!3d-12.166947345307673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses-419!2spe!4v1650476512585!5m2!1ses-419!2spe"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen>
        </iframe>
      </section>
    </main>
  `
})
export class ContactPage {
  private readonly apiBase = 'http://127.0.0.1:8080/api';

  protected draft: ContactPayload = this.emptyDraft();
  protected phone = '';
  protected sending = false;
  protected notice = '';
  protected error = false;

  constructor(private readonly http: HttpClient) {}

  protected sendMessage(): void {
    if (!this.draft.name.trim() || !this.draft.email.trim() || !this.draft.subject.trim() || !this.draft.message.trim()) {
      this.notice = 'Completa nombre, email, servicio y mensaje para enviar la consulta.';
      this.error = true;
      return;
    }

    this.sending = true;
    this.notice = '';
    this.error = false;

    const payload: ContactPayload = {
      ...this.draft,
      name: this.draft.name.trim(),
      company: this.draft.company.trim(),
      email: this.draft.email.trim(),
      subject: this.draft.subject.trim(),
      message: this.withPhone(this.draft.message.trim())
    };

    this.http.post<ContactResponse>(`${this.apiBase}/contact`, payload).subscribe({
      next: (response) => {
        this.sending = false;
        this.notice = response.message || 'Mensaje enviado correctamente. Un asesor se comunicará contigo pronto.';
        this.draft = this.emptyDraft();
        this.phone = '';
      },
      error: () => {
        this.sending = false;
        this.error = true;
        this.notice = 'No se pudo enviar el mensaje. Verifica que Spring esté iniciado en el puerto 8080.';
      }
    });
  }

  private withPhone(message: string): string {
    const phone = this.phone.trim();
    return phone ? `Teléfono: ${phone}\n\n${message}` : message;
  }

  private emptyDraft(): ContactPayload {
    return { name: '', company: '', email: '', subject: '', message: '' };
  }
}
