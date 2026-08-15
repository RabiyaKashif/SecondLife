import { restyleIdeas } from '../data/ideas';
import type { RestyleIdea } from '../types/restyle';

interface AirtableAttachment {
  url: string;
}

interface AirtableRecord {
  fields: Partial<RestyleIdea> & { after_image_reference?: AirtableAttachment[] };
}

const mapRecord = (record: AirtableRecord): RestyleIdea => ({
  idea_id: Number(record.fields.idea_id ?? 0),
  garment_type: (record.fields.garment_type ?? 'Other') as RestyleIdea['garment_type'],
  dominant_color: record.fields.dominant_color ?? '',
  fabric_type: record.fields.fabric_type ?? [],
  original_style_tags: record.fields.original_style_tags ?? [],
  restyle_output: record.fields.restyle_output ?? '',
  restyle_description: record.fields.restyle_description ?? '',
  difficulty_level: (record.fields.difficulty_level ?? 'Medium') as RestyleIdea['difficulty_level'],
  source_link: record.fields.source_link ?? '',
  after_image_reference: record.fields.after_image_reference?.[0]?.url ?? ''
});

/**
 * Fetches the curated ideas through our own /api/ideas backend endpoint —
 * NEVER calls Airtable directly from the browser, since that would expose
 * the Airtable token to anyone viewing the site's network requests.
 *
 * Falls back to the bundled sample rows if the request fails for any reason
 * (no internet, backend not deployed yet, etc.) so the app stays usable.
 */
export async function fetchRestyleIdeas(): Promise<RestyleIdea[]> {
  try {
    const response = await fetch('/api/ideas');
    if (!response.ok) throw new Error('Could not load restyle ideas');

    const json = (await response.json()) as { records: AirtableRecord[] };
    const mapped = json.records.map(mapRecord);

    // If Airtable somehow returned zero rows, fall back rather than showing an empty app
    return mapped.length > 0 ? mapped : restyleIdeas;
  } catch (error) {
    console.warn('Falling back to bundled sample ideas:', error);
    return restyleIdeas;
  }
}
