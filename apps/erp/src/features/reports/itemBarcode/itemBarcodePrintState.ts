import { signal } from "@preact/signals-react";
import type Item from "@/core/data/item.ts";
import type { ItemUoM } from "@/core/data/itemUoM.ts";
import type { ItemPrice } from "@/core/data/itemPrice.ts";

// Module-level "what to print" state — only ever written from event handlers
// (onClick), never from a component's render body.
export const printItem = signal<Item | undefined>(undefined);
export const printItemUoM = signal<ItemUoM | undefined>(undefined);
export const printItemPrice = signal<ItemPrice | undefined>(undefined);
export const printBarcodesQtn = signal(40);