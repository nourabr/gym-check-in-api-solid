import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfile } from '../get-user-profile'

export function makeGetUserProfileService() {
  const usersRepository = new PrismaUsersRepository()
  const getUserProfileService = new GetUserProfile(usersRepository)

  return getUserProfileService
}
