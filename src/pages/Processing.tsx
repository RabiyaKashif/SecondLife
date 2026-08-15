import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import { useRestyle } from '../contexts/RestyleContext';

const stages = [
  'Reading your photo',
  'Matching against 60 curated ideas',
  'Writing your recommendation'
];

export function Processing() {
  const navigate = useNavigate();
  const { request } = useRestyle();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 900),
      setTimeout(() => setStage(2), 1800),
      setTimeout(() => navigate('/results', { replace: true }), 2700)
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  if (!request.garment_type) return <Navigate to="/upload" replace />;

  return (
    <main className="flex w-full flex-1 items-center justify-center bg-lilac px-5 py-20">
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto h-24 w-24">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-hotpink/40" />

          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-4 rounded-full bg-pinkfill" />
        </div>

        <h1 className="mt-8 font-display text-2xl font-semibold tracking-tight text-ink">
          Looking through the cupboard…
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          This usually takes a few seconds. Nothing has gone wrong.
        </p>

        <ul className="mt-8 space-y-3 text-left">
          {stages.map((label, index) => {
            const done = index < stage;
            const active = index === stage;
            return (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: done || active ? 1 : 0.5, x: 0 }}
                transition={{ duration: 0.35 }}
                className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition-colors ${
                  active ? 'border-hotpink' : 'border-lilacDeep'}`
                }>

                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    done ? 'bg-hotpink text-pinkfill' : 'bg-pinkfill text-hotpink'}`
                  }>

                  {done ?
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> :

                    <motion.span
                      animate={active ? { scale: [1, 0.55, 1] } : { scale: 1 }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-hotpink" />
                  }
                </span>
                <span className="text-sm font-semibold text-ink">{label}</span>
              </motion.li>);
          })}
        </ul>
      </div>
    </main>);
}
