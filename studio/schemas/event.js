import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Event title', validation: (R) => R.required() }),
    defineField({ name: 'date', type: 'date', title: 'Date', validation: (R) => R.required() }),
    defineField({ name: 'startTime', type: 'string', title: 'Start time', description: 'e.g. 7:00 PM' }),
    defineField({ name: 'endTime', type: 'string', title: 'End time', description: 'e.g. 8:30 PM' }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Board Meeting', value: 'Board Meeting' },
          { title: 'Annual Meeting', value: 'Annual Meeting' },
          { title: 'Community Event', value: 'Community Event' },
          { title: 'Other', value: 'Other' },
        ],
      },
    }),
    defineField({ name: 'location', type: 'string', title: 'Location', description: 'Physical location or "Virtual"' }),
    defineField({ name: 'zoomLink', type: 'url', title: 'Zoom link', description: 'Meeting link for virtual events' }),
    defineField({ name: 'zoomPasscode', type: 'string', title: 'Zoom passcode' }),
    defineField({ name: 'description', type: 'text', title: 'Description', rows: 3 }),
  ],
  preview: {
    select: { title: 'title', date: 'date', category: 'category' },
    prepare({ title, date, category }) {
      return { title, subtitle: `${date} · ${category ?? ''}` }
    },
  },
  orderings: [{ title: 'Date', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] }],
})
