import { Injectable, signal, computed, effect } from '@angular/core';
import { Notification } from '../../core/models/notification.model';
import { Subject, interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly storageKey = 'app-notifications';

  // Requisito: Signal privada `#notifications`
  readonly #notifications = signal<Notification[]>([]);

  // Requisito: Computeds
  readonly unreadCount = computed(() => 
    this.#notifications().filter(n => !n.read).length
  );
  
  readonly unreadNotifications = computed(() =>
    this.#notifications().filter(n => !n.read)
  );

  // Getter público general
  readonly notifications = computed(() => this.#notifications());

  // Simulación WebSocket
  // Técnicamente, la consigna pide "Simulación de WebSocket mediante Subject e interval() cada 10 seg"
  // Podemos usar el Subject para aceptar notificaciones entrantes desde un stream.
  private wsSimulationSubject = new Subject<Notification>();

  constructor() {
    this.loadInitialState();
    this.setupPersistence();
    this.setupWebSocketSimulation();
  }

  // Requisito: Método markAsRead(id)
  markAsRead(id: string): void {
    // Requisito: Actualización inmutable mediante update()
    this.#notifications.update(current =>
      current.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }

  // Requisito: Carga inicial y reconstrucción correcta de Date
  private loadInitialState(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as any[];
        const notificationsWithDates: Notification[] = parsed.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt) // Reconstructor string -> Date
        }));
        this.#notifications.set(notificationsWithDates);
      } catch (error) {
        console.error('Error parsing stored notifications', error);
      }
    }
  }

  // Requisito: Persistencia con effect()
  private setupPersistence(): void {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.#notifications()));
    });
  }

  // Requisito: interval() cada 10 segundos + Subject
  private setupWebSocketSimulation(): void {
    // Nos subscribimos al subject que actuará como websocket real
    this.wsSimulationSubject
      .pipe(takeUntilDestroyed())
      .subscribe((newNotification) => {
        this.#notifications.update(current => [newNotification, ...current]);
      });

    // Alimentamos el Subject con interval cada 10 segundos
    interval(10000)
      .pipe(takeUntilDestroyed())
      .subscribe((count) => {
        const fakeNotification: Notification = {
          id: crypto.randomUUID(),
          title: `Alerta #${count + 1}`,
          message: `Evento detectado en el sistema a las ${new Date().toLocaleTimeString()}`,
          read: false,
          createdAt: new Date()
        };
        this.wsSimulationSubject.next(fakeNotification);
      });
  }
}
