import { defineField, defineType } from 'sanity'

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      type: 'date',
      title: 'Date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: ['Meeting', 'Maintenance', 'Event', 'General'],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'text',
      title: 'Content',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pinned',
      type: 'boolean',
      title: 'Pin to top of announcements',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'date' },
  },
})
