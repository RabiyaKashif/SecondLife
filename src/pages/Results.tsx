import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcwIcon, SparklesIcon } from 'lucide-react';
import { IdeaCard } from '../components/IdeaCard';
import { useRestyle } from '../contexts/RestyleContext';

export function Results() {
  const navigate = useNavigate();
  const { request, matches, summary, summaryLoading, updateRequest, runMatching } = useRestyle();
  const [retrying, setRetrying] = useState(false);
  const [draft, setDraft] = useState(request.wish);

  if (!matches.length && !summaryLoading) return <Navigate to="/upload" replace />;

  const handleRetry = async (event: React.FormEvent) => {
    event.preventDefault();
    updateRequest({ wish: draft });
    setRetrying(false);
    navigate('/processing');
    void runMatching();
  };

  return (
    <main className="w-full bg-lilac">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-lilacDeep bg-white p-6 sm:p-8">

          <div className="flex flex-col gap-6 sm:flex-row">
            {request.photoDataUrl &&
              <img
                src={request.photoDataUrl}
                alt="The dress you uploaded"
                className="h-40 w-full rounded-2xl object-cover sm:h-36 sm:w-28" />
            }
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-pinkfill px-3 py-1 text-xs font-semibold text-ink">
                <SparklesIcon className="h-3.5 w-3.5 text-hotpink" aria-hidden="true" />
                Your personalised suggestion
              </span>

              <div className="mt-4 min-h-[84px]">
                <AnimatePresence mode="wait">
                  {summaryLoading ?
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2.5"
                      aria-live="polite"
                      aria-label="Writing your recommendation">

                      {[100, 92, 74].map((width, index) =>
                        <motion.span
                          key={width}
                          animate={{ opacity: [0.35, 0.8, 0.35] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.15 }}
                          style={{ width: `${width}%` }}
                          className="block h-3.5 rounded-full bg-lilacDeep" />
                      )}
                    </motion.div> :

                    <motion.p
                      key="summary"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-display text-lg font-medium leading-relaxed tracking-tight text-ink sm:text-xl">

                      {summary}
                    </motion.p>
                  }
                </AnimatePresence>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRetrying((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-amber-border px-4 py-2 text-sm font-semibold text-amber-text transition-colors hover:bg-amber-fill">

                  <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
                  Try a different description
                </button>
                <Link
                  to="/browse"
                  className="inline-flex items-center rounded-full border border-lilacDeep px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-hotpink">

                  Browse all ideas
                </Link>
              </div>

              <AnimatePresence>
                {retrying &&
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleRetry}
                    className="mt-4 overflow-hidden">

                    <label htmlFor="new-wish" className="text-sm font-bold text-ink">
                      Describe it differently
                    </label>
                    <textarea
                      id="new-wish"
                      rows={3}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      className="mt-2 w-full resize-none rounded-2xl border border-lilacDeep bg-white px-4 py-3 text-sm font-medium text-ink focus:border-hotpink focus:outline-none focus:ring-2 focus:ring-pinkfill" />

                    <button
                      type="submit"
                      className="mt-3 rounded-full bg-hotpink px-5 py-2.5 text-sm font-bold text-pinkfill transition-colors hover:bg-hotpinkDark">

                      Match again
                    </button>
                  </motion.form>
                }
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {matches.length} ideas that fit your outfit
            </h2>
            <Link
              to="/upload"
              className="text-sm font-bold text-ink underline-offset-4 hover:text-pinktext hover:underline">

              Start over
            </Link>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match, index) =>
              <IdeaCard
                key={match.idea.idea_id}
                idea={match.idea}
                index={index}
                reasons={match.reasons} />
            )}
          </div>
        </section>
      </div>
    </main>);
}
