import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Hero & About',
  type: 'document',
  fields: [
    defineField({ name: 'heroTagline', type: 'string', title: 'Hero tagline' }),
    defineField({ name: 'aboutIntro', type: 'text', title: 'About — intro line', rows: 2, description: 'Short subtitle shown under the About heading' }),
    defineField({
      name: 'aboutParagraphs',
      type: 'array',
      title: 'About — paragraphs',
      description: 'Add, remove, or reorder paragraphs for the About page.',
      of: [{
        type: 'object',
        name: 'paragraph',
        fields: [
          defineField({ name: 'text', type: 'text', title: 'Paragraph text', rows: 4 }),
        ],
        preview: { select: { title: 'text' } },
      }],
    }),
  ],
})
