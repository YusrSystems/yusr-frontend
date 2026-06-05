import { ScanBarcode, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn, FilterByTypeRequest, SearchableSelectOld } from "yusr-ui";
import Item, { ItemType, ItemUnitPricingMethod } from "../../core/data/item";
import { clearBarcodeResult, GetItemByBarcode } from "../../core/state/shared/itemBarcodeSlice";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

interface StoreItemSelectorProps
{
  storeId?: number;
  itemTypes?: ItemType[];
  onSelect?: (item: Item, selectedIupm?: ItemUnitPricingMethod) => void;
}

export default function StoreItemSelector({ storeId, itemTypes, onSelect }: StoreItemSelectorProps)
{
  const { t } = useTranslation("erpCommon");
  const dispatch = useAppDispatch();
  const [barcode, setBarcode] = useState("");
  const storeItemsState = useAppSelector((state) => state.storeItems);
  const itemBarcodeState = useAppSelector((state) => state.itemBarcode);

  useEffect(() =>
  {
    if (itemBarcodeState.barcodeResult)
    {
      onSelect?.(itemBarcodeState.barcodeResult.item, itemBarcodeState.barcodeResult.selectedIupm);
      dispatch(clearBarcodeResult());
    }
  }, [itemBarcodeState.barcodeResult]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === "Enter" && barcode && storeId)
    {
      dispatch(GetItemByBarcode({ barcode, storeId }));
      setBarcode("");
    }
  };

  return (
    <div className="flex items-center justify-start gap-6 p-4 rounded-lg border border-border bg-muted/10 shadow-sm">
      <div className="flex items-center gap-2 font-bold text-lg text-foreground">
        <ShoppingCart className="h-5 w-5" />
        <span>{ t("storeItemSelector.addItems") }</span>
      </div>

      <div className="relative w-64">
        <input
          type="text"
          placeholder={ t("storeItemSelector.scanBarcode") }
          value={ barcode }
          onChange={ (e) => setBarcode(e.target.value) }
          onKeyDown={ handleKeyDown }
          disabled={ storeItemsState.isLoading }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
        />
        <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="w-80">
        <SearchableSelectOld<Item>
          items={ storeItemsState.storeItems }
          renderContent={ (item) => (
            <div className="flex items-center gap-3 py-0.5 w-full">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{ item.name }</span>
              </div>

              { item.type === ItemType.Product && (
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={ cn(
                      "text-xs font-medium px-1.5 py-0.5 rounded",
                      item.storeQuantity <= 0
                        ? "bg-destructive/10 text-destructive"
                        : item.storeQuantity <= (item.minQuantity ?? 10)
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-green-500/10 text-green-600"
                    ) }
                  >
                    { item.storeQuantity } { item.sellUnitName }
                  </span>
                </div>
              ) }
            </div>
          ) }
          placeholder={ t("storeItemSelector.selectItem") }
          onSearch={ (searchInput) =>
          {
            if (itemTypes?.length && storeId)
            {
              dispatch(
                fetchStoreItems({
                  pageNumber: 1,
                  rowsPerPage: 10,
                  storeId: storeId,
                  request: new FilterByTypeRequest({
                    searchText: searchInput,
                    types: itemTypes
                  })
                })
              );
            }
          } }
          isLoading={ storeItemsState.isLoading }
          disabled={ storeItemsState.isLoading }
          onValueChange={ (val) =>
          {
            const selected = storeItemsState.storeItems.find((di) => di.id === val?.id);
            if (selected)
            {
              onSelect?.(selected);
            }
          } }
        />
      </div>
    </div>
  );
}
