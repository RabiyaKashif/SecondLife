/**
 * By default, every idea card's photo is cropped from the TOP (object-top) —
 * this works best for most fashion photos since the face/neckline/embroidery
 * detail near the top matters most.
 *
 * If a specific photo looks better cropped from the CENTER instead (e.g. the
 * important detail is lower in the frame, or it's a full-length shot that
 * needs to stay centered), add its idea_id to the list below.
 *
 * To add more later: just add the number to this array, save, and refresh.
 * No other code needs to change.
 */
export const centerCroppedIdeaIds: number[] = [
  // example: 4, 5, 19
];