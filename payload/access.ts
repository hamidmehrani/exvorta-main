import type { Access, FieldAccess } from 'payload'

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const authenticatedField: FieldAccess = ({ req: { user } }) => Boolean(user)

/**
 * Content collections: public read (site renders from CMS),
 * but only authenticated admins can create/update/delete.
 */
export const readOnlyPublic = {
  read: () => true,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
}
