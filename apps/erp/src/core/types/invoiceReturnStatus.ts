export const InvoiceReturnStatus = {
    NotReturned: 0,
    PartialReturned: 1,
    FullyReturned: 2
} as const;

export type InvoiceReturnStatus = (typeof InvoiceReturnStatus)[keyof typeof InvoiceReturnStatus];
