import { Routes } from '@angular/router';

import { AboutPage } from './pages/about.page';
import { AdminPage } from './pages/admin.page';
import { ContactPage } from './pages/contact.page';
import { HomePage } from './pages/home.page';
import { ProjectsPage } from './pages/projects.page';
import { RegisterPage } from './pages/register.page';
import { PortalPage } from './pages/portal.page';
import { ServicesPage } from './pages/services.page';
import { SolutionsPage } from './pages/solutions.page';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'Nuvitec.pe' },
  { path: 'nosotros', component: AboutPage, title: 'Nosotros | Nuvitec.pe' },
  { path: 'servicios', component: ServicesPage, title: 'Servicios | Nuvitec.pe' },
  { path: 'soluciones-ti', component: SolutionsPage, title: 'Soluciones TI | Nuvitec.pe' },
  { path: 'proyectos', component: ProjectsPage, title: 'Proyectos | Nuvitec.pe' },
  { path: 'contacto', component: ContactPage, title: 'Contacto | Nuvitec.pe' },
  { path: 'registro', component: RegisterPage, title: 'Registro de clientes | Nuvitec.pe' },
  { path: 'portal', component: PortalPage, title: 'Portal | Nuvitec.pe' },
  { path: 'admin', component: AdminPage, title: 'Administración | Nuvitec.pe' },
  { path: '**', redirectTo: '' }
];
