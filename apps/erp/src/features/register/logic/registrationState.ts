class RegistrationState
{}
class RegistrationStateInitial extends RegistrationState
{
}
class RegistrationStateLoading extends RegistrationState
{}
class RegistrationStateSuccess extends RegistrationState
{}
class RegistrationStateError extends RegistrationState
{}

export {
  RegistrationState,
  RegistrationStateError,
  RegistrationStateInitial,
  RegistrationStateLoading,
  RegistrationStateSuccess
};
