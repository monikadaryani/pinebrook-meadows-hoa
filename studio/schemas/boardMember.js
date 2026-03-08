import { defineField, defineType } from 'sanity'

export const boardMember = defineType({
  name: 'boardMember',
  title: 'Board Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', type: 'string', title: 'Role (e.g. President)', validation: (Rule) => Rule.required() }),
    defineField({ name: 'displayOrder', type: 'number', title: 'Display order (1 = first)', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
})
