import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserProfile } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('Get User Profile Service', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetUserProfile

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfile(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Noura',
      email: 'noura@noura.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.email).toEqual('noura@noura.com')
  })

  it('should not be able to get a user profile with a invalid id', async () => {
    expect(async () => {
      await sut.execute({
        userId: 'Invalid ID',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
