import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageUpIcon, RefreshCwIcon } from 'lucide-react';

interface UploadDropzoneProps {
  photoDataUrl: string | null;
  onPhoto: (dataUrl: string) => void;
}

export function UploadDropzone({ photoDataUrl, onPhoto }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const readFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image — try a jpg or png.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => onPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <motion.div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          readFile(event.dataTransfer.files?.[0]);
        }}
        animate={{ scale: dragging ? 1.01 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className={`overflow-hidden rounded-3xl border-2 border-dashed bg-white transition-colors ${
          dragging ? 'border-hotpink bg-pinkfill/40' : 'border-amber-border'}`
        }>

        <AnimatePresence mode="wait" initial={false}>
          {photoDataUrl ?
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">

              <img
                src={photoDataUrl}
                alt="The dress you uploaded"
                className="h-44 w-full rounded-2xl object-cover sm:w-40" />

              <div className="flex-1">
                <p className="font-display text-base font-semibold text-ink">Photo added</p>
                <p className="mt-1 text-sm text-ink/70">
                  We use this only to suggest the garment details below — nothing is stored.
                </p>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-amber-border px-3.5 py-1.5 text-sm font-semibold text-amber-text transition-colors hover:bg-amber-fill">

                  <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
                  Replace photo
                </button>
              </div>
            </motion.div> :

            <motion.button
              key="empty"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center gap-3 px-6 py-12 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ink">

              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pinkfill">

                <ImageUpIcon className="h-7 w-7 text-hotpink" aria-hidden="true" />
              </motion.span>
              <span className="font-display text-lg font-semibold text-ink">
                Drop a photo of your dress here
              </span>
              <span className="max-w-sm text-sm text-ink/70">
                Or tap to choose one from your phone. A flat, well-lit photo of the whole outfit
                works best.
              </span>
            </motion.button>
          }
        </AnimatePresence>
      </motion.div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => readFile(event.target.files?.[0])} />

      {error &&
        <p role="alert" className="mt-2 text-sm font-medium text-hotpinkDark">
          {error}
        </p>
      }
    </div>);
}
