import {defineField, defineType} from 'sanity'
import {languageField} from './language'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    languageField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
        },
      ],
    }),
    defineField({
      name: 'stack',
      title: 'Tech Stack',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'caseStudy',
      title: 'Case Study',
      type: 'object',
      fields: [
        defineField({name: 'summary', title: 'Summary', type: 'text', rows: 3}),
        defineField({name: 'role', title: 'My role', type: 'string'}),
        defineField({name: 'challenge', title: 'Business challenge', type: 'text', rows: 4}),
        defineField({
          name: 'decisions',
          title: 'Technical decisions',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'decision',
              fields: [
                {name: 'title', title: 'Title', type: 'string'},
                {name: 'body', title: 'Why / how', type: 'text', rows: 4},
                {name: 'principles', title: 'Principles / tools', type: 'array', of: [{type: 'string'}]},
              ],
            },
          ],
        }),
        defineField({name: 'business', title: 'Working with the business', type: 'text', rows: 4}),
        defineField({name: 'leadership', title: 'Leadership', type: 'text', rows: 4}),
        defineField({name: 'results', title: 'Results', type: 'array', of: [{type: 'string'}]}),
      ],
    }),
    defineField({
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
