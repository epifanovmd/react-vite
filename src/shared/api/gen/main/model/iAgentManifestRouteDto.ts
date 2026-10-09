/**
 * Маршрут воркера в манифесте: `{name}` в пути — один сегмент.
 */
export interface IAgentManifestRouteDto {
  method: string;
  path: string;
  description?: string;
}
