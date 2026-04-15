import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useFormInit<T>(
  setInitialData: ActionCreatorWithPayload<Partial<T>>,
  initialValues: Partial<T>
) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setInitialData(initialValues));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — initialize once on mount
}