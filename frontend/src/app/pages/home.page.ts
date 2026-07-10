import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { advantages, clientLogos, faqItems, processSteps, services, stats, testimonials } from '../nuvitec-data';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <main>
      <section class="hero premium-section">
        <div class="hero-copy reveal">
          <p class="eyebrow">Innovación + calidad + confianza</p>
          <h1>Soluciones tecnológicas para empresas que no pueden detenerse</h1>
          <p class="tagline">Nueva visión tecnológica</p>
          <p class="hero-text">
            Brindamos soluciones integrales en tecnología, infraestructura, logística y seguridad
            para impulsar la continuidad y el crecimiento de tu empresa.
          </p>

          <div class="hero-actions">
            <a class="primary-btn" routerLink="/contacto">Solicitar cotización</a>
            <a class="ghost-btn" routerLink="/contacto">Contáctanos</a>
          </div>
        </div>

        <div class="hero-visual reveal" aria-label="Operaciones tecnológicas Nuvitec">
          <img src="assets/nuvitec/4d.webp" alt="Equipo técnico trabajando en infraestructura tecnológica" loading="eager" />
          <div class="hero-metric">
            <strong>24/7</strong>
            <span>Soporte remoto disponible</span>
          </div>
        </div>

        <a class="scroll-cue" href="#servicios" aria-label="Bajar a servicios">↓</a>
      </section>

      <section id="servicios" class="services modern-section">
        <div class="section-heading reveal">
          <p class="section-kicker">Lo que hacemos</p>
          <h2>Nuestros <span>servicios</span></h2>
          <p>Soluciones técnicas y operativas diseñadas para mantener tu empresa segura, conectada y en movimiento.</p>
        </div>

        <div class="service-grid">
          @for (service of services; track service.title) {
            <article class="service-card reveal">
              <img [src]="service.image" [alt]="service.title" loading="lazy" />
              <div class="service-card-body">
                <h3>{{ service.title }}</h3>
                <p>{{ service.text }}</p>
                <a routerLink="/contacto">Solicitar información</a>
              </div>
            </article>
          }
        </div>
      </section>

      <section class="about-preview modern-section split-layout">
        <div class="reveal">
          <p class="section-kicker">Nosotros</p>
          <h2>Nuvitec, nueva visión tecnológica</h2>
          <p>
            Iniciamos operaciones en Lima en 2016. Somos un equipo multidisciplinario
            enfocado en brindar soluciones óptimas, confiables y humanas para empresas.
          </p>
          <div class="mission-grid">
            <article>
              <h3>Misión</h3>
              <p>Brindar servicios integrales con calidad, innovación y soporte cercano.</p>
            </article>
            <article>
              <h3>Visión</h3>
              <p>Ser un socio estratégico reconocido por confianza, tecnología y cumplimiento.</p>
            </article>
          </div>
          <a class="primary-btn" routerLink="/nosotros">Conocer la empresa</a>
        </div>
        <div class="team-photo reveal">
          <img src="assets/nuvitec/trabajo-equipo.webp" alt="Equipo profesional de Nuvitec" loading="lazy" />
        </div>
      </section>

      <section class="why-section modern-section">
        <div class="section-heading reveal">
          <p class="section-kicker">Por qué elegirnos</p>
          <h2>Confianza técnica con atención cercana</h2>
        </div>
        <div class="advantage-grid">
          @for (advantage of advantages; track advantage[0]) {
            <article class="glass-card reveal">
              <h3>{{ advantage[0] }}</h3>
              <p>{{ advantage[1] }}</p>
            </article>
          }
        </div>
      </section>

      <section class="stats-strip premium-stats" aria-label="Estadísticas Nuvitec">
        @for (stat of stats; track stat[1]) {
          <article class="reveal">
            <strong>{{ stat[0] }}</strong>
            <span>{{ stat[1] }}</span>
          </article>
        }
      </section>

      <section class="process-section modern-section">
        <div class="section-heading reveal">
          <p class="section-kicker">Proceso de trabajo</p>
          <h2>De la solicitud al soporte continuo</h2>
        </div>
        <div class="process-grid">
          @for (step of processSteps; track step[0]) {
            <article class="process-card reveal">
              <strong>{{ step[0] }}</strong>
              <h3>{{ step[1] }}</h3>
              <p>{{ step[2] }}</p>
            </article>
          }
        </div>
      </section>

      <section class="testimonials modern-section">
        <div class="section-heading reveal">
          <p class="section-kicker">Testimonios</p>
          <h2>Clientes que confían en nuestro trabajo</h2>
        </div>
        <div class="testimonial-grid">
          @for (testimonial of testimonials; track testimonial.author) {
            <article class="reveal">
              <p>“{{ testimonial.quote }}”</p>
              <strong>{{ testimonial.author }}</strong>
              <span>{{ testimonial.role }}</span>
            </article>
          }
        </div>
      </section>

      <section class="logo-section">
        <p>Empresas que confían en nosotros</p>
        <div class="logo-track" aria-label="Clientes y aliados">
          @for (logo of clientLogos; track logo) {
            <span>{{ logo }}</span>
          }
          @for (logo of clientLogos; track logo + '-copy') {
            <span>{{ logo }}</span>
          }
        </div>
      </section>

      <section class="faq-section modern-section">
        <div class="section-heading reveal">
          <p class="section-kicker">FAQ</p>
          <h2>Preguntas frecuentes</h2>
        </div>
        <div class="faq-list">
          @for (item of faqItems; track item[0]) {
            <details class="reveal">
              <summary>{{ item[0] }}</summary>
              <p>{{ item[1] }}</p>
            </details>
          }
        </div>
      </section>

      <section class="contact-cta modern-section split-layout">
        <div class="reveal">
          <p class="section-kicker">Contacto</p>
          <h2>¿Listo para mejorar tu operación?</h2>
          <p>Cuéntanos qué necesitas y prepararemos una propuesta técnica para tu empresa.</p>
        </div>
        <div class="cta-panel reveal">
          <a class="primary-btn" routerLink="/contacto">Solicitar cotización</a>
          <a class="ghost-dark-btn" href="https://wa.me/51970982915?text=Hola%20Nuvitec%2C%20quisiera%20solicitar%20informaci%C3%B3n%20sobre%20sus%20servicios.%20Mi%20nombre%20es%3A" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </section>
    </main>
  `
})
export class HomePage {
  protected readonly services = services;
  protected readonly advantages = advantages;
  protected readonly stats = stats;
  protected readonly processSteps = processSteps;
  protected readonly testimonials = testimonials;
  protected readonly clientLogos = clientLogos;
  protected readonly faqItems = faqItems;
}
