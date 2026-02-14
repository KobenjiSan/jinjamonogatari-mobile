const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

/**
 * Matches what /api/etiquette endpoint currently returns.
 * camelCase because controller projection uses C# property names.
 */
export type EtiquetteTopicApi = {
  topicId: number;
  slug: string;
  titleLong: string;
  titleShort: string;
  summary?: string | null;
  iconKey?: string | null;
  iconSet?: string | null;
  imageId?: number | null;
  showInGlance?: boolean | null;
  showAsHighlight?: boolean | null;
  glanceOrder?: number | null;
  guideOrder?: number | null;
  status?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;

  steps: Array<{
    stepId: number;
    stepOrder: number;
    text: string;
    imageId?: number | null;
  }>;

  citations: Array<{
    citeId: number;
    title: string;
    author?: string | null;
    url?: string | null;
    year?: number | null;
    notes?: string | null;
  }>;
};

export async function fetchEtiquetteTopics(): Promise<EtiquetteTopicApi[]> {
  console.log("API_BASE =", API_BASE);
  return getJson<EtiquetteTopicApi[]>("/api/etiquette");
}
