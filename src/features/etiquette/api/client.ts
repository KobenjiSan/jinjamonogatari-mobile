const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

async function getJson<T>(path: string): Promise<T>{
  if(!API_BASE){
    throw new Error("EXPO_PUBLIC_API_BASE is not set");
  }

  const res = await fetch(`${API_BASE}${path}`);

  if(!res.ok){
    const text = await res.text();
    throw new Error(`GET ${path} failed (${res.status}): ${text}`);
  }

  return (await res.json()) as T;
}

// API DTOs
export type CitationApi = {
  citeId: number;
  title?: string | null;
  author?: string | null;
  url?: string | null;
  year?: number | null;
}

export type ImageCitedApi = {
  imageUrl?: string | null;
  citation?: CitationApi | null;
};

export type EtiquetteStepApi = {
  stepId: number;
  stepOrder: number;              // assume not null
  text?: string | null;
  image?: ImageCitedApi | null;
};

export type EtiquetteTopicApi = {
  topicId: number;
  slug: string;
  titleLong?: string | null;
  titleShort?: string | null;
  summary?: string | null;
  iconKey?: string | null;
  iconSet?: string | null;

  showInGlance: boolean;          // assume not null
  showAsHighlight: boolean;       // assume not null
  glanceOrder: number;            // assume not null
  guideOrder: number;             // assume not null

  steps: EtiquetteStepApi[];
  citations: CitationApi[];
};

export async function fetchEtiquetteTopics(): Promise<EtiquetteTopicApi[]> {
  return getJson<EtiquetteTopicApi[]>("/api/etiquette");
}

export async function fetchEtiquetteTopicById(
  id: number,
): Promise<EtiquetteTopicApi> {
  return getJson<EtiquetteTopicApi>(`/api/etiquette/${id}`);
}

export async function fetchEtiquetteTopicBySlug(
  slug: string,
): Promise<EtiquetteTopicApi> {
  return getJson<EtiquetteTopicApi>(`/api/etiquette/slug/${encodeURIComponent(slug)}`);
}