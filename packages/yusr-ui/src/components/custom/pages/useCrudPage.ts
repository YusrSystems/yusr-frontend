import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { BaseEntity } from "../../../../../yusr-core/src/entities";
import type { CrudActions } from "./crudPage";

export default function useCrudPage<T extends BaseEntity>(
  { actions, routeIdParam, basePath, onRouteOpen }: {
    actions: CrudActions<T>;
    routeIdParam?: string;
    basePath?: string;
    onRouteOpen?: (id: number) => void;
  }
)
{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const routeId = routeIdParam ? params[routeIdParam] : undefined;

  useEffect(() =>
  {
    if (basePath && routeId)
    {
      onRouteOpen?.(Number(routeId));
    }
  }, [routeId]);

  const handleOpenChangeDialog = (entity: T) =>
  {
    if (basePath)
    {
      navigate(`${basePath}/${(entity as any).id}`);
    }
    dispatch(actions.openChangeDialog(entity));
  };

  const handleSetIsChangeDialogOpen = (open: boolean) =>
  {
    if (!open && basePath)
    {
      navigate(basePath);
    }
    dispatch(actions.setIsChangeDialogOpen(open));
  };

  return { handleOpenChangeDialog, handleSetIsChangeDialogOpen };
}
