import { it, describe, expect } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

describe('Register service', () => {
  it('should hash user password upon registration', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(UsersRepository)

    const { user } = await registerService.execute({
      name: 'João predo',
      email: 'joao@predo.com',
      password: '123456',
    })

    const isHashed = await compare('123456', user.password_hash)

    expect(isHashed).toBe(true)
  })
})
