import { restyleIdeas } from '../data/ideas';
import type { RestyleIdea } from '../types/restyle';

const BASE_ID = '';
const TABLE_NAME = 'Restyle Ideas';
const TOKEN = '';

interface AirtableAttachment {
  url: string;
}

interface AirtableRecord {
  fields: Partial<RestyleIdea> & { after_image_reference?: AirtableAttachment[] };
}

const mapRecord = (record: AirtableRecord): RestyleIdea => {
  const attachments = record.fields.after_image_reference ?? [];
  const gallery = attachments.map((a) => a.url).filter(Boolean);

  return {
    idea_id: Number(record.fields.idea_id ?? 0),
    garment_type: (record.fields.garment_type ?? 'Other') as RestyleIdea['garment_type'],
    dominant_color: record.fields.dominant_color ?? '',
    fabric_type: record.fields.fabric_type ?? [],
    original_style_tags: record.fields.original_style_tags ?? [],
    restyle_output: record.fields.restyle_output ?? '',
    restyle_description: record.fields.restyle_description ?? '',
    difficulty_level: (record.fields.difficulty_level ?? 'Medium') as RestyleIdea['difficulty_level'],
    source_link: record.fields.source_link ?? '',
    after_image_reference: gallery[0] ?? '',
    image_gallery: gallery
  };
};

/**
 * Fetches the curated ideas from Airtable's REST API. Until a Personal Access
 * Token and Base ID are supplied, it falls back to the bundled sample rows so
 * the whole flow stays usable.
 */
export async function fetchRestyleIdeas(): Promise<RestyleIdea[]> {
  if (!BASE_ID || !TOKEN) return restyleIdeas;

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}?pageSize=100`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!response.ok) throw new Error('Could not load restyle ideas');

  const json = (await response.json()) as { records: AirtableRecord[] };
  return json.records.map(mapRecord);
}