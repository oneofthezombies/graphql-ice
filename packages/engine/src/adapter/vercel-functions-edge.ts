import { Engine } from "../engine";

export async function createEngine(): Promise<Engine> {
  console.log("Vercel Functions Edge engine");
  return await Engine.create();
}
