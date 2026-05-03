export class AuthConstants
{
  public static LoggedInUserStorageItemName = "LoggedInUser";
  public static AuthCheckStorageItemName = "IsLoggedIn";
  public static SettingStorageItemName = "Setting";
  public static UnauthorizedEventName = "ApiUnauthorized";
  public static FormatFunc = (resource: string, action: string) => {
    return `${resource}.${action}`;
  };

  public static InitFormatFunc(formatFunc: (resource: string, action: string) => string)
  {
    AuthConstants.FormatFunc = formatFunc;
  }
}