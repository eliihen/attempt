import attempt from '../src/attempt';

const quick = { iterations: 5 };

describe('string', () => {
  it('should return consistent strings', async () => (
    attempt((a, b, c) => {
      const astr1 = a.str();
      const astr2 = a.str();
      const astr3 = a.str();
      const bstr1 = b.str();
      const bstr2 = b.str();
      const bstr3 = b.str();
      const cstr1 = c.str();
      const cstr2 = c.str();
      const cstr3 = c.str();

      if (astr1 !== astr2 || astr2 !== astr3 || astr1 !== astr3
      || bstr1 !== bstr2 || bstr2 !== bstr3 || bstr1 !== bstr3
      || cstr1 !== cstr2 || cstr2 !== cstr3 || cstr1 !== cstr3) {
        throw new Error(`Strings were not consistent:
        astr1: ${astr1}
        astr2: ${astr2}
        astr3: ${astr3}
        bstr1: ${bstr1}
        bstr2: ${bstr2}
        bstr3: ${bstr3}
        cstr1: ${cstr1}
        cstr2: ${cstr2}
        cstr3: ${cstr3}`);
      }
    })
  ));

  it('should support configuring strings', async () => {
    await attempt((a, b, c, d) => {
      const uppercase = a.str('A');
      const lowercase = b.str('a');
      const special = c.str('!');
      const chars = d.str('?', 13, { chars: '_øæå' });

      expect(uppercase).toMatch(/^[A-Z]{10}$/);
      expect(lowercase).toMatch(/^[a-z]{10}$/);
      expect(special).toMatch(/^[\S]{10}$/);
      expect(chars).toMatch(/^[_æøå]{13}$/);
    }, quick);

    await attempt((a, b, c, d, e, f) => {
      const len1 = d.num({ min: 0, max: 100 })
      const len2 = e.num({ min: 0, max: 100 })
      const len3 = f.num({ min: 0, max: 100 })
      const uppercase = a.str('A', len1);
      const lowercase = b.str('a', len2);
      const special = c.str('!', len3);

      expect(uppercase).toHaveLength(len1);
      expect(lowercase).toHaveLength(len2);
      expect(special).toHaveLength(len3);
    });
  });

  it('should support not setting all options', async () => {
    await attempt((a, b, c) => {
      const uppercase = a.str('A');
      const lowercase = b.str('a');
      const special = c.str('!');

      expect(uppercase).toHaveLength(10);
      expect(lowercase).toHaveLength(10);
      expect(special).toHaveLength(10);
    }, quick);

    await attempt(a => {
      expect(a.str()).toHaveLength(10);
    }, quick);
  });
});


