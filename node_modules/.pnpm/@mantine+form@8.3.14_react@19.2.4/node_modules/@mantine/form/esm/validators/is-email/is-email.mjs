'use client';
import { matches } from '../matches/matches.mjs';

function isEmail(error) {
  return matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, error);
}

export { isEmail };
//# sourceMappingURL=is-email.mjs.map
