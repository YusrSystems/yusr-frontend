class LoginState
{}
class LoginInitState extends LoginState
{
}
class LoginLoadingState extends LoginState
{}
class LoginSuccessState extends LoginState
{}
class LoginErrorState extends LoginState
{
  public errorMessage: string;
  constructor(errorMessage: string)
  {
    super();
    this.errorMessage = errorMessage;
  }
}

export { LoginErrorState, LoginInitState, LoginLoadingState, LoginState, LoginSuccessState };
