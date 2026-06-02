import { router } from "@/router";

export class AppNavigator
{
  static navigate(path: string, replace = false)
  {
    router.navigate(path, { replace });
  }
}
