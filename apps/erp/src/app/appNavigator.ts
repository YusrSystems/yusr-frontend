import { router } from "@/app/router";

export class AppNavigator
{
  static navigate(path: string, replace = false)
  {
    router.navigate(path, { replace });
  }
}
