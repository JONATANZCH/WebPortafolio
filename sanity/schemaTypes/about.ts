import {defineField, defineType} from 'sanity'
import {languageField} from './language'

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  // Singleton per language — one document per language
  fields: [
    languageField,
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'GitHub', value: 'github'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Twitter / X', value: 'twitter'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Website', value: 'website'},
                  {title: 'Other', value: 'other'},
                ],
              },
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'title',
    },
  },
})
