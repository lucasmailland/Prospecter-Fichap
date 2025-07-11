"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        user: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        lead: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            createMany: jest.fn(),
        },
        task: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        aIPrompt: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        openAIUsage: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
    })),
}));
beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.JWT_SECRET = 'test-jwt-secret';
});
afterEach(() => {
    jest.clearAllMocks();
});
//# sourceMappingURL=jest.setup.js.map