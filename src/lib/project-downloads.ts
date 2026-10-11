export type DownloadProvider = 'modrinth' | 'curseforge';
export const DOWNLOAD_REFRESH_INTERVAL = 5 * 60_000;

export interface ProjectLink {
  platform: 'repository' | 'Modrinth' | 'CurseForge' | 'Crowdin' | 'Weblate';
  url: string;
  downloads?: { provider: DownloadProvider; id: string };
}

export function downloadEndpoint(provider: DownloadProvider, id: string) {
  if (provider === 'modrinth' && /^[a-zA-Z0-9]{8}$/.test(id)) {
    return `https://api.modrinth.com/v2/project/${id}`;
  }
  if (provider === 'curseforge' && /^\d+$/.test(id)) {
    // CFWidget provides public, cached CurseForge statistics without credentials.
    return `https://api.cfwidget.com/${id}`;
  }
  throw new Error('Invalid download source');
}

export function downloadTotal(
  provider: DownloadProvider,
  id: string,
  payload: unknown,
): number {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Missing project statistics');
  }
  const project = payload as { id?: unknown; downloads?: unknown };
  if (String(project.id) !== id) {
    throw new Error('Unexpected project statistics');
  }
  const count =
    provider === 'modrinth'
      ? project.downloads
      : project.downloads && typeof project.downloads === 'object'
        ? (project.downloads as { total?: unknown }).total
        : undefined;
  if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0) {
    throw new Error('Invalid download total');
  }
  return count;
}
