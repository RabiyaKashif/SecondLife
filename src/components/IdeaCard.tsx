import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImageOffIcon, ImagesIcon } from 'lucide-react';
import type { RestyleIdea } from '../types/restyle';
import { centerCroppedIdeaIds } from '../data/imageFocus';

interface IdeaCardProps {
  idea: RestyleIdea;
  index?: number;
  reasons?: string[];
}

const difficultyStyles: Record<string, string> = {
  'Easy (tailor can do)': 'border-amber-border bg-amber-fill text-amber-text',
  Medium: 'border-hotpink bg-pinkfill text-pinktext',
  'Needs designer': 'border-ink/30 bg-white text-ink'
};

const MotionLink = motion(Link);

export function IdeaCard({ idea, index = 0, reasons = [] }: IdeaCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(idea.after_image_reference) && !imageFailed;
  const cropPosition = centerCroppedIdeaIds.includes(idea.idea_id) ? 'object-center' : 'object-top';
  const photoCount = idea.image_gallery?.filter(Boolean).length ?? (hasImage ? 1 : 0);

  return (
    <MotionLink
      to={`/idea/${idea.idea_id}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.35), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-lilacDeep bg-white transition-colors hover:border-hotpink">

      <div className="relative overflow-hidden bg-lilac">
        {hasImage ?
          <motion.img
            src={idea.after_image_reference}
            alt={`Reference photo of ${idea.restyle_output.toLowerCase()}`}
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onError={() => setImageFailed(true)}
            className={`h-60 w-full object-cover ${cropPosition}`} /> :

          <div className="flex h-60 w-full flex-col items-center justify-center gap-2 bg-pinkfill">
            <ImageOffIcon className="h-6 w-6 text-hotpink/60" aria-hidden="true" />
            <span className="text-sm font-medium text-pinktext">Photo coming soon</span>
          </div>
        }

        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 font-display text-xs font-semibold text-ink shadow-sm">
          #{String(idea.idea_id).padStart(2, '0')}
        </span>

        {photoCount > 1 &&
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
            <ImagesIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {photoCount}
          </span>
        }
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border-2 px-3 py-1 text-xs font-semibold ${
              difficultyStyles[idea.difficulty_level] ?? difficultyStyles.Medium}`
            }>

            {idea.difficulty_level}
          </span>
          <span className="rounded-full border border-lilacDeep px-3 py-1 text-xs font-medium text-ink/70">
            {idea.garment_type}
          </span>
        </div>

        <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
          {idea.restyle_output}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{idea.restyle_description}</p>

        {reasons.length > 0 &&
          <p className="mt-3 rounded-xl border-2 border-hotpink/30 bg-pinkfill px-3 py-2 text-xs font-medium text-pinktext">
            Matched because it {reasons.slice(0, 2).join(' and ')}
          </p>
        }

        <span className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-bold text-hotpink underline-offset-4 group-hover:underline">
          See full details
        </span>
      </div>
    </MotionLink>);
}