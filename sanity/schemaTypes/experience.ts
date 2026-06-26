import {defineField, defineType} from 'sanity'
import {languageField} from './language'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    languageField,
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Job Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    }),
    defineField({
      name: 'isCurrent',
      title: 'Current Position',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'skills',
      title: 'Skills Used',
      type: 'array',
      of: [{type: 'string'}],
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
      title: 'role',
      subtitle: 'company',
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
