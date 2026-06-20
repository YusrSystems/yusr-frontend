export const EInvoiceStatus = {
    NotSent: 0,
    SentWithWarnings: 1,
    SentCorrectly: 2
} as const;

export type EInvoiceStatus = (typeof EInvoiceStatus)[keyof typeof EInvoiceStatus];