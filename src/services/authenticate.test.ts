import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials'

describe('Authenticate Service', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Noura',
      email: 'noura@noura.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'noura@noura.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with invalid email', async () => {
    expect(async () => {
      await sut.execute({
        email: 'nouraaaaaaa@noura.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('should not be able to authenticate with invalid password', async () => {
    await usersRepository.create({
      name: 'Noura',
      email: 'noura@noura.com',
      password_hash: await hash('123456', 6),
    })

    expect(async () => {
      await sut.execute({
        email: 'noura@noura.com',
        password: 'fd13iud',
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })
})
