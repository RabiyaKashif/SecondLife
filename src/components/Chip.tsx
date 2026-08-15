import React from 'react';
import { motion } from 'framer-motion';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  as?: 'button' | 'span';
}

export function Chip({ label, selected = false, onClick, as = 'button' }: ChipProps) {
  const classes = `rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
    selected
      ? 'border-hotpink bg-hotpink text-pinkfill'
      : 'border-hotpink/40 bg-pinkfill text-pinktext hover:border-hotpink'}`;

  if (as === 'span') {
    return <span className={classes}>{label}</span>;
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -2 }}
      aria-pressed={selected}
      className={`${classes} focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-lilac`}>

      {label}
    </motion.button>);
}
