import type { AddressApi, ShrineMetaApi, TagApi } from "./shrineMeta.client";

export type AddressModel = {
  address_raw: string | null;
  prefecture: string | null;
  city: string | null;
  ward: string | null;
  locality: string | null;
  postal_code: string | null;
  country: string | null;
};

export type TagModel = {
  tag_id: number;
  title_en: string;
  title_jp: string | null;
};

export type ShrineMetaModel = {
  shrine_id: number;
  slug: string;

  name_en: string | null;
  name_jp: string | null;
  shrine_desc: string | null;

  address: AddressModel | null;

  phone_number: string | null;
  email: string | null;
  website: string | null;

  imageUrl: string | null;

  distance_meters: number | null;

  tags: TagModel[];
};

function toAddressModel(a: AddressApi | null | undefined): AddressModel | null {
  if (!a) return null;

  return {
    address_raw: a.addressRaw ?? null,
    prefecture: a.prefecture ?? null,
    city: a.city ?? null,
    ward: a.ward ?? null,
    locality: a.locality ?? null,
    postal_code: a.postalCode ?? null,
    country: a.country ?? null,
  };
}

function toTagModel(t: TagApi): TagModel {
  return {
    tag_id: t.tagId,
    title_en: t.titleEn,
    title_jp: t.titleJp ?? null,
  };
}

export function toShrineMetaModel(api: ShrineMetaApi): ShrineMetaModel {
  return {
    shrine_id: api.shrineId,
    slug: api.slug,

    name_en: api.nameEn ?? null,
    name_jp: api.nameJp ?? null,
    shrine_desc: api.shrineDesc ?? null,

    address: toAddressModel(api.address),

    phone_number: api.phoneNumber ?? null,
    email: api.email ?? null,
    website: api.website ?? null,

    imageUrl: api.imageUrl ?? null,

    distance_meters: api.distanceMeters ?? null,

    tags: (api.tags ?? []).map(toTagModel),
  };
}