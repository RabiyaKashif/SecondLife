import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CameraIcon, PencilLineIcon, ShirtIcon, SparklesIcon } from 'lucide-react';

const marqueeItems = [
  'Lehenga choli',
  'Gharara',
  'Saree',
  'Anarkali',
  'Peshwas',
  'Sharara',
  'Angrakha',
  'Shalwar kameez'
];

const steps = [
  {
    icon: CameraIcon,
    title: 'Upload the photo',
    body: 'One picture of the outfit sitting in your cupboard. We read the garment, colour and fabric so you do not have to fill a form.'
  },
  {
    icon: PencilLineIcon,
    title: 'Say what you want',
    body: 'In your own words — "make it modern, maybe a co-ord set, but keep the embroidery". No style vocabulary required.'
  },
  {
    icon: ShirtIcon,
    title: 'Get real restyle ideas',
    body: 'Matched from 60 curated ideas with a reference photo, a written explanation and how hard it is to get done.'
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 }
};

export function Landing() {
  return (
    <main className="w-full bg-lilac">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pt-16">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.09 }}>
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-hotpink/50 bg-pinkfill px-3.5 py-1.5 text-sm font-semibold text-ink">

            <SparklesIcon className="h-4 w-4 text-hotpink" aria-hidden="true" />
            No new dress required
          </motion.span>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.25rem]">

            The best outfit you own is{' '}
            <span className="relative inline-block">
              <span className="relative z-10">already in your cupboard.</span>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">

            Wedding lehengas, sarees, shalwar kameez, and other South Asian outfits get worn once and then sit folded for a decade. SecondLife matches your old desi outfit to curated restyle ideas — with a reference photo and a plain-language explanation you can hand straight to a tailor. Serving India, Pakistan, Bangladesh, Nepal, and the entire South Asian diaspora.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3">

            <Link
              to="/upload"
              className="group inline-flex items-center gap-2 rounded-full bg-hotpink px-6 py-3.5 text-base font-bold text-pinkfill transition-colors hover:bg-hotpinkDark focus:outline-none focus-visible:ring-2 focus-visible:ring-hotpink focus-visible:ring-offset-2 focus-visible:ring-offset-lilac">

              Restyle my dress
              <ArrowRightIcon
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true" />
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center rounded-full border border-hotpink/50 px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:border-hotpink hover:bg-white">

              Just browse the ideas
            </Link>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid max-w-2xl grid-cols-3 gap-5">

            {[
              ['60', 'Curated ideas'],
              ['11', 'Garment types'],
              ['0', 'New fabric bought']
            ].map(([value, label]) =>
              <div key={label} className="rounded-2xl border border-lilacDeep bg-white p-5 transition-colors hover:border-hotpink">
                <dt className="font-display text-3xl font-semibold text-ink">{value}</dt>
                <dd className="mt-1.5 whitespace-nowrap text-sm font-medium text-ink/60">{label}</dd>
              </div>
            )}
          </motion.dl>
        </motion.div>

        {/* Hero collage: three real outfit photos, floating with a staggered pop-in.
            Sourced from the Lovable prototype's sl-pop-float animation. */}
        <div className="relative h-[420px] md:h-[520px]">
          <img
            src="/red_lehenga.jpg"
            alt="A maroon embroidered lehenga choli"
            width={800}
            height={1000}
            className="sl-pop-float absolute top-0 right-0 h-[300px] w-[62%] rounded-3xl object-cover shadow-lg md:h-[380px]"
            style={{ animationDelay: '200ms, 0s' }} />

          <img
            src="/lavender_dress.jpg"
            alt="A lavender-to-ivory ombre tiered gown with a sequinned dupatta"
            loading="lazy"
            width={800}
            height={1000}
            className="sl-pop-float absolute bottom-0 left-0 h-[240px] w-[52%] rounded-3xl object-cover shadow-lg md:h-[300px]"
            style={{ animationDelay: '340ms, 1.2s', ['--sl-rot' as string]: '-3deg' }} />

          <img
            src="/structured_bustier_lehange.jpg"
            alt="A sage green structured bustier lehenga with hand embroidery"
            loading="lazy"
            width={800}
            height={1000}
            className="sl-pop-float absolute right-6 bottom-6 h-[150px] w-[34%] rounded-2xl object-cover shadow-lg md:h-[190px]"
            style={{ animationDelay: '460ms, 2.1s', ['--sl-rot' as string]: '4deg' }} />
        </div>
      </section>

      <section aria-hidden="true" className="overflow-hidden border-y border-lilacDeep py-4">
        <div className="sl-marquee flex w-max gap-8 whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, index) =>
            <span
              key={`${item}-${index}`}
              className="font-display text-lg font-medium tracking-tight text-ink/60">

              {item} <span className="text-hotpink">✦</span>
            </span>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          How it works
        </h2>
        <p className="mt-2 max-w-xl text-ink/70">
          Three steps, no styling knowledge needed. We never generate a fake picture of your dress —
          every idea is a real restyle someone has already pulled off.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) =>
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-lilacDeep bg-white p-6 transition-colors hover:border-hotpink">

              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pinkfill">
                  <step.icon className="h-5 w-5 text-hotpink" aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.body}</p>
            </motion.div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-lilacDeep bg-white p-8 transition-colors hover:border-hotpink sm:flex-row sm:items-center sm:p-10">

          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
              Ready to open the cupboard?
            </h2>
            <p className="mt-2 max-w-lg text-ink/70">
              Start with one outfit. It takes about a minute, and you can change your description as
              many times as you like without re-uploading the photo.
            </p>
          </div>
          <Link
            to="/upload"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-hotpink px-6 py-3.5 text-base font-bold text-pinkfill transition-colors hover:bg-hotpinkDark">

            Restyle my dress
            <ArrowRightIcon
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true" />
          </Link>
        </motion.div>
      </section>
    </main>);
}
