import configPromise from "@payload-config";
import { getPayload, type Payload } from "payload";

const globalKey = "__gallePayload";

type GlobalPayload = typeof globalThis & {
  [globalKey]?: Promise<Payload>;
};

export async function getPayloadClient(): Promise<Payload> {
  const g = globalThis as GlobalPayload;
  if (!g[globalKey]) {
    g[globalKey] = getPayload({ config: configPromise });
  }
  return g[globalKey];
}
