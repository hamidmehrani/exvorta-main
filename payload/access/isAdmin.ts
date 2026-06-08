import { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('superadmin'))
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('superadmin'))
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('superadmin')) return true
  if (user?.id) {
    return {
      id: { equals: user.id },
    }
  }
  return false
}
