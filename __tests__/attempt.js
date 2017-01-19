import attempt from '../src/attempt';

const quick = { iterations: 5 };

describe('attempt', () => {
  it('should provide descriptive error messages', async () => {
    await attempt((a, b) => {
      a.num(); b.str();
      throw new Error('It failed!')
    }).catch(e => {
      expect(e.message).toMatch(new RegExp(
        '^It failed!\nTest failed after 1 iterations when given input\n' +
        '\\d{1,3}\n' +
        '\\w{10}\n$'
      ));
    });

    await attempt((a, b) => {
      a.str(); b.num();
      throw new Error('It failed again!')
    }).catch(e => {
      expect(e.message).toMatch(new RegExp(
        '^It failed again!\nTest failed after 1 iterations when given input\n' +
        '\\w{10}\n' +
        '\\d{1,3}\n$'
      ));
    });

    await attempt(() => false).catch(e => {
      expect(e.message).toMatch(new RegExp(
        '^Test returned false\n' +
        'Test failed after 1 iterations$'
      ));
    });
  });

  it('should support a timeout option', async () => {
    const before = + new Date();
    await attempt((a, b) => {
      Math.random();
    }, { iterations: Infinity, timeout: 300 });

    const after = + new Date();
    const timePassed = after - before;

    expect(timePassed).toBeGreaterThanOrEqual(300);
    expect(timePassed).toBeLessThan(350);
  });

  it('should support not setting all options', async () => (
    attempt(() => {
      throw new Error('It failed!')
    }, { timeout: 300 }).then(
      () => { throw new Error('Function was not run'); },
      () => { /* Function was run, error thrown, test pass */ }
    )
  ));

  it('should support "given condition X", ignore test', async () => (
    attempt((a, b) => {
      // Precondition: A callot be less than B.
      // Skip test if this is the case
      if (a.num() > b.num()) return;

      return a.num() <= b.num();
    })
  ));
});

