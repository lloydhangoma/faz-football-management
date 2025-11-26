import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;
let app;

describe('Transfer approval flow (buyer -> seller -> FAZ) with document enforcement', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    // Ensure the worker is disabled for test runs to avoid Redis
    process.env.DISABLE_TRANSFER_WORKER = '1';
    // Import app after env vars
    // eslint-disable-next-line global-require
    app = (await import('../server.js')).default;
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'test' });
  }, 20000);

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  it('blocks FAZ approval when required documents are missing and allows it after documents are attached', async () => {
    const AdminPortalLogin = (await import('../models/AdminPortalLogin.js')).default;
    const ClubsAdminPortalLogin = (await import('../models/Clubs-Management-Panel/Clubs-AdminPortalLogin.js')).default;
    const Player = (await import('../models/Player.js')).default;
    const Transfer = (await import('../models/Transfer.js')).default;
    const generateToken = (await import('../utils/generateToken.js')).default;

    // Create a Super Admin (FAZ)
    const superAdmin = new AdminPortalLogin({ name: 'Super', email: 'super@test.local', password: 'password', role: 'Super Admin' });
    await superAdmin.save();
    const superToken = generateToken(superAdmin._id.toString());

    // Create seller club
    const seller = new ClubsAdminPortalLogin({ name: 'Seller Club', email: 'seller@test.local', password: 'sellerpass', club: { abbreviation: 'SLR' } });
    await seller.save();
    const sellerToken = generateToken(seller._id.toString());

    // Create buyer club
    const buyer = new ClubsAdminPortalLogin({ name: 'Buyer Club', email: 'buyer@test.local', password: 'buyerpass', club: { abbreviation: 'BYR' } });
    await buyer.save();
    const buyerToken = generateToken(buyer._id.toString());

    // Create a player assigned to seller
    const player = new Player({
      clubId: seller._id,
      name: 'Transfer Player',
      nrc: `TR-${Date.now()}`,
      dateOfBirth: new Date('2004-01-01'),
      nationality: 'Zambian',
      position: 'Forward',
      email: `player${Date.now()}@test.local`,
      phone: '0123456789',
      status: 'Active',
    });
    await player.save();

    // Buyer initiates transfer (buyer is the logged-in club)
    const createRes = await request(app)
      .post('/api/transfers')
      .set('Cookie', `adminToken=${buyerToken}`)
      .send({ fromClubId: seller._id.toString(), toClubId: buyer._id.toString(), playerId: player._id.toString(), amount: 50000, type: 'Permanent' })
      .expect(200);

    expect(createRes.body).toHaveProperty('ok', true);
    const transferId = createRes.body.transfer?._id || createRes.body._id || (createRes.body.transferId);
    expect(transferId).toBeTruthy();

    // Seller accepts the buyer-initiated request
    await request(app)
      .put(`/api/transfers/${transferId}/accept`)
      .set('Cookie', `adminToken=${sellerToken}`)
      .expect(200);

    // Attempt FAZ approval should fail due to missing documents
    const failRes = await request(app)
      .post(`/api/admin/transfers/${transferId}/approve`)
      .set('Cookie', `adminToken=${superToken}`)
      .send({ note: 'Approving in test' })
      .expect(400);
    expect(failRes.body).toHaveProperty('ok', false);
    expect(failRes.body.message).toMatch(/Missing required documents/);

    // Attach required documents directly in DB (simulating an upload)
    await Transfer.findByIdAndUpdate(transferId, {
      $set: {
        'documents.consent.url': 'https://example.test/consent.pdf',
        'documents.consent.uploadedAt': new Date(),
        'documents.contract.url': 'https://example.test/contract.pdf',
        'documents.contract.uploadedAt': new Date(),
        documentsSource: 'transfer',
      },
    });

    // Approve again as FAZ (should succeed and mark exported when DISABLE_TRANSFER_WORKER=1)
    const okRes = await request(app)
      .post(`/api/admin/transfers/${transferId}/approve`)
      .set('Cookie', `adminToken=${superToken}`)
      .send({ note: 'Approving after docs' })
      .expect(200);

    expect(okRes.body).toHaveProperty('ok', true);
    const updated = await Transfer.findById(transferId).lean();
    expect(updated.fifaExport).toBeTruthy();
    expect(updated.fifaExport.status).toBe('exported');
  }, 30000);
});
