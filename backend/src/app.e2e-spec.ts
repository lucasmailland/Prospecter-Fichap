import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

// Test data constants - using random/dynamic values to avoid hardcoded credentials
const generateTestEmail = () => `test_${Date.now()}_${Math.random().toString(36).substring(7)}@test-domain.local`;
const TEST_DOMAIN = 'test-domain.local';
const TEST_COMPANY = 'Test Company Inc';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Endpoints', () => {
    it('/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('environment');
          expect(res.body).toHaveProperty('version');
        });
    });

    it('/health/ready (GET)', () => {
      return request(app.getHttpServer())
        .get('/health/ready')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ready');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('checks');
          expect(res.body.checks).toHaveProperty('database');
          expect(res.body.checks).toHaveProperty('externalApis');
          expect(res.body.checks).toHaveProperty('memory');
        });
    });

    it('/health/live (GET)', () => {
      return request(app.getHttpServer())
        .get('/health/live')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'alive');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('memory');
          expect(res.body.memory).toHaveProperty('used');
          expect(res.body.memory).toHaveProperty('total');
          expect(res.body.memory).toHaveProperty('percentage');
        });
    });
  });

  describe('Enrichment Endpoints', () => {
    it('/enrichment/providers/status (GET)', () => {
      return request(app.getHttpServer())
        .get('/enrichment/providers/status')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('mailboxlayer');
          expect(res.body.data).toHaveProperty('hunter');
          expect(res.body.data).toHaveProperty('clearbit');
          expect(res.body.data.mailboxlayer).toHaveProperty('isActive');
          expect(res.body.data.mailboxlayer).toHaveProperty('isRateLimited');
          expect(res.body.data.mailboxlayer).toHaveProperty('remainingRequests');
        });
    });

    it('/enrichment/stats (GET)', () => {
      return request(app.getHttpServer())
        .get('/enrichment/stats')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('data');
          if (res.body.success) {
            expect(res.body.data).toHaveProperty('totalEnrichments');
            expect(res.body.data).toHaveProperty('successfulEnrichments');
            expect(res.body.data).toHaveProperty('failedEnrichments');
            expect(res.body.data).toHaveProperty('totalCost');
            expect(res.body.data).toHaveProperty('averageResponseTime');
          }
        });
    });

    it('/enrichment/bulk-enrich (POST) - should handle empty leadIds', () => {
      return request(app.getHttpServer())
        .post('/enrichment/bulk-enrich')
        .send({ leadIds: [], enrichmentTypes: [] })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
          expect(res.body).toHaveProperty('error', 'No lead IDs provided');
        });
    });

    it('/enrichment/bulk-enrich (POST) - should handle too many leadIds', () => {
      const leadIds = Array.from({ length: 101 }, (_, i) => `lead${i}`);
      
      return request(app.getHttpServer())
        .post('/enrichment/bulk-enrich')
        .send({ leadIds, enrichmentTypes: [] })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
          expect(res.body).toHaveProperty('error', 'Maximum 100 leads allowed per bulk operation');
        });
    });

    it('/enrichment/enrich/:leadId (POST) - should handle non-existent lead', () => {
      return request(app.getHttpServer())
        .post('/enrichment/enrich/non-existent-id')
        .send({ enrichmentTypes: ['email_validation'] })
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('Prospects Endpoints', () => {
    it('/prospects (GET) - should return prospects with pagination', () => {
      return request(app.getHttpServer())
        .get('/prospects?page=1&limit=10')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('total');
          expect(res.body.data).toHaveProperty('page');
          expect(res.body.data).toHaveProperty('limit');
        });
    });

    it('/prospects (POST) - should create new prospect', () => {
      const createProspectDto = {
        email: generateTestEmail(),
        firstName: 'John',
        lastName: 'Doe',
        company: TEST_COMPANY,
        jobTitle: 'CTO',
        phone: '+1234567890',
        website: `https://${TEST_DOMAIN}`,
        linkedinUrl: 'https://linkedin.com/in/test-profile',
        notes: 'Test prospect',
      };

      return request(app.getHttpServer())
        .post('/prospects')
        .send(createProspectDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('message', 'Prospect created successfully');
          expect(res.body.data).toHaveProperty('email', createProspectDto.email);
          expect(res.body.data).toHaveProperty('firstName', 'John');
          expect(res.body.data).toHaveProperty('lastName', 'Doe');
        });
    });

    it('/prospects (POST) - should validate required fields', () => {
      const invalidDto = {
        firstName: 'John',
        lastName: 'Doe',
        // Missing email
      };

      return request(app.getHttpServer())
        .post('/prospects')
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
          expect(res.body).toHaveProperty('error');
        });
    });

    it('/prospects/:id (GET) - should return specific prospect', () => {
      // First create a prospect
      const createProspectDto = {
        email: generateTestEmail(),
        firstName: 'Jane',
        lastName: 'Smith',
        company: TEST_COMPANY,
      };

      return request(app.getHttpServer())
        .post('/prospects')
        .send(createProspectDto)
        .then((createRes) => {
          const prospectId = createRes.body.data.id;
          
          return request(app.getHttpServer())
            .get(`/prospects/${prospectId}`)
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty('success', true);
              expect(res.body).toHaveProperty('data');
              expect(res.body.data).toHaveProperty('id', prospectId);
              expect(res.body.data).toHaveProperty('email', createProspectDto.email);
            });
        });
    });

    it('/prospects/:id (GET) - should handle non-existent prospect', () => {
      return request(app.getHttpServer())
        .get('/prospects/non-existent-id')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
          expect(res.body).toHaveProperty('error', 'Prospect not found');
        });
    });

    it('/prospects/:id (PUT) - should update prospect', () => {
      // First create a prospect
      const createProspectDto = {
        email: generateTestEmail(),
        firstName: 'Original',
        lastName: 'Name',
        company: 'Original Company',
      };

      const updateProspectDto = {
        firstName: 'Updated',
        lastName: 'Name',
        jobTitle: 'CEO',
      };

      return request(app.getHttpServer())
        .post('/prospects')
        .send(createProspectDto)
        .then((createRes) => {
          const prospectId = createRes.body.data.id;
          
          return request(app.getHttpServer())
            .put(`/prospects/${prospectId}`)
            .send(updateProspectDto)
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty('success', true);
              expect(res.body).toHaveProperty('data');
              expect(res.body).toHaveProperty('message', 'Prospect updated successfully');
              expect(res.body.data).toHaveProperty('firstName', 'Updated');
              expect(res.body.data).toHaveProperty('jobTitle', 'CEO');
            });
        });
    });

    it('/prospects/:id (DELETE) - should delete prospect', () => {
      // First create a prospect
      const createProspectDto = {
        email: generateTestEmail(),
        firstName: 'Delete',
        lastName: 'Me',
        company: 'Delete Company',
      };

      return request(app.getHttpServer())
        .post('/prospects')
        .send(createProspectDto)
        .then((createRes) => {
          const prospectId = createRes.body.data.id;
          
          return request(app.getHttpServer())
            .delete(`/prospects/${prospectId}`)
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty('success', true);
              expect(res.body).toHaveProperty('message', 'Prospect deleted successfully');
            });
        });
    });

    it('/prospects/status/:status (GET) - should return prospects by status', () => {
      return request(app.getHttpServer())
        .get('/prospects/status/NEW')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('/prospects/priority/:priority (GET) - should return prospects by priority', () => {
      return request(app.getHttpServer())
        .get('/prospects/priority/10')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('/prospects/score/:minScore (GET) - should return prospects by minimum score', () => {
      return request(app.getHttpServer())
        .get('/prospects/score/80')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/non-existent-route')
        .expect(404);
    });

    it('should handle malformed JSON', () => {
      return request(app.getHttpServer())
        .post('/prospects')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
    });

    it('should handle CORS preflight requests', () => {
      return request(app.getHttpServer())
        .options('/prospects')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .expect(204);
    });
  });
}); 