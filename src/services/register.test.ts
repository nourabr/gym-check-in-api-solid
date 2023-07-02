import { it, describe, expect } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'

describe('Register service', () => {
  it('should hash user password upon registration', async () => {
    const registerService = new RegisterService({
      async findByEmail(email) {
        return null
      },

      async create(data) {
        return {
          id: 'test user',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const { user } = await registerService.execute({
      name: 'João predo',
      email: 'joao@predo.com',
      password: '123456',
    })

    const isHashed = await compare('123456', user.password_hash)

    expect(isHashed).toBe(true)
  })
})
