export function useFormErrors(errors: Record<string, string>) {
  const getError = (field: string) => errors[field];
  const isInvalid = (field: string) => !!errors[field];

  return { getError, isInvalid };
}