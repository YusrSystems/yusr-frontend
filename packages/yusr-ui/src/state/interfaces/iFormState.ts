export interface IFormState<T>
{
  formData: Partial<T>;
  errors: Record<string, string>;
  isDirty: boolean;
}
