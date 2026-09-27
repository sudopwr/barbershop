import { it, expect, describe } from 'vitest';

import { parseHours } from './shop';

describe('parseHours', () => {
  it('parses label=time pairs and skips malformed ones', () => {
    expect(parseHours('Mon – Fri=10:00 – 21:00| Sunday = Closed |junk|=x')).toEqual([
      { label: 'Mon – Fri', time: '10:00 – 21:00' },
      { label: 'Sunday', time: 'Closed' },
    ]);
  });
});
