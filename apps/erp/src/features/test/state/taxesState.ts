import type { Tax } from "@/core/data/tax";

export class TaxesInitialState
{}
export class TaxesLoading extends TaxesInitialState
{}
export class TaxesLoaded extends TaxesInitialState
{
  taxes: Tax[];
  count: number;
  currentPage: number;

  constructor(taxes: Tax[], count: number)
  {
    super();
    this.taxes = taxes;
    this.count = count;
    this.currentPage = 1;
  }
}
export class TaxesError extends TaxesInitialState
{
  message: string;
  constructor(message: string)
  {
    super();
    this.message = message;
  }
}

export class TaxesEmpty extends TaxesInitialState
{}
