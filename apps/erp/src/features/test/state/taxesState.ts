export class TaxesInitialState
{}
export class TaxesLoading extends TaxesInitialState
{}
export class TaxesLoaded extends TaxesInitialState
{}
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
