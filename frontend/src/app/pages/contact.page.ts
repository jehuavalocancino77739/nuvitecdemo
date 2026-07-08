import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  template: `
    <main>
      <section class="page-hero contact-hero">
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
            <article><strong>Teléfonos</strong><span>970 982 915 - 994 152 707</span></article>
            <article><strong>Correo</strong><span>informes@nuvitecsac.pe / ventas@nuvitecsac.pe</span></article>
            <article><strong>Horario</strong><span>Lunes a sábado de 08:00 a 18:00</span></article>
            <article><strong>Redes sociales</strong><span>Facebook · LinkedIn · WhatsApp </span></article>
          </div>
        </div>

        <form class="contact-form" aria-label="Formulario de contacto">
          <label>
            Nombre
            <input type="text" placeholder="Tu nombre" autocomplete="name" />
          </label>
          <label>
            Empresa
            <input type="text" placeholder="Nombre de la empresa" autocomplete="organization" />
          </label>
          <label>
            Email
            <input type="email" placeholder="correo@empresa.com" autocomplete="email" />
          </label>
          <label>
            Teléfono
            <input type="tel" placeholder="999 999 999" autocomplete="tel" />
          </label>
          <label class="full">
            Servicio
            <input type="text" placeholder="Servicio solicitado" />
          </label>
          <label class="full">
            Mensaje
            <textarea rows="5" placeholder="Describe el servicio que necesitas"></textarea>
          </label>
          <button class="primary-btn" type="button">Enviar mensaje</button>
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
export class ContactPage {}
