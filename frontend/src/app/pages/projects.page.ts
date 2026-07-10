import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects-page',
  imports: [RouterLink],
  styles: [`
    .project-stats {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(3, 1fr);
      margin: 24px 0;
    }

    .project-stats article,
    .sector-grid article {
      background: rgba(255, 255, 255, 0.78);
      border: 1px solid #d8e6f5;
      border-radius: 8px;
      padding: 18px;
    }

    .project-stats strong {
      color: #176cf0;
      display: block;
      font-size: 28px;
      line-height: 1;
    }

    .project-stats span,
    .sector-grid span {
      color: #526781;
      display: block;
      line-height: 1.55;
      margin-top: 8px;
    }

    .project-cases {
      background: #f6faff;
    }

    .case-grid {
      display: grid;
      gap: 22px;
      grid-template-columns: repeat(3, 1fr);
    }

    .case-grid article {
      background: #fff;
      border: 1px solid #d9e6f5;
      border-radius: 8px;
      box-shadow: 0 22px 54px rgba(20, 52, 94, 0.09);
      overflow: hidden;
      transition: transform 0.22s ease, box-shadow 0.22s ease;
    }

    .case-grid article:hover {
      box-shadow: 0 28px 70px rgba(20, 52, 94, 0.15);
      transform: translateY(-6px);
    }

    .case-grid img {
      aspect-ratio: 16 / 10;
      display: block;
      object-fit: cover;
      width: 100%;
    }

    .case-grid article > div {
      padding: 24px;
    }

    .case-grid span {
      color: #176cf0;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
    }

    .case-grid h3 {
      color: #09234e;
      font-size: 21px;
      margin: 12px 0;
      text-transform: uppercase;
    }

    .case-grid p,
    .case-grid li,
    .project-timeline p {
      color: #526781;
      line-height: 1.7;
    }

    .case-grid ul {
      display: grid;
      gap: 8px;
      list-style: none;
      margin: 18px 0 0;
      padding: 0;
    }

    .case-grid li {
      padding-left: 18px;
      position: relative;
    }

    .case-grid li::before {
      background: #20c95a;
      border-radius: 999px;
      content: "";
      height: 7px;
      left: 0;
      position: absolute;
      top: 10px;
      width: 7px;
    }

    .project-sectors,
    .project-process {
      background: #fff;
    }

    .sector-grid,
    .project-timeline {
      display: grid;
      gap: 18px;
    }

    .sector-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .sector-grid strong {
      color: #09234e;
      display: block;
      font-size: 17px;
      text-transform: uppercase;
    }

    .project-timeline {
      grid-template-columns: repeat(4, 1fr);
    }

    .project-timeline article {
      border-left: 3px solid #176cf0;
      padding: 0 18px 0 22px;
    }

    .project-timeline span {
      color: #20c95a;
      display: block;
      font-size: 14px;
      font-weight: 900;
      margin-bottom: 12px;
    }

    .project-timeline strong {
      color: #09234e;
      display: block;
      font-size: 18px;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    @media (max-width: 1180px) {
      .case-grid,
      .sector-grid,
      .project-timeline {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 760px) {
      .project-stats,
      .case-grid,
      .sector-grid,
      .project-timeline {
        grid-template-columns: 1fr;
      }
    }
  `],
  template: `
    <main>
      <section class="page-hero projects-hero" style="--page-hero-image: url('assets/nuvitec/4d.jpg')">
        <p class="section-kicker">Proyectos</p>
        <h1>Soluciones ejecutadas con control, seguridad y respaldo técnico</h1>
      </section>

      <section class="team-section split-layout modern-section">
        <div class="team-photo">
          <img src="assets/nuvitec/trabajo-equipo.jpg" alt="Equipo técnico de Nuvitec coordinando un proyecto" loading="lazy" />
        </div>
        <div>
          <p class="section-kicker">Proyectos integrales</p>
          <h2>Profesionales comprometidos con cada etapa del servicio</h2>
          <h3>Coordinamos personal técnico, materiales, tiempos y seguimiento para entregar soluciones completas.</h3>
          <p>
            Parte de nuestra filosofía es el cumplimiento de metas, adecuándonos a los
            requerimientos de cada cliente y brindando soluciones a medida para operaciones,
            infraestructura, tecnología y seguridad.
          </p>
          <div class="project-stats" aria-label="Resumen de proyectos Nuvitec">
            <article><strong>+80</strong><span>atenciones técnicas</span></article>
            <article><strong>6</strong><span>líneas de servicio</span></article>
            <article><strong>24/7</strong><span>soporte coordinado</span></article>
          </div>
          <a class="primary-btn" routerLink="/contacto">Solicitar evaluación</a>
        </div>
      </section>

      <section class="project-cases modern-section">
        <div class="section-heading">
          <p class="section-kicker">Casos de referencia</p>
          <h2>Proyectos que reflejan nuestra capacidad operativa</h2>
          <p>Estos ejemplos son referenciales y pueden reemplazarse por proyectos reales autorizados por el cliente.</p>
        </div>

        <div class="case-grid">
          <article>
            <img src="assets/nuvitec/project-ti.jpg" alt="Instalación de infraestructura tecnológica" loading="lazy" />
            <div>
              <span>Infraestructura TI</span>
              <h3>Implementación de red empresarial</h3>
              <p>Diagnóstico, ordenamiento de puntos de red, configuración de equipos y pruebas de conectividad para oficinas administrativas.</p>
              <ul>
                <li>Levantamiento técnico</li>
                <li>Cableado y certificación</li>
                <li>Entrega documentada</li>
              </ul>
            </div>
          </article>

          <article>
            <img src="assets/nuvitec/project-obras.jpg" alt="Obra civil y pavimentación supervisada" loading="lazy" />
            <div>
              <span>Obras y pavimentación</span>
              <h3>Acondicionamiento de zona operativa</h3>
              <p>Apoyo en ejecución de trabajos civiles con control de seguridad, coordinación de cuadrilla y supervisión de avance.</p>
              <ul>
                <li>Plan de trabajo</li>
                <li>Control de calidad</li>
                <li>Reporte de avance</li>
              </ul>
            </div>
          </article>

          <article>
            <img src="assets/nuvitec/project-videovigilancia.jpg" alt="Instalación de cámara de seguridad en entorno empresarial" loading="lazy" />
            <div>
              <span>Seguridad electrónica</span>
              <h3>Instalación de videovigilancia</h3>
              <p>Diseño de cobertura, instalación de cámaras, configuración remota y capacitación básica para personal encargado.</p>
              <ul>
                <li>Cobertura por zonas</li>
                <li>Acceso remoto</li>
                <li>Soporte posterior</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section class="project-sectors modern-section">
        <div class="section-heading">
          <p class="section-kicker">Sectores</p>
          <h2>Experiencia adaptable a distintos entornos</h2>
        </div>
        <div class="sector-grid">
          <article><strong>Empresas comerciales</strong><span>Soporte, redes, cámaras y mantenimiento preventivo.</span></article>
          <article><strong>Constructoras</strong><span>Apoyo operativo, pavimentación, logística y supervisión técnica.</span></article>
          <article><strong>Almacenes e industria</strong><span>Distribución eléctrica, seguridad y control de infraestructura.</span></article>
          <article><strong>Oficinas corporativas</strong><span>Soluciones TI, conectividad y atención técnica recurrente.</span></article>
        </div>
      </section>

      <section class="project-process modern-section">
        <div class="section-heading">
          <p class="section-kicker">Método de trabajo</p>
          <h2>Cómo ejecutamos un proyecto</h2>
        </div>
        <div class="project-timeline">
          <article><span>01</span><strong>Relevamiento</strong><p>Visitamos o analizamos la necesidad, alcance y condiciones del servicio.</p></article>
          <article><span>02</span><strong>Propuesta</strong><p>Definimos solución, tiempos, recursos y presupuesto referencial.</p></article>
          <article><span>03</span><strong>Ejecución</strong><p>Coordinamos personal, materiales, seguridad y control de avance.</p></article>
          <article><span>04</span><strong>Entrega</strong><p>Validamos funcionamiento, dejamos recomendaciones y soporte posterior.</p></article>
        </div>
      </section>

      <section class="strategic contact-cta modern-section">
        <div>
          <p class="section-kicker">Socio estratégico</p>
          <h2>Nuvitec acompaña proyectos desde la evaluación hasta la entrega</h2>
          <p>Calidad, garantía y comunicación clara durante todo el proceso.</p>
        </div>
        <a class="primary-btn" routerLink="/contacto">Cotizar un proyecto</a>
      </section>
    </main>
  `
})
export class ProjectsPage {}
