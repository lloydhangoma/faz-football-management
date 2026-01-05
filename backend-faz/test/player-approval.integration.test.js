/**
 * Integration test skeleton for player approval and registration number assignment.
 * Requires: mongodb-memory-server, supertest, and test runner configured.
 * This test is skipped by default; enable once test deps are installed.
 */
import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;
let app;

describe('Admin player approval -> assigns registration number', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    // Import app after setting MONGO_URI so server connects to in-memory DB
    // eslint-disable-next-line global-require
    app = (await import('../server.js')).default;
    // ensure mongoose connection established
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'test' });
  }, 20000);

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  it('assigns a league registration number on FAZ approve', async () => {
    const AdminPortalLogin = (await import('../models/AdminPortalLogin.js')).default;
    const ClubsAdminPortalLogin = (await import('../models/Clubs-Management-Panel/Clubs-AdminPortalLogin.js')).default;
    const Player = (await import('../models/Player.js')).default;
    const generateToken = (await import('../utils/generateToken.js')).default;

    // Create super admin
    const superAdmin = new AdminPortalLogin({ name: 'Super', email: 'super@test.local', password: 'password', role: 'Super Admin' });
    await superAdmin.save();
    const token = generateToken(superAdmin._id.toString());

    // Create a club
    const club = new ClubsAdminPortalLogin({ name: 'Test Club', email: 'club@test.local', password: 'clubpass', club: { abbreviation: 'TST' } });
    await club.save();

    // Create player pending approval
    const player = new Player({
      clubId: club._id,
      name: 'Integration Player',
      nrc: `INT-${Date.now()}`,
      dateOfBirth: new Date('2004-01-01'),
      nationality: 'Zambian',
      position: 'Midfielder',
      email: `player${Date.now()}@test.local`,
      phone: '0123456789',
      currentStatus: { registrationStatus: 'Pending Approval', eligibilityStatus: 'Under Review' },
    });
    await player.save();

    // Call approve endpoint with admin cookie
    const res = await request(app)
      .post(`/api/admin/players/${player._id}/approve`)
      .set('Cookie', `adminToken=${token}`)
      .send({ note: 'Approved in test', force: false })
      .expect(200);

    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('player');
    const assigned = res.body.player.leagueRegistrationNumber;
    expect(typeof assigned).toBe('string');
    expect(assigned).toMatch(/^FAZ-[A-Z0-9]{1,6}-\d{6}$/);

    // verify in DB
    const fresh = await Player.findById(player._id).lean();
    expect(fresh.leagueRegistrationNumber).toBe(assigned);
    expect(fresh.registrationAssignedBy.toString()).toBe(superAdmin._id.toString());
  }, 20000);
});
