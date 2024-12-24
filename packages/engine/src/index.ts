export interface Engine {
  ping: () => Promise<string>;
}
