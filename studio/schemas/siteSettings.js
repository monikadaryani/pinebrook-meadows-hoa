import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero & About' },
    { name: 'manager', title: 'Property Manager' },
  ],
  fields: [
    defineField({ name: 'heroTagline', type: 'string', title: 'Hero tagline', group: 'hero' }),
    defineField({ name: 'aboutIntro', type: 'text', title: 'About — intro line', rows: 2, description: 'Short subtitle shown under the About heading', group: 'hero' }),
    defineField({
      name: 'aboutParagraphs',
      type: 'array',
      title: 'About — paragraphs',
      description: 'Add, remove, or reorder paragraphs for the About page.',
      group: 'hero',
      of: [{
        type: 'object',
        name: 'paragraph',
        fields: [
          defineField({ name: 'text', type: 'text', title: 'Paragraph text', rows: 4 }),
        ],
        preview: { select: { title: 'text' } },
      }],
    }),
    defineField({ name: 'propertyManagerName', type: 'string', title: 'Name', group: 'manager' }),
    defineField({ name: 'propertyManagerEmail', type: 'string', title: 'Email', group: 'manager' }),
    defineField({ name: 'propertyManagerPhone', type: 'string', title: 'Phone', group: 'manager' }),
    defineField({ name: 'propertyManagerMailingAddress', type: 'string', title: 'Mailing address', group: 'manager' }),
  ],
})
