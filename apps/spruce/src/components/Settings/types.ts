export type SettingsRoutes = string;

export type FormToGqlFunction<T extends SettingsRoutes> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: Record<T, any>,
  id?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;
