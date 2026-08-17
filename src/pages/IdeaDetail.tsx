import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowUpRightIcon, Loader2Icon } from 'lucide-react';
import { fetchRestyleIdeas } from '../utils/airtable';
import type { RestyleIdea } from '../types/restyle';

const difficultyStyles: Record<string, string> = {
  'Easy (tailor can do)': 'border-amber-border bg-amber-fill text-amber-text',
  Medium: 'border-hotpink bg-pinkfill text-pinktext',
  'Needs designer': 'border-ink/30 bg-white text-ink'
};

export function IdeaDetail() {
  const { ideaId } = useParams<{ ideaId: string }>();
  const [idea, setIdea] = useState<RestyleIdea | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'notFound' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    fetchRestyleIdeas()
      .then((rows) => {
        if (cancelled) return;
        const match = rows.find((row) => String(row.idea_id) === ideaId);
        if (!match) {
          setStatus('notFound');
          return;
        }
        setIdea(match);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [ideaId]);

  if (status === 'loading') {
    return (
      <main className="flex w-full flex-1 items-center justify-center bg-lilac py-20">
        <p className="flex items-center gap-2 text-sm font-medium text-ink/70">
          <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading this idea…
        </p>
      </main>);
  }

  if (status === 'error' || status === 'notFound' || !idea) {
    return (
      <main className="flex w-full flex-1 items-center justify-center bg-lilac px-5 py-20">
        <div className="max-w-md text-center">
          <p className="font-display text-2xl font-semibold text-ink">
            {status === 'notFound' ? 'This idea could not be found' : 'Something went wrong'}
          </p>
          <p className="mt-2 text-sm text-ink/70">
            {status === 'notFound'
              ? 'It may have been removed, or the link is outdated.'
              : 'We could not reach the idea library just now. Please refresh and try again.'}
          </p>
          <Link
            to="/browse"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-hotpink px-5 py-2.5 text-sm font-bold text-pinkfill transition-colors hover:bg-hotpinkDark">

            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Back to browse
          </Link>
        </div>
      </main>);
  }

  const gallery = idea.image_gallery.length ? idea.image_gallery : [idea.after_image_reference];
  const hasImages = gallery.some(Boolean);

  return (
    <main className="w-full bg-lilac">
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-12">
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-pinktext">

          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to browse
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

          {/* Image gallery — full, uncropped photos, stacked if there are several */}
          <div className="space-y-4">
            {hasImages ?
              gallery
                .filter(Boolean)
                .map((src, index) =>
                  <div
                    key={src + index}
                    className="overflow-hidden rounded-3xl border border-lilacDeep bg-white">

                    <img
                      src={src}
                      alt={`${idea.restyle_output} — reference photo ${index + 1}`}
                      className="w-full object-contain" />
                  </div>
              ) :

              <div className="flex h-80 w-full flex-col items-center justify-center gap-2 rounded-3xl bg-pinkfill">
                <span className="text-sm font-medium text-pinktext">Photo coming soon</span>
              </div>
            }
          </div>

          {/* Details panel */}
          <div className="rounded-3xl border border-lilacDeep bg-white p-6 sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 font-display text-xs font-semibold text-ink shadow-sm">
              #{String(idea.idea_id).padStart(2, '0')}
            </span>

            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">
              {idea.restyle_output}
            </h1>

            <p className="mt-3 text-base leading-relaxed text-ink/70">
              {idea.restyle_description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span
                className={`rounded-full border-2 px-3 py-1 text-xs font-semibold ${
                  difficultyStyles[idea.difficulty_level] ?? difficultyStyles.Medium}`
                }>

                {idea.difficulty_level}
              </span>
              <span className="rounded-full border border-lilacDeep px-3 py-1 text-xs font-medium text-ink/70">
                {idea.garment_type}
              </span>
              <span className="rounded-full border border-lilacDeep px-3 py-1 text-xs font-medium text-ink/70">
                {idea.dominant_color}
              </span>
            </div>

            <dl className="mt-6 space-y-4 border-t border-lilacDeep pt-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">Fabric</dt>
                <dd className="mt-1 text-sm text-ink">
                  {idea.fabric_type.length ? idea.fabric_type.join(', ') : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  Original style details
                </dt>
                <dd className="mt-1 text-sm text-ink">
                  {idea.original_style_tags.length ? idea.original_style_tags.join(', ') : '—'}
                </dd>
              </div>
            </dl>

            {idea.source_link &&
              <a
                href={idea.source_link}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-hotpink underline-offset-4 hover:underline">

                See the original inspiration
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            }

            <Link
              to="/upload"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-hotpink px-6 py-3.5 text-base font-bold text-pinkfill transition-colors hover:bg-hotpinkDark">

              Restyle my own dress like this
            </Link>
          </div>
        </motion.div>
      </div>
    </main>);
}