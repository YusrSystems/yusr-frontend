export const InvoiceStatus = {
    Valid: 1,
    Deleted: 2
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];