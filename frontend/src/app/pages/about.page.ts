import { Component } from '@angular/core';

import { advantages, stats, testimonials } from '../nuvitec-data';

@Component({
  selector: 'app-about-page',
  template: `
    <main>
      <section class="page-hero about-hero" style="--page-hero-image: url('assets/nuvitec/trabajo-equipo.jpg')">
        <p class="section-kicker">Acerca de nosotros</p>
        <h1>Una empresa amiga con visión tecnológica</h1>
      </section>

      <section class="about split-layout modern-section">
        <div>
          <p class="section-kicker">Marca de excelencia</p>
          <h2>Nuvitec, nueva visión tecnológica</h2>
          <p>
            Nuestras operaciones iniciaron en Lima en el año 2016. Contamos con un grupo
            de profesionales que continúa trabajando con nosotros por su compromiso,
            calidad humana y orientación al cliente.
          </p>
          <p>
            Nuvitec no solo es una empresa: es una empresa amiga, comprometida con la
            satisfacción del cliente a través de soluciones óptimas.
          </p>
        </div>
        <div class="team-photo">
          <img src="assets/nuvitec/trabajo-equipo.jpg" alt="Equipo de trabajo Nuvitec" loading="lazy" />
        </div>
      </section>

      <section class="mission-section modern-section">
        <article class="glass-card">
          <h3>Misión</h3>
          <p>Brindar soluciones integrales con calidad, innovación, seguridad y acompañamiento cercano.</p>
        </article>
        <article class="glass-card">
          <h3>Visión</h3>
          <p>Ser un aliado estratégico reconocido por confianza, cumplimiento y excelencia operativa.</p>
        </article>
        <article class="glass-card">
          <h3>Valores</h3>
          <p>Responsabilidad, calidad, honestidad, compromiso, mejora continua y orientación al cliente.</p>
        </article>
      </section>

      <section class="why-section modern-section">
        <div class="section-heading">
          <p class="section-kicker">Fortalezas</p>
          <h2>Ventajas competitivas</h2>
        </div>
        <div class="advantage-grid">
          @for (advantage of advantages; track advantage[0]) {
            <article class="glass-card">
              <h3>{{ advantage[0] }}</h3>
              <p>{{ advantage[1] }}</p>
            </article>
          }
        </div>
      </section>

      <section class="stats-strip premium-stats">
        @for (stat of stats; track stat[1]) {
          <article>
            <strong>{{ stat[0] }}</strong>
            <span>{{ stat[1] }}</span>
          </article>
        }
      </section>

      <section class="testimonials modern-section">
        <div class="section-heading">
          <p class="section-kicker">Testimonios</p>
          <h2>Qué dicen los clientes de nuestra compañía</h2>
        </div>
        <div class="testimonial-grid">
          @for (testimonial of testimonials; track testimonial.author) {
            <article>
              <p>“{{ testimonial.quote }}”</p>
              <strong>{{ testimonial.author }}</strong>
              <span>{{ testimonial.role }}</span>
            </article>
          }
        </div>
      </section>
    </main>
  `
})
export class AboutPage {
  protected readonly advantages = advantages;
  protected readonly stats = stats;
  protected readonly testimonials = testimonials;
}
