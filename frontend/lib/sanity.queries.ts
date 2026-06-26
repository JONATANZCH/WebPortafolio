import { sanityFetch } from './sanity';

export type Language = 'es' | 'en';

// ============================================================
// Type Definitions
// ============================================================

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface BlogPost {
  _id: string;
  _createdAt: string;
  language: Language;
  title: string;
  slug: { current: string };
  author?: { name: string };
  mainImage?: SanityImage;
  categories?: Array<{ title: string }>;
  publishedAt?: string;
  body?: unknown[];
}

export interface Project {
  _id: string;
  language: Language;
  title: string;
  slug?: { current: string };
  description?: string;
  image?: SanityImage;
  stack?: string[];
  github?: string;
  liveUrl?: string;
  featured?: boolean;
  order?: number;
}

export interface Experience {
  _id: string;
  language: Language;
  role: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  isCurrent?: boolean;
  skills?: string[];
  order?: number;
}

export interface Education {
  _id: string;
  language: Language;
  school: string;
  degree?: string;
  field?: string;
  description?: string;
  graduationDate?: string;
  order?: number;
}

export interface Testimonial {
  _id: string;
  language: Language;
  author: string;
  role?: string;
  company?: string;
  image?: SanityImage;
  text: string;
  featured?: boolean;
  order?: number;
}

export interface About {
  _id: string;
  language: Language;
  fullName?: string;
  title?: string;
  bio?: unknown[];
  image?: SanityImage;
  skills?: string[];
  github?: string;
  linkedin?: string;
  twitter?: string;
}

// ============================================================
// GROQ Query Strings
// ============================================================

export const BLOG_POSTS_QUERY = `*[_type == "post" && language == $language] | order(publishedAt desc) {
  _id,
  _createdAt,
  language,
  title,
  slug,
  author->{ name },
  mainImage,
  categories[]->{ title },
  publishedAt
}`;

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "post" && language == $language && slug.current == $slug][0] {
  _id,
  _createdAt,
  language,
  title,
  slug,
  author->{ name },
  mainImage,
  categories[]->{ title },
  publishedAt,
  body
}`;

export const PROJECTS_QUERY = `*[_type == "project" && language == $language] | order(featured desc, order asc) {
  _id,
  language,
  title,
  slug,
  description,
  image,
  stack,
  github,
  liveUrl,
  featured,
  order
}`;

export const EXPERIENCE_QUERY = `*[_type == "experience" && language == $language] | order(order asc) {
  _id,
  language,
  role,
  company,
  startDate,
  endDate,
  description,
  isCurrent,
  skills,
  order
}`;

export const EDUCATION_QUERY = `*[_type == "education" && language == $language] | order(order asc) {
  _id,
  language,
  school,
  degree,
  field,
  description,
  graduationDate,
  order
}`;

export const TESTIMONIALS_QUERY = `*[_type == "testimonial" && language == $language] | order(featured desc, order asc) {
  _id,
  language,
  author,
  role,
  company,
  image,
  text,
  featured,
  order
}`;

export const ABOUT_QUERY = `*[_type == "about" && language == $language][0] {
  _id,
  language,
  fullName,
  title,
  bio,
  image,
  skills,
  github,
  linkedin,
  twitter
}`;

// ============================================================
// Data Fetcher Helper Functions
// ============================================================

export async function getBlogPosts(language: Language = 'es'): Promise<BlogPost[]> {
  return sanityFetch<BlogPost[]>({
    query: BLOG_POSTS_QUERY,
    params: { language },
    revalidate: 60,
    tags: [`post:${language}`],
  });
}

export async function getBlogPostBySlug(slug: string, language: Language = 'es'): Promise<BlogPost | null> {
  return sanityFetch<BlogPost | null>({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug, language },
    revalidate: 60,
    tags: [`post:${slug}:${language}`],
  });
}

export async function getProjects(language: Language = 'es'): Promise<Project[]> {
  return sanityFetch<Project[]>({
    query: PROJECTS_QUERY,
    params: { language },
    revalidate: 300,
    tags: [`project:${language}`],
  });
}

export async function getExperience(language: Language = 'es'): Promise<Experience[]> {
  return sanityFetch<Experience[]>({
    query: EXPERIENCE_QUERY,
    params: { language },
    revalidate: 3600,
    tags: [`experience:${language}`],
  });
}

export async function getEducation(language: Language = 'es'): Promise<Education[]> {
  return sanityFetch<Education[]>({
    query: EDUCATION_QUERY,
    params: { language },
    revalidate: 3600,
    tags: [`education:${language}`],
  });
}

export async function getTestimonials(language: Language = 'es'): Promise<Testimonial[]> {
  return sanityFetch<Testimonial[]>({
    query: TESTIMONIALS_QUERY,
    params: { language },
    revalidate: 300,
    tags: [`testimonial:${language}`],
  });
}

export async function getAbout(language: Language = 'es'): Promise<About | null> {
  return sanityFetch<About | null>({
    query: ABOUT_QUERY,
    params: { language },
    revalidate: 3600,
    tags: [`about:${language}`],
  });
}
