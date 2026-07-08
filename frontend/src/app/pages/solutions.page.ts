import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solutions-page',
  imports: [RouterLink],
  template: `
    <main>
      <section class="page-hero solutions-hero ti-hero" style="--page-hero-image: url('assets/nuvitec/3.jpg')">
        <div>
          <p class="section-kicker">Soluciones TI</p>
          <h1>Infraestructura tecnológica segura, estable y lista para crecer</h1>
          <p>
            Soporte técnico, redes, servidores, continuidad operativa y seguridad para
            empresas que necesitan trabajar sin interrupciones.
          </p>
          <div class="hero-actions">
            <a class="primary-btn" routerLink="/contacto">Solicitar evaluación</a>
            <a class="whatsapp-btn" href="https://wa.me/51970982915" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </section>

      <section class="ti-overview modern-section split-layout">
        <div>
          <p class="section-kicker">Tecnología para empresas</p>
          <h2>Soluciones TI a medida del negocio</h2>
          <p>
            Contamos con profesionales con experiencia en infraestructura TI, soporte
            técnico, redes, seguridad y continuidad operativa para empresas.
          </p>
          <p>
            Diseñamos cada atención pensando en disponibilidad, protección de activos,
            productividad del equipo y facilidad de mantenimiento.
          </p>
        </div>
        <div class="ti-console">
          <span></span>
          <span></span>
          <span></span>
          <pre>nuvitec.monitoring.status = "operativo";
network.latency = "estable";
security.layer = "activo";
support.mode = "remoto + presencial";</pre>
        </div>
      </section>

      <section class="ti-services modern-section">
        <div class="section-heading">
          <p class="section-kicker">Áreas de atención</p>
          <h2>Soporte integral para tu operación digital</h2>
        </div>

        <div class="ti-grid">
          <article>
            <span>01</span>
            <h3>Soporte técnico</h3>
            <p>Atención presencial y remota para equipos, usuarios, incidencias y mantenimiento preventivo.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Redes empresariales</h3>
            <p>Instalación, diagnóstico y mantenimiento de redes, cableado estructurado y conectividad.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Servidores y equipos</h3>
            <p>Configuración de estaciones de trabajo, servidores, respaldos y continuidad operativa.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Seguridad electrónica</h3>
            <p>Cámaras, videovigilancia, control y soluciones para proteger instalaciones y activos.</p>
          </article>
        </div>
      </section>

      <section class="ti-benefits modern-section">
        <div class="section-heading">
          <p class="section-kicker">Beneficios</p>
          <h2>Menos interrupciones, más control</h2>
        </div>
        <div class="benefit-timeline">
          <article>
            <strong>Respuesta rápida</strong>
            <p>Priorizamos incidentes críticos para reducir tiempos de parada.</p>
          </article>
          <article>
            <strong>Diagnóstico técnico</strong>
            <p>Evaluamos causas, riesgos y acciones antes de ejecutar cambios.</p>
          </article>
          <article>
            <strong>Mantenimiento preventivo</strong>
            <p>Planificamos revisiones para evitar fallas repetitivas.</p>
          </article>
          <article>
            <strong>Soporte continuo</strong>
            <p>Acompañamos la operación con atención remota y presencial.</p>
          </article>
        </div>
      </section>

      <section class="contact-cta modern-section split-layout">
        <div>
          <p class="section-kicker">Evaluación TI</p>
          <h2>Cuéntanos qué necesitas estabilizar o mejorar</h2>
          <p>Podemos revisar tu infraestructura actual y proponer una solución escalable.</p>
        </div>
        <div class="cta-panel">
          <a class="primary-btn" routerLink="/contacto">Solicitar cotización</a>
          <a class="ghost-dark-btn" routerLink="/servicios">Ver servicios</a>
        </div>
      </section>
    </main>
  `
})
export class SolutionsPage {}
