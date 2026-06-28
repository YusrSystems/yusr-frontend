# Cost Adjustments Tests

## Permissions

- [ ] Verify the page is inaccessible and shows an unauthorized message without `Get` permission.
- [ ] Verify the "Add New Cost Adjustment" button is hidden without `Add` permission.
- [ ] Verify the "Edit" action in the table row dropdown is hidden without `Update` permission.

## Listing & Filtering

- [ ] Verify the table loads and displays existing cost adjustments correctly.
- [ ] Verify pagination works correctly when there are multiple pages of records.
- [ ] Verify the search input filters the table correctly (e.g., by item name or notes).
- [ ] Verify the "Total Adjustments" card displays the correct total count of records.

## Create Cost Adjustment

- [ ] Open the "Add New Cost Adjustment" dialog.
- [ ] Verify the `Date` field defaults to today's date.
- [ ] Select an item from the `Item` searchable select dropdown.
- [ ] **Crucial Logic:** Verify that selecting an item automatically populates the `Old Cost` and `Quantity` fields
  based on the selected item's current data.
- [ ] Verify the `Old Cost` and `Quantity` fields are disabled (read-only).
- [ ] Enter a valid `New Cost` (e.g., greater than 0).
- [ ] Enter optional `Notes`.
- [ ] Save and verify the dialog closes, the new record appears in the table, and the total count increases.

## Update Cost Adjustment

- [ ] Open an existing cost adjustment for editing.
- [ ] Verify the `Item` selector is disabled (cannot change the item after the adjustment is created).
- [ ] Verify the `Old Cost` and `Quantity` fields are disabled.
- [ ] Change the `New Cost` and/or `Notes`.
- [ ] Save and verify the table reflects the updated data.

## Validations

- [ ] Try saving a new adjustment without selecting an `Item` -> Should show "Item is required" error.
- [ ] Try saving with an empty `Date` -> Should show "Date is required" error.
- [ ] Try saving with an empty `New Cost` -> Should show "New cost is required" error.
- [ ] Try saving with a negative `New Cost` (e.g., -5) -> Should show "New cost must be 0 or greater" error.