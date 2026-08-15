import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2Icon } from 'lucide-react';
import { Chip } from '../components/Chip';
import { IdeaCard } from '../components/IdeaCard';
import { fetchRestyleIdeas } from '../utils/airtable';
import { garmentTypes } from '../data/options';
import type { RestyleIdea } from '../types/restyle';

type Status = 'loading' | 'ready' | 'error';

export function Browse() {
  const [ideas, setIdeas] = useState<RestyleIdea[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;
    fetchRestyleIdeas()
      .then((rows) => {
        if (cancelled) return;
        // Airtable returns records in whatever order the base view has them in,
        // not necessarily idea_id order — sort explicitly so the grid is stable.
        const sorted = [...rows].sort((a, b) => a.idea_id - b.idea_id);
        setIdeas(sorted);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const available = useMemo(
    () => garmentTypes.filter((type) => ideas.some((idea) => idea.garment_type === type)),
    [ideas]
  );

  const visible = useMemo(
    () => (filter === 'all' ? ideas : ideas.filter((idea) => idea.garment_type === filter)),
    [ideas, filter]
  );

  return (
    <main className="w-full bg-lilac">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Browse every restyle idea
          </h1>
          <p className="mt-2 max-w-2xl text-ink/70">
            The full curated set — no photo needed. Filter by what is hanging in your cupboard.
          </p>
        </motion.header>

        <div className="mt-6 flex flex-wrap gap-2">
          <Chip label="All garments" selected={filter === 'all'} onClick={() => setFilter('all')} />
          {available.map((type) =>
            <Chip
              key={type}
              label={type}
              selected={filter === type}
              onClick={() => setFilter(type)} />
          )}
        </div>

        {status === 'loading' &&
          <p className="mt-10 flex items-center gap-2 text-sm font-medium text-ink/70">
            <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading the curated ideas…
          </p>
        }

        {status === 'error' &&
          <p
            role="alert"
            className="mt-10 rounded-2xl border-2 border-amber-border bg-amber-fill px-4 py-3 text-sm font-semibold text-amber-text">

            We could not reach the idea library just now. Please refresh and try again.
          </p>
        }

        {status === 'ready' &&
          <>
            <p className="mt-6 text-sm font-medium text-ink/60">
              Showing {visible.length} {visible.length === 1 ? 'idea' : 'ideas'}
            </p>
            <motion.div layout className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.map((idea, index) =>
                  <motion.div layout key={idea.idea_id} exit={{ opacity: 0, scale: 0.96 }}>
                    <IdeaCard idea={idea} index={index} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {visible.length === 0 &&
              <div className="mt-6 rounded-3xl border border-lilacDeep bg-white p-8 text-center">
                <p className="font-display text-xl font-semibold text-ink">Nothing here yet</p>
                <p className="mt-2 text-sm text-ink/70">
                  We have not curated ideas for this garment type yet — try another filter.
                </p>
              </div>
            }
          </>
        }
      </div>
    </main>);
}