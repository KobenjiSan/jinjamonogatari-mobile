const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

async function getJson<T>(path: string): Promise<T> {
  if (!API_BASE) throw new Error("EXPO_PUBLIC_API_BASE is not set");

  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed (${res.status}): ${text}`);
  }

  return (await res.json()) as T;
}

/* =========================
 * API DTOs (match C#)
 * ========================= */

export type CitationApi = {
  citeId: number;
  title?: string | null;
  author?: string | null;
  url?: string | null;
  year?: number | null;
};

export type ImageCitedApi = {
  imageUrl?: string | null;
  citation?: CitationApi | null;
};

// Matches FolkloreReadDto
export type FolkloreReadApi = {
  folkloreId: number;
  title: string;
  information: string; // C# dto uses "Information"
  image?: ImageCitedApi | null;
  citations: CitationApi[];
};

/* =========================
 * Request
 * ========================= */

// GET /api/shrines/{slug}/folklore
export async function fetchShrineFolkloreBySlug(
  slug: string,
): Promise<FolkloreReadApi[]> {
  return getJson<FolkloreReadApi[]>(
    `/api/shrines/${encodeURIComponent(slug)}/folklore`,
  );
}