import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Hero & About',
  type: 'document',
  fields: [
    defineField({ name: 'heroTagline', type: 'string', title: 'Hero tagline' }),
    defineField({ name: 'aboutIntro', type: 'text', title: 'About — intro line', rows: 2, description: 'Short subtitle shown under the About heading' }),
    defineField({ name: 'aboutParagraph1', type: 'text', title: 'About — paragraph 1', rows: 4 }),
    defineField({ name: 'aboutParagraph2', type: 'text', title: 'About — paragraph 2', rows: 4 }),
    defineField({ name: 'aboutParagraph3', type: 'text', title: 'About — paragraph 3', rows: 4 }),
  ],
})
