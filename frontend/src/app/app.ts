import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { AuthService } from './auth.service';

interface ChatResponse {
  answer: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None
})
export class App implements AfterViewChecked, AfterViewInit, OnDestroy {
  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLElement>;

  private readonly apiBase = 'http://127.0.0.1:8080/api';
  private readonly observedElements = new WeakSet<Element>();
  private observer?: IntersectionObserver;
  private revealScanQueued = false;
  private readonly routeSubscription: Subscription;
  private shouldScrollChat = false;

  protected readonly chatOpen = signal(false);
  protected readonly loginOpen = signal(false);
  protected readonly loginLoading = signal(false);
  protected readonly loginError = signal('');
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected chatMessage = '';
  protected loginEmail = 'cliente@nuvitec.pe';
  protected loginPassword = 'Nuvitec2026';

  protected readonly messages = [
    { from: 'bot', text: 'Hola, soy el asistente de Nuvitec. Puedo ayudarte con servicios, horarios o presupuestos.' }
  ];

  constructor(
    protected readonly auth: AuthService,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.scheduleRevealScan());
  }

  ngAfterViewInit(): void {
    this.scheduleRevealScan();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollChat) {
      this.scrollChatToBottom();
      this.shouldScrollChat = false;
    }

    this.scheduleRevealScan();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 18);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected toggleChat(): void {
    this.chatOpen.update((open) => !open);
    this.requestChatScroll();
  }

  protected openLogin(): void {
    if (this.auth.currentUser()) {
      this.router.navigateByUrl(this.auth.isAdmin() ? '/admin' : '/portal');
      return;
    }

    this.loginOpen.set(true);
  }

  protected closeLogin(): void {
    this.loginOpen.set(false);
  }

  protected login(): void {
    this.loginLoading.set(true);
    this.loginError.set('');

    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: (response) => {
        this.auth.startSession(response);
        this.loginLoading.set(false);
        this.loginOpen.set(false);
        this.router.navigateByUrl(response.role === 'ADMIN' ? '/admin' : '/portal');
      },
      error: () => {
        this.loginLoading.set(false);
        this.loginError.set('Credenciales inválidas o backend no disponible.');
      }
    });
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  protected sendChat(): void {
    const question = this.chatMessage.trim();
    if (!question) {
      return;
    }

    this.messages.push({ from: 'user', text: question });
    this.chatMessage = '';
    this.requestChatScroll();

    this.http.post<ChatResponse>(`${this.apiBase}/chat`, { message: question }).subscribe({
      next: (response) => {
        this.messages.push({ from: 'bot', text: response.answer });
        this.requestChatScroll();
      },
      error: () => {
        this.messages.push({ from: 'bot', text: this.answer(question) });
        this.requestChatScroll();
      }
    });
  }

  private requestChatScroll(): void {
    this.shouldScrollChat = true;
  }

  private scrollChatToBottom(): void {
    const element = this.chatBody?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  private scheduleRevealScan(): void {
    if (this.revealScanQueued) {
      return;
    }

    this.revealScanQueued = true;
    window.setTimeout(() => {
      this.revealScanQueued = false;
      this.scanRevealElements();
    });
  }

  private scanRevealElements(): void {
    this.ensureRevealObserver();

    const elements = document.querySelectorAll(
      [
        'main > section',
        '.service-card',
        '.glass-card',
        '.process-card',
        '.testimonial-grid article',
        '.contact-cards article',
        '.detail-lists article',
        '.ti-grid article',
        '.benefit-timeline article',
        '.case-grid article',
        '.sector-grid article',
        '.project-timeline article',
        '.request-row',
        '.data-table-wrap',
        '.map-frame'
      ].join(',')
    );

    elements.forEach((element, index) => {
      if (this.observedElements.has(element)) {
        return;
      }

      this.observedElements.add(element);
      element.classList.add('scroll-reveal');
      (element as HTMLElement).style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
      this.observer?.observe(element);
    });
  }

  private ensureRevealObserver(): void {
    if (this.observer) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
  }

  private answer(question: string): string {
    const normalized = question.toLowerCase();

    if (normalized.includes('horario')) {
      return 'Atendemos de lunes a sabado de 08:00 a 18:00.';
    }

    if (normalized.includes('telefono') || normalized.includes('teléfono') || normalized.includes('whatsapp')) {
      return 'Puedes escribirnos por WhatsApp al 970 982 915 o al 994 152 707.';
    }

    if (normalized.includes('presupuesto') || normalized.includes('cotizacion') || normalized.includes('cotización')) {
      return 'Para preparar un presupuesto necesitamos tus datos, ubicación y una breve descripción del servicio.';
    }

    if (normalized.includes('servicio')) {
      return 'Brindamos soporte técnico, construcción, pavimentaciones, distribución eléctrica, logística, TI y seguridad.';
    }

    return 'Gracias por escribirnos. Un asesor puede revisar tu consulta y responderte a la brevedad.';
  }
}
