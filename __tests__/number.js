import attempt from '../src/attempt';

const quick = { iterations: 5 };

describe('number', () => {
  it('should return consistent numbers', async () => (
    attempt((a, b, c) => {
      const anum1 = a.num();
      const anum2 = a.num();
      const anum3 = a.num();
      const bnum1 = b.num();
      const bnum2 = b.num();
      const bnum3 = b.num();
      const cnum1 = c.num();
      const cnum2 = c.num();
      const cnum3 = c.num();

      if (anum1 !== anum2 || anum2 !== anum3 || anum1 !== anum3
      || bnum1 !== bnum2 || bnum2 !== bnum3 || bnum1 !== bnum3
      || cnum1 !== cnum2 || cnum2 !== cnum3 || cnum1 !== cnum3) {
        throw new Error(`Numbers were not consistent:
        anum1: ${anum1}
        anum2: ${anum2}
        anum3: ${anum3}
        bnum1: ${bnum1}
        bnum2: ${bnum2}
        bnum3: ${bnum3}
        cnum1: ${cnum1}
        cnum2: ${cnum2}
        cnum3: ${cnum3}`);
      }
    })
  ));

  it('should handle thrown errors', async () => (
    attempt(() => {
      throw new Error('It failed!')
    }).catch(e => {
      expect(e.message).toEqual(
        'It failed!\nTest failed after 1 iterations'
      );
    })
  ));

  it('should support configuring numbers', async () => {
    await attempt(a => {
      const anum = a.num({ min: 5, max: 10 });

      return anum <= 10 && anum >= 5;
    })

    await attempt(a => {
      const anum = a.num({ integer: true });

      // Assert whole number
      return anum % 1 === 0;
    })
  });

  it('should support not setting all options', async () => {
    // Default config is min 0 max 100
    // Default values for the library is max = min + 1
    // Ensure our default config's max value is persisted
    let greaterThanFiftyFiveFound = false;

    await attempt(a => {
      const anum = a.num({ min: 50 });

      if (anum > 55) {
        greaterThanFiftyFiveFound = true;
      }
    });

    expect(greaterThanFiftyFiveFound).toBeTruthy();
  });
});

