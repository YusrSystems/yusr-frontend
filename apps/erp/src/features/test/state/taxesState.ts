import type { Tax } from "@/core/data/tax";

export class TaxesInitialState
{}
export class TaxesLoading extends TaxesInitialState
{}
export class TaxesLoaded extends TaxesInitialState
{
  taxes: Tax[];

  constructor(taxes: Tax[])
  {
    super();
    this.taxes = taxes;
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
