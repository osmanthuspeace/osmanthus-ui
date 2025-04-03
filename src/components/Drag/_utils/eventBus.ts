type Callback = () => void | Promise<void>;

class EventBus {
  private static instance: EventBus;
  private events: Record<string, Callback[]> = {};

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }
  private checkEvent(event: string) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
  }

  public subscribe(event: string, callback: Callback): void {
    this.checkEvent(event);
    this.events[event].push(callback);
  }
  public unsubscribe(event: string, callback?: Callback): void {
    if (!this.events[event]) return;
    if (!callback) {
      this.events[event] = [];
      return;
    }
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }
  //
  public async publish(event: string): Promise<void> {
    if (!this.events[event]) return;
    await Promise.all(this.events[event].map((cb) => cb()));
    // this.events[event].forEach((cb) => cb());
  }
}
export const eventBus = EventBus.getInstance();
