import { signal } from "@preact/signals-react";
import type Item from "@/core/data/item.ts";
import type { ItemUnitPricingMethod } from "@/core/data/itemUnitPricingMethod.ts";

// Module-level "what to print" state — only ever written from event handlers
// (onClick), never from a component's render body.
export const printItem = signal<Item | undefined>(undefined);
export const printIupm = signal<ItemUnitPricingMethod | undefined>(undefined);
export const printBarcodesQtn = signal(40);