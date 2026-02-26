/**
 * Shrine UI models (MINIMAL)
 *
 * This file should only contain the types that your UI components
 * still depend on. No fixture table types, no composition mappers.
 *
 * Keep field names aligned with what your screens/components already use.
 */

/* =======
 * Shared
 * ======= */

export type Tag = {
  tag_id: number;
  title_en: string;
  title_jp?: string | null;
};

/* ===========================
 * Shrine Cards (List Screen)
 * =========================== */

export type ShrineCardModel = {
  shrine_id: number;
  slug: string;

  name_en?: string | null;
  name_jp?: string | null;

  lat?: number | null;
  lon?: number | null;

  imageUrl?: string | null;
};

/* ====================================
 * Shrine Preview (Map popup + header)
 * ==================================== */

export type ShrinePreviewModel = ShrineCardModel & {
  shrine_desc?: string | null;
  tags: Tag[];
};

/* ============================================================================
 * Shrine Detail "Meta" (Info tab / header needs this)
 *
 * NOTE: Even though tabs (Kami/History/Folklore/Gallery) are now API-driven,
 * your ShrineScreen/Header/Info tab still rely on these fields.
 * Keep this shape stable so screens don’t churn.
 * ========================================================================== */

export type ShrineDetailModel = ShrinePreviewModel & {
  // Address
  address_raw?: string | null;
  prefecture?: string | null;
  city?: string | null;
  ward?: string | null;
  locality?: string | null;
  postal_code?: string | null;
  country?: string | null;

  distance_meters: number | null;

  // Contact
  phone_number?: string | null;
  email?: string | null;
  website?: string | null;
};