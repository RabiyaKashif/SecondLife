import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';

export function SiteHeader() {
  const { pathname } = useLocation();
  const restyleActive = pathname === '/upload';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-lilacDeep bg-lilac/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-4 sm:px-5">
        <Link to="/" className="flex items-center gap-2" aria-label="SecondLife home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hotpink">
            <SparklesIcon className="h-4 w-4 text-pinkfill" aria-hidden="true" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
            SecondLife
          </span>
        </Link>

        <nav aria-label="Main" className="flex shrink-0 items-center gap-2 sm:gap-4">
          <NavLink
            to="/browse"
            className="whitespace-nowrap text-sm font-semibold text-ink transition-colors hover:text-pinktext">

            <span className="sm:hidden">Browse</span>
            <span className="hidden sm:inline">Browse ideas</span>
          </NavLink>
          <NavLink
            to="/upload"
            className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
              restyleActive
                ? 'border-hotpink bg-pinkfill text-pinktext'
                : 'border-hotpink bg-hotpink text-pinkfill hover:bg-hotpinkDark'}`
            }>

            <span className="sm:hidden">Restyle</span>
            <span className="hidden sm:inline">Restyle a dress</span>
          </NavLink>
        </nav>
      </div>
    </header>);
}
