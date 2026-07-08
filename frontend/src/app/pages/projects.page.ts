import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects-page',
  imports: [RouterLink],
  template: `
    <main>
      <section class="page-hero projects-hero">
        <p class="section-kicker">Proyectos</p>
        <h1>Equipo de trabajo garantizado</h1>
      </section>

      <section class="team-section split-layout modern-section">
        <div class="team-photo">
          <img src="/assets/nuvitec/trabajo-equipo.jpg" alt="Equipo de trabajo Nuvitec" loading="lazy" />
        </div>
        <div>
          <p class="section-kicker">Proyectos integrales</p>
          <h2>Profesionales comprometidos con cada proyecto</h2>
          <h3>Contamos con especialistas para diferentes áreas de desarrollo.</h3>
          <p>
            Parte de nuestra filosofía es el cumplimiento de metas, adecuándonos a los
            requerimientos de nuestros clientes y brindando soluciones a medida.
          </p>
          <a class="primary-btn" routerLink="/contacto">Contáctenos</a>
        </div>
      </section>

      <section class="strategic contact-cta modern-section">
        <div>
          <p class="section-kicker">Socio estratégico</p>
          <h2>Nuvitec, una empresa amiga</h2>
          <p>Calidad y garantía en nuestros trabajos.</p>
        </div>
      </section>
    </main>
  `
})
export class ProjectsPage {}
