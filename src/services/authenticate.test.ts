import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, it, expect } from 'vitest'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials'

describe('Authenticate Service', () => {
  it('should be able to authenticate with valid credentials', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateService = new AuthenticateService(usersRepository)

    await usersRepository.create({
      name: 'Noura',
      email: 'noura@noura.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await authenticateService.execute({
      email: 'noura@noura.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with invalid email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateService = new AuthenticateService(usersRepository)

    expect(async () => {
      await authenticateService.execute({
        email: 'nouraaaaaaa@noura.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('should not be able to authenticate with invalid password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateService = new AuthenticateService(usersRepository)

    await usersRepository.create({
      name: 'Noura',
      email: 'noura@noura.com',
      password_hash: await hash('123456', 6),
    })

    expect(async () => {
      await authenticateService.execute({
        email: 'noura@noura.com',
        password: 'fd13iud',
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })
})
