/**
 * Unit tests for the Prisma database client singleton
 * 
 * Tests cover:
 * - Singleton pattern implementation
 * - Environment-based behavior (development vs production)
 * - PrismaClient instantiation
 * - Global object management
 */

import { PrismaClient } from '@/generated/prisma'

// Mock the PrismaClient
jest.mock('@/generated/prisma', () => {
  const mockPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  }
})

describe('Prisma Database Client', () => {
  let originalEnv: string | undefined
  let originalGlobalPrisma: any

  beforeEach(() => {
    // Save original environment and global state
    originalEnv = process.env.NODE_ENV
    originalGlobalPrisma = (global as any).prisma

    // Clear module cache to get fresh instance
    jest.resetModules()
    
    // Clear any existing prisma from global
    delete (global as any).prisma
    
    // Clear mock calls
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Restore original environment
    process.env.NODE_ENV = originalEnv
    
    // Restore original global prisma
    if (originalGlobalPrisma !== undefined) {
      (global as any).prisma = originalGlobalPrisma
    } else {
      delete (global as any).prisma
    }
  })

  describe('Singleton Pattern', () => {
    it('should create a new PrismaClient instance when imported', () => {
      process.env.NODE_ENV = 'development'
      
      const prisma = require('../db').default
      
      expect(PrismaClient).toHaveBeenCalledTimes(1)
      expect(prisma).toBeDefined()
    })

    it('should reuse the same PrismaClient instance on subsequent imports in development', () => {
      process.env.NODE_ENV = 'development'
      
      // First import
      const prisma1 = require('../db').default
      
      // Clear just the module cache for db.ts, not the mocks
      const dbModulePath = require.resolve('../db')
      delete require.cache[dbModulePath]
      
      // Second import
      const prisma2 = require('../db').default
      
      // Should have created only one instance total (reused from global)
      expect(PrismaClient).toHaveBeenCalledTimes(1)
      expect(prisma1).toBe(prisma2)
    })

    it('should not store instance in global in production mode', () => {
      process.env.NODE_ENV = 'production'
      
      require('../db').default
      
      expect((global as any).prisma).toBeUndefined()
    })

    it('should store instance in global in development mode', () => {
      process.env.NODE_ENV = 'development'
      
      const prisma = require('../db').default
      
      expect((global as any).prisma).toBe(prisma)
    })

    it('should store instance in global in test mode', () => {
      process.env.NODE_ENV = 'test'
      
      const prisma = require('../db').default
      
      expect((global as any).prisma).toBe(prisma)
    })
  })

  describe('Environment-based Behavior', () => {
    it('should handle undefined NODE_ENV as non-production', () => {
      delete process.env.NODE_ENV
      
      const prisma = require('../db').default
      
      expect((global as any).prisma).toBe(prisma)
      expect(PrismaClient).toHaveBeenCalledTimes(1)
    })

    it('should create new instance in production every time', () => {
      process.env.NODE_ENV = 'production'
      
      // First import
      const prisma1 = require('../db').default
      const firstCallCount = (PrismaClient as jest.Mock).mock.calls.length
      
      // Clear module cache
      const dbModulePath = require.resolve('../db')
      delete require.cache[dbModulePath]
      
      // Second import
      const prisma2 = require('../db').default
      
      // Should have created a new instance (total 2 calls)
      expect(PrismaClient).toHaveBeenCalledTimes(firstCallCount + 1)
    })

    it('should handle staging environment as non-production', () => {
      process.env.NODE_ENV = 'staging'
      
      const prisma = require('../db').default
      
      expect((global as any).prisma).toBe(prisma)
    })
  })

  describe('Global Object Management', () => {
    it('should use existing global prisma instance if available', () => {
      process.env.NODE_ENV = 'development'
      
      // Create a mock existing instance
      const existingPrisma = new PrismaClient()
      ;(global as any).prisma = existingPrisma
      
      // Clear the initial call from creating existingPrisma
      jest.clearAllMocks()
      
      const prisma = require('../db').default
      
      // Should not create a new instance
      expect(PrismaClient).not.toHaveBeenCalled()
      expect(prisma).toBe(existingPrisma)
    })

    it('should properly type the global object', () => {
      process.env.NODE_ENV = 'development'
      
      const prisma = require('../db').default
      const globalForPrisma = global as unknown as { prisma: any }
      
      expect(globalForPrisma.prisma).toBe(prisma)
      expect(typeof globalForPrisma.prisma).toBe('object')
    })
  })

  describe('PrismaClient Instance', () => {
    it('should export a valid PrismaClient instance', () => {
      process.env.NODE_ENV = 'development'
      
      const prisma = require('../db').default
      
      expect(prisma).toBeDefined()
      expect(prisma).toHaveProperty('user')
      expect(prisma).toHaveProperty('post')
    })

    it('should have user model methods available', () => {
      process.env.NODE_ENV = 'development'
      
      const prisma = require('../db').default
      
      expect(prisma.user).toHaveProperty('findMany')
      expect(prisma.user).toHaveProperty('findUnique')
      expect(prisma.user).toHaveProperty('create')
      expect(prisma.user).toHaveProperty('update')
      expect(prisma.user).toHaveProperty('delete')
    })

    it('should have post model methods available', () => {
      process.env.NODE_ENV = 'development'
      
      const prisma = require('../db').default
      
      expect(prisma.post).toHaveProperty('findMany')
      expect(prisma.post).toHaveProperty('findUnique')
      expect(prisma.post).toHaveProperty('create')
      expect(prisma.post).toHaveProperty('update')
      expect(prisma.post).toHaveProperty('delete')
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid successive imports', () => {
      process.env.NODE_ENV = 'development'
      
      const prisma1 = require('../db').default
      const prisma2 = require('../db').default
      const prisma3 = require('../db').default
      
      expect(prisma1).toBe(prisma2)
      expect(prisma2).toBe(prisma3)
      expect(PrismaClient).toHaveBeenCalledTimes(1)
    })

    it('should handle switching between environments', () => {
      // Start in development
      process.env.NODE_ENV = 'development'
      const prisma1 = require('../db').default
      const devCallCount = (PrismaClient as jest.Mock).mock.calls.length
      
      // Clear module cache
      jest.resetModules()
      delete (global as any).prisma
      
      // Switch to production
      process.env.NODE_ENV = 'production'
      const prisma2 = require('../db').default
      
      // Should have created 2 instances total
      expect(PrismaClient).toHaveBeenCalledTimes(devCallCount + 1)
      expect((global as any).prisma).toBeUndefined()
    })

    it('should handle null or undefined global prisma gracefully', () => {
      process.env.NODE_ENV = 'development'
      
      ;(global as any).prisma = null
      
      const prisma = require('../db').default
      
      expect(prisma).toBeDefined()
      expect(PrismaClient).toHaveBeenCalled()
    })
  })

  describe('Module Exports', () => {
    it('should export prisma as default export', () => {
      process.env.NODE_ENV = 'development'
      
      const dbModule = require('../db')
      
      expect(dbModule.default).toBeDefined()
      expect(typeof dbModule.default).toBe('object')
    })

    it('should not have named exports', () => {
      process.env.NODE_ENV = 'development'
      
      const dbModule = require('../db')
      const keys = Object.keys(dbModule).filter(key => key !== 'default' && key !== '__esModule')
      
      expect(keys.length).toBe(0)
    })
  })
})