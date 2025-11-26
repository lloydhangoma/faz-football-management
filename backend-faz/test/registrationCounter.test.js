/**
 * Test skeleton for registrationCounter helper.
 * Note: this test expects a running test MongoDB or mongodb-memory-server setup.
 * We'll keep this lightweight and focused; CI integration will add the in-memory DB.
 */
import { describe, it, expect } from 'vitest';
import { getNextLeagueRegistrationNumber } from '../utils/registrationCounter.js';

describe('registrationCounter helper', () => {
  it.skip('should return a formatted registration number', async () => {
    // This test requires a test MongoDB instance (mongodb-memory-server) to be available.
    const { registrationNumber, seq } = await getNextLeagueRegistrationNumber('TST');
    expect(registrationNumber).toMatch(/^FAZ-TST-\d{6}$/);
    expect(typeof seq).toBe('number');
  });
});
