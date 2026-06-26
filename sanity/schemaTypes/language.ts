import { defineField } from 'sanity'

export const languageField = defineField({
  name: 'language',
  title: 'Idioma',
  type: 'string',
  options: {
    list: [
      { title: 'Español', value: 'es' },
      { title: 'English', value: 'en' },
    ],
  },
  initialValue: 'es',
  validation: (Rule) => Rule.required(),
})
