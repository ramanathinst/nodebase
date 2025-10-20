/**
 * Unit tests for the Home Page component
 * 
 * Tests cover:
 * - Component rendering
 * - Async data fetching from Prisma
 * - User data display
 * - Error handling
 * - Edge cases (empty data, malformed data)
 */

import { render, screen, waitFor } from '@testing-library/react'
import Page from '../page'
import prisma from '@/lib/db'

// Mock the Prisma client
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    user: {
      findMany: jest.fn(),
    },
  },
}))

describe('Home Page', () => {
  const mockPrisma = prisma as jest.Mocked<typeof prisma>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering with Data', () => {
    it('should render users when data is available', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', name: 'User One' },
        { id: 2, email: 'user2@example.com', name: 'User Two' },
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      expect(container.querySelector('.min-h-screen')).toBeInTheDocument()
      expect(container.textContent).toContain('user1@example.com')
      expect(container.textContent).toContain('User One')
      expect(container.textContent).toContain('user2@example.com')
      expect(container.textContent).toContain('User Two')
    })

    it('should render empty array when no users exist', async () => {
      mockPrisma.user.findMany.mockResolvedValue([])

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain('[]')
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument()
    })

    it('should render single user correctly', async () => {
      const mockUser = [
        { id: 1, email: 'solo@example.com', name: 'Solo User' },
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUser)

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain('solo@example.com')
      expect(container.textContent).toContain('Solo User')
    })

    it('should render users with null names', async () => {
      const mockUsers = [
        { id: 1, email: 'noname@example.com', name: null },
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain('noname@example.com')
      expect(container.textContent).toContain('null')
    })
  })

  describe('Data Fetching', () => {
    it('should call prisma.user.findMany on render', async () => {
      mockPrisma.user.findMany.mockResolvedValue([])

      await Page()

      expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1)
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith()
    })

    it('should handle async data fetching', async () => {
      const mockUsers = [
        { id: 1, email: 'async@example.com', name: 'Async User' },
      ]
      
      mockPrisma.user.findMany.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockUsers), 100))
      )

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain('async@example.com')
    })
  })

  describe('Layout and Styling', () => {
    it('should have correct container classes', async () => {
      mockPrisma.user.findMany.mockResolvedValue([])

      const component = await Page()
      const { container } = render(component)

      const mainDiv = container.querySelector('div')
      expect(mainDiv).toHaveClass('min-h-screen')
      expect(mainDiv).toHaveClass('min-w-screen')
      expect(mainDiv).toHaveClass('flex')
      expect(mainDiv).toHaveClass('justify-center')
      expect(mainDiv).toHaveClass('items-center')
    })

    it('should center content with flexbox', async () => {
      mockPrisma.user.findMany.mockResolvedValue([])

      const component = await Page()
      const { container } = render(component)

      const mainDiv = container.querySelector('div')
      const classList = mainDiv?.className.split(' ')
      
      expect(classList).toContain('flex')
      expect(classList).toContain('justify-center')
      expect(classList).toContain('items-center')
    })
  })

  describe('JSON Serialization', () => {
    it('should properly serialize user data to JSON string', async () => {
      const mockUsers = [
        { id: 1, email: 'json@example.com', name: 'JSON User' },
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      const jsonString = container.textContent
      const parsedData = JSON.parse(jsonString || '[]')
      
      expect(parsedData).toEqual(mockUsers)
    })

    it('should handle special characters in user data', async () => {
      const mockUsers = [
        { id: 1, email: 'special"chars@example.com', name: "User's Name" },
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain('special\\"chars@example.com')
      expect(container.textContent).toContain("User's Name")
    })

    it('should handle unicode characters in user data', async () => {
      const mockUsers = [
        { id: 1, email: 'unicode@例.com', name: '用户名' },
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain('unicode@例.com')
      expect(container.textContent).toContain('用户名')
    })
  })

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle database errors gracefully', async () => {
      mockPrisma.user.findMany.mockRejectedValue(new Error('Database connection failed'))

      await expect(Page()).rejects.toThrow('Database connection failed')
    })

    it('should handle null response from database', async () => {
      mockPrisma.user.findMany.mockResolvedValue(null as any)

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain('null')
    })

    it('should handle very large user datasets', async () => {
      const mockUsers = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        email: `user${i + 1}@example.com`,
        name: `User ${i + 1}`,
      }))
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain('user1@example.com')
      expect(container.textContent).toContain('user1000@example.com')
    })

    it('should handle users with extremely long email addresses', async () => {
      const longEmail = 'a'.repeat(100) + '@example.com'
      const mockUsers = [
        { id: 1, email: longEmail, name: 'Long Email User' },
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain(longEmail)
    })

    it('should handle users with empty string names', async () => {
      const mockUsers = [
        { id: 1, email: 'empty@example.com', name: '' },
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain('empty@example.com')
      expect(container.textContent).toContain('""')
    })

    it('should handle malformed user objects', async () => {
      const mockUsers = [
        { id: 1, email: 'valid@example.com', name: 'Valid' },
        { id: 2 } as any,
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      expect(container.textContent).toContain('valid@example.com')
    })
  })

  describe('Component Structure', () => {
    it('should be an async server component', async () => {
      mockPrisma.user.findMany.mockResolvedValue([])

      const result = Page()
      
      expect(result).toBeInstanceOf(Promise)
    })

    it('should export Page as default', () => {
      expect(Page).toBeDefined()
      expect(typeof Page).toBe('function')
    })

    it('should return valid JSX element', async () => {
      mockPrisma.user.findMany.mockResolvedValue([])

      const component = await Page()
      
      expect(component).toBeDefined()
      expect(component).toHaveProperty('type')
      expect(component).toHaveProperty('props')
    })
  })

  describe('Multiple Users Scenarios', () => {
    it('should handle users with duplicate emails', async () => {
      const mockUsers = [
        { id: 1, email: 'duplicate@example.com', name: 'User One' },
        { id: 2, email: 'duplicate@example.com', name: 'User Two' },
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      const jsonString = container.textContent || ''
      expect(jsonString.match(/duplicate@example\.com/g)?.length).toBe(2)
    })

    it('should maintain user order from database', async () => {
      const mockUsers = [
        { id: 3, email: 'third@example.com', name: 'Third' },
        { id: 1, email: 'first@example.com', name: 'First' },
        { id: 2, email: 'second@example.com', name: 'Second' },
      ]
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const component = await Page()
      const { container } = render(component)

      const text = container.textContent || ''
      const thirdIndex = text.indexOf('third@example.com')
      const firstIndex = text.indexOf('first@example.com')
      const secondIndex = text.indexOf('second@example.com')

      expect(thirdIndex).toBeLessThan(firstIndex)
      expect(firstIndex).toBeLessThan(secondIndex)
    })
  })

  describe('Integration with Prisma', () => {
    it('should use the correct prisma import path', async () => {
      mockPrisma.user.findMany.mockResolvedValue([])

      await Page()

      expect(mockPrisma.user.findMany).toBeDefined()
      expect(typeof mockPrisma.user.findMany).toBe('function')
    })
  })
})