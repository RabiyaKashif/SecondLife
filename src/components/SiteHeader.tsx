import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';

export function SiteHeader() {
  const { pathname } = useLocation();
  const restyleActive = pathname === '/upload';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-lilacDeep bg-lilac/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2" aria-label="SecondLife home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hotpink">
            <SparklesIcon className="h-4 w-4 text-pinkfill" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            SecondLife
          </span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-4">
          <NavLink
            to="/browse"
            className="text-sm font-semibold text-ink transition-colors hover:text-pinktext">

            Browse ideas
          </NavLink>
          <NavLink
            to="/upload"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              restyleActive
                ? 'border-hotpink bg-pinkfill text-pinktext'
                : 'border-hotpink bg-hotpink text-pinkfill hover:bg-hotpinkDark'}`
            }>

            Restyle a dress
          </NavLink>
        </nav>
      </div>
    </header>);
}
