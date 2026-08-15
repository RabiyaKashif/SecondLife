import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, Loader2Icon, WandSparklesIcon } from 'lucide-react';
import { UploadDropzone } from '../components/UploadDropzone';
import { SelectField } from '../components/SelectField';
import { Chip } from '../components/Chip';
import { useRestyle } from '../contexts/RestyleContext';
import { dominantColors, fabricTypes, garmentTypes, styleTags } from '../data/options';
import type { GarmentType } from '../types/restyle';

type ClassifierState = 'idle' | 'running' | 'done';

export function Upload() {
  const navigate = useNavigate();
  const { request, updateRequest, runMatching } = useRestyle();
  const [classifier, setClassifier] = useState<ClassifierState>(
    request.garment_type ? 'done' : 'idle'
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (classifier !== 'running') return;
    // Stand-in for the garment classifier service. Every field it fills stays
    // editable, and the form works fine if the service is never wired up.
    const timer = setTimeout(() => {
      updateRequest({
        garment_type: request.garment_type || 'Lehenga Choli',
        dominant_color: request.dominant_color || 'Maroon',
        fabric_type: request.fabric_type.length ? request.fabric_type : ['Silk']
      });
      setClassifier('done');
    }, 1600);
    return () => clearTimeout(timer);
  }, [classifier, request, updateRequest]);

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!request.garment_type) {
      setError('Pick a garment type so we know what we are working with.');
      return;
    }
    if (request.wish.trim().length < 8) {
      setError('Tell us a little more about how you want it restyled.');
      return;
    }
    setError('');
    navigate('/processing');
    void runMatching();
  };

  const sectionHeading = 'font-display text-lg font-semibold tracking-tight text-ink';

  return (
    <main className="w-full bg-lilac">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Tell us about your dress
          </h1>
          <p className="mt-2 text-ink/70">
            One photo and a sentence about what you imagine. Everything we guess is editable.
          </p>
        </motion.header>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <section className="rounded-3xl border border-lilacDeep bg-white p-5 sm:p-6">
            <h2 className={sectionHeading}>
              Photo of the outfit
            </h2>
            <div className="mt-4">
              <UploadDropzone
                photoDataUrl={request.photoDataUrl}
                onPhoto={(dataUrl) => {
                  updateRequest({ photoDataUrl: dataUrl });
                  setClassifier('running');
                }} />
            </div>

            <AnimatePresence>
              {classifier !== 'idle' &&
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex items-center gap-2 text-sm font-medium text-pinktext">

                  {classifier === 'running' ?
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Reading the garment, colour and fabric…
                    </> :

                    <>
                      <CheckCircle2Icon className="h-4 w-4" aria-hidden="true" />
                      We filled in our best guess — correct anything that looks off
                    </>
                  }
                </motion.p>
              }
            </AnimatePresence>
          </section>

          <section className="rounded-3xl border border-lilacDeep bg-white p-5 sm:p-6">
            <h2 className={sectionHeading}>
              Garment details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SelectField
                id="garment-type"
                label="Garment type"
                value={request.garment_type}
                options={garmentTypes}
                onChange={(value) => updateRequest({ garment_type: value as GarmentType })} />

              <SelectField
                id="dominant-color"
                label="Dominant colour"
                value={request.dominant_color}
                options={dominantColors}
                onChange={(value) => updateRequest({ dominant_color: value })} />
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-bold text-ink">Fabric</legend>
              <p className="mt-1 text-xs text-ink/60">Pick every fabric you can see</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {fabricTypes.map((fabric) =>
                  <Chip
                    key={fabric}
                    label={fabric}
                    selected={request.fabric_type.includes(fabric)}
                    onClick={() =>
                      updateRequest({ fabric_type: toggle(request.fabric_type, fabric) })
                    } />
                )}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="text-sm font-bold text-ink">Style details (optional)</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {styleTags.map((tag) =>
                  <Chip
                    key={tag}
                    label={tag}
                    selected={request.original_style_tags.includes(tag)}
                    onClick={() =>
                      updateRequest({
                        original_style_tags: toggle(request.original_style_tags, tag)
                      })
                    } />
                )}
              </div>
            </fieldset>
          </section>

          <section className="rounded-3xl border border-lilacDeep bg-white p-5 sm:p-6">
            <label htmlFor="wish" className={sectionHeading}>
              How would you like it restyled?
            </label>
            <p className="mt-1 text-xs text-ink/60">
              Your own words are fine — no fashion vocabulary needed.
            </p>
            <textarea
              id="wish"
              rows={4}
              value={request.wish}
              onChange={(event) => updateRequest({ wish: event.target.value })}
              placeholder="Make it modern, maybe a co-ord set, but keep the embroidery"
              className="mt-3 w-full resize-none rounded-2xl border border-lilacDeep bg-white px-4 py-3 text-sm font-medium text-ink placeholder:font-normal placeholder:text-ink/40 focus:border-hotpink focus:outline-none focus:ring-2 focus:ring-pinkfill" />
          </section>

          {error &&
            <p
              role="alert"
              className="rounded-xl border-2 border-hotpink bg-pinkfill px-4 py-3 text-sm font-semibold text-pinktext">

              {error}
            </p>
          }

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -2 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-hotpink px-6 py-4 text-base font-bold text-pinkfill transition-colors hover:bg-hotpinkDark focus:outline-none focus-visible:ring-2 focus-visible:ring-hotpink focus-visible:ring-offset-2 focus-visible:ring-offset-lilac sm:w-auto">

            <WandSparklesIcon className="h-5 w-5" aria-hidden="true" />
            Restyle my dress
          </motion.button>
        </form>
      </div>
    </main>);
}
