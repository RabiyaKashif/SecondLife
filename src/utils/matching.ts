import type { RestyleIdea, RestyleRequest, ScoredIdea } from '../types/restyle';

const overlap = (a: string[], b: string[]): string[] =>
  a.filter((item) => b.some((other) => other.toLowerCase() === item.toLowerCase()));

const KEYWORD_HINTS: Record<string, string[]> = {
  'co-ord': ['co-ord', 'coord', 'two piece', 'set'],
  jacket: ['jacket', 'coat', 'shrug', 'cape'],
  western: ['western', 'modern', 'contemporary', 'fusion'],
  casual: ['casual', 'everyday', 'daily', 'office'],
  gown: ['gown', 'dress', 'maxi'],
  skirt: ['skirt', 'lehenga skirt', 'flared'],
  minimal: ['minimal', 'simple', 'plain', 'toned down'],
  keep: ['keep the embroidery', 'keep embroidery', 'save the work', 'reuse']
};

/**
 * Scores curated Airtable rows against the user's garment + free-text wish.
 * Higher score = better match. Deterministic so results feel stable.
 */
export function scoreIdeas(ideas: RestyleIdea[], request: RestyleRequest): ScoredIdea[] {
  const wish = request.wish.toLowerCase();

  return ideas
    .map((idea) => {
      let score = 0;
      const reasons: string[] = [];

      if (request.garment_type && idea.garment_type === request.garment_type) {
        score += 40;
        reasons.push(`same garment: ${idea.garment_type.toLowerCase()}`);
      }

      const fabrics = overlap(request.fabric_type, idea.fabric_type);
      if (fabrics.length) {
        score += fabrics.length * 12;
        reasons.push(`works with ${fabrics.join(' & ').toLowerCase()}`);
      }

      if (
        request.dominant_color &&
        idea.dominant_color.toLowerCase() === request.dominant_color.toLowerCase()
      ) {
        score += 15;
        reasons.push(`suits ${idea.dominant_color.toLowerCase()} tones`);
      }

      const tags = overlap(request.original_style_tags, idea.original_style_tags);
      if (tags.length) {
        score += tags.length * 10;
        reasons.push(`keeps your ${tags.join(' & ').toLowerCase()}`);
      }

      const haystack = `${idea.restyle_output} ${idea.restyle_description}`.toLowerCase();
      Object.values(KEYWORD_HINTS).forEach((phrases) => {
        const hit = phrases.some((phrase) => wish.includes(phrase));
        if (hit && phrases.some((phrase) => haystack.includes(phrase.split(' ')[0]))) {
          score += 8;
        }
      });

      if (idea.difficulty_level === 'Easy (tailor can do)' && /easy|cheap|quick|tailor/.test(wish)) {
        score += 10;
      }

      return { idea, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.idea.idea_id - b.idea.idea_id);
}

export function topMatches(ideas: RestyleIdea[], request: RestyleRequest, limit = 4): ScoredIdea[] {
  const scored = scoreIdeas(ideas, request);
  const relevant = scored.filter((entry) => entry.score > 0);
  return (relevant.length >= 3 ? relevant : scored).slice(0, limit);
}

/**
 * Placeholder for the AI text API. Composes a short personalised note from the
 * user's own words and the top matches until a provider is wired in.
 */
export function composeSummary(request: RestyleRequest, matches: ScoredIdea[]): string {
  if (!matches.length) return '';
  const first = matches[0].idea;
  const second = matches[1]?.idea;
  const garment = (request.garment_type || 'outfit').toLowerCase();
  const wish = request.wish.trim().replace(/\.$/, '');

  return [
    wish
      ? `You asked to ${wish.toLowerCase()} — that's very doable with this ${garment}.`
      : `Here's what we'd do with this ${garment}.`,
    `The closest match is ${first.restyle_output.toLowerCase()}: ${first.restyle_description.split('. ')[0]}.`,
    second
      ? `If you want something lighter to start with, ${second.restyle_output.toLowerCase()} reuses the same panels and is usually ${second.difficulty_level === 'Easy (tailor can do)' ? 'a single tailor visit' : 'a slightly bigger job'}.`
      : '',
    'Take the reference photos with you — a tailor reads pictures faster than descriptions.'
  ]
    .filter(Boolean)
    .join(' ');
}
