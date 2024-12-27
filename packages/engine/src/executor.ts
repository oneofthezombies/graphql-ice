import { ExecutorImpl } from "./generated/core.js";

export class Executor {
  #impl: ExecutorImpl;

  private constructor(impl: ExecutorImpl) {
    this.#impl = impl;
  }

  static async create(options: {}): Promise<Executor> {
    const impl = await ExecutorImpl.create(options);
    return new Executor(impl);
  }
}
