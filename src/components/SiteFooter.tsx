import React from 'react';
import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-lilacDeep bg-lilac">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-ink/70">
          SecondLife — restyle what you already own, instead of buying new.
        </p>
        <nav aria-label="Footer" className="flex gap-4 text-sm font-semibold">
          <Link to="/upload" className="text-ink underline-offset-4 hover:text-pinktext hover:underline">
            Restyle a dress
          </Link>
          <Link to="/browse" className="text-ink underline-offset-4 hover:text-pinktext hover:underline">
            Browse ideas
          </Link>
        </nav>
      </div>
    </footer>);
}
