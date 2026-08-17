import { restyleIdeas } from '../data/ideas';
import type { RestyleIdea } from '../types/restyle';

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
 * Fetches the curated ideas from the backend API (which securely calls Airtable).
 * This keeps API tokens on the backend only - never exposed to the frontend.
 * Falls back to bundled sample data if the backend is unavailable.
 */
export async function fetchRestyleIdeas(): Promise<RestyleIdea[]> {
  try {
    const response = await fetch('/api/ideas');
    if (!response.ok) throw new Error('Backend API failed');

    const data = await response.json();
    
    // Map Airtable records to our RestyleIdea type
    if (data.records && Array.isArray(data.records)) {
      return data.records.map(mapRecord);
    }
    
    return restyleIdeas;
  } catch (error) {
    console.warn('Could not fetch from backend, using bundled ideas:', error);
    return restyleIdeas;
  }
}