export const InvoiceRelationType = {
    Payment: 1,
    Cost: 2
} as const;

export type InvoiceRelationType = (typeof InvoiceRelationType)[keyof typeof InvoiceRelationType];