import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({
      name: 'school',
      title: 'School/University',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'degree',
      title: 'Degree',
      type: 'string',
    }),
    defineField({
      name: 'field',
      title: 'Field of Study',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'school',
      degree: 'degree',
    },
    prepare(selection) {
      const {degree} = selection
      return {...selection, subtitle: degree}
    },
  },
})
