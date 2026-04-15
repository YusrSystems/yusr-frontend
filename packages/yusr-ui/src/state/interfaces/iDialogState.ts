export interface IDialogState<T>
{
  selectedRow: T | null;
  isChangeDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
}
