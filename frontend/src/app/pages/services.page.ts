import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { coverages, processSteps, services } from '../nuvitec-data';

@Component({
  selector: 'app-services-page',
  imports: [RouterLink],
  template: `
    <main>
      <section class="page-hero services-hero" style="--page-hero-image: url('assets/nuvitec/project-videovigilancia.jpg')">
        <p class="section-kicker">Servicios</p>
        <h1>Soluciones integrales para tecnología, infraestructura y seguridad</h1>
      </section>

      <section class="services modern-section">
        <div class="section-heading">
          <p class="section-kicker">Lo que hacemos</p>
          <h2>Nuestros <span>servicios</span></h2>
          <p>Elige el servicio que necesitas y solicita una evaluación técnica.</p>
        </div>
        <div class="service-grid">
          @for (service of services; track service.title) {
            <article class="service-card">
              <img [src]="service.image" [alt]="service.title" loading="lazy" />
              <div class="service-card-body">
                <h3>{{ service.title }}</h3>
                <p>{{ service.detail }}</p>
                <a routerLink="/contacto">Solicitar información</a>
              </div>
            </article>
          }
        </div>
      </section>

      <section class="service-detail split-layout modern-section">
        <div>
          <p class="section-kicker">Cobertura</p>
          <h2>Servicios para diferentes rubros empresariales</h2>
          <p>
            Brindamos cobertura para empresas de distintos rubros y etapas de operación,
            siempre con soporte humano, criterio técnico y seguimiento.
          </p>
        </div>

        <div class="detail-lists">
          <article>
            <h3>Servicios</h3>
            <ul>
              <li>Construcción y pavimentaciones</li>
              <li>Distribución eléctrica</li>
              <li>Apoyo logístico y transporte</li>
              <li>Soluciones TI e infraestructura</li>
              <li>Seguridad y cámaras</li>
            </ul>
          </article>
          <article>
            <h3>Coberturas</h3>
            <ol>
              @for (coverage of coverages; track coverage) {
                <li>{{ coverage }}</li>
              }
            </ol>
          </article>
        </div>
      </section>

      <section class="process-section modern-section">
        <div class="section-heading">
          <p class="section-kicker">Proceso</p>
          <h2>Así trabajamos</h2>
        </div>
        <div class="process-grid">
          @for (step of processSteps; track step[0]) {
            <article class="process-card">
              <strong>{{ step[0] }}</strong>
              <h3>{{ step[1] }}</h3>
              <p>{{ step[2] }}</p>
            </article>
          }
        </div>
      </section>
    </main>
  `
})
export class ServicesPage {
  protected readonly services = services;
  protected readonly coverages = coverages;
  protected readonly processSteps = processSteps;
}
