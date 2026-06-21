import { sanityFetch } from './sanity';

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
  title: string;
  slug?: { current: string };
  description?: string;
  image?: SanityImage;
  technologies?: string[];
  link?: string;
  githubLink?: string;
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  responsibilities?: string[];
}

export interface Education {
  _id: string;
  school: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Testimonial {
  _id: string;
  author: string;
  role?: string;
  company?: string;
  image?: SanityImage;
  content: string;
  rating?: number;
}

export interface About {
  _id: string;
  title?: string;
  bio?: unknown[];
  image?: SanityImage;
  skills?: string[];
}

// ============================================================
// GROQ Query Strings
// ============================================================

export const BLOG_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  _createdAt,
  title,
  slug,
  author->{ name },
  mainImage,
  categories[]->{ title },
  publishedAt
}`;

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  _createdAt,
  title,
  slug,
  author->{ name },
  mainImage,
  categories[]->{ title },
  publishedAt,
  body
}`;

export const PROJECTS_QUERY = `*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  description,
  image,
  technologies,
  link,
  githubLink
}`;

export const EXPERIENCE_QUERY = `*[_type == "experience"] | order(startDate desc) {
  _id,
  title,
  company,
  location,
  startDate,
  endDate,
  description,
  responsibilities
}`;

export const EDUCATION_QUERY = `*[_type == "education"] | order(startDate desc) {
  _id,
  school,
  degree,
  field,
  startDate,
  endDate,
  description
}`;

export const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  author,
  role,
  company,
  image,
  content,
  rating
}`;

export const ABOUT_QUERY = `*[_type == "about"][0] {
  _id,
  title,
  bio,
  image,
  skills
}`;

// ============================================================
// Data Fetcher Helper Functions
// ============================================================

export async function getBlogPosts(): Promise<BlogPost[]> {
  return sanityFetch<BlogPost[]>({
    query: BLOG_POSTS_QUERY,
    revalidate: 60,
    tags: ['post'],
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return sanityFetch<BlogPost | null>({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 60,
    tags: [`post:${slug}`],
  });
}

export async function getProjects(): Promise<Project[]> {
  return sanityFetch<Project[]>({
    query: PROJECTS_QUERY,
    revalidate: 300,
    tags: ['project'],
  });
}

export async function getExperience(): Promise<Experience[]> {
  return sanityFetch<Experience[]>({
    query: EXPERIENCE_QUERY,
    revalidate: 3600,
    tags: ['experience'],
  });
}

export async function getEducation(): Promise<Education[]> {
  return sanityFetch<Education[]>({
    query: EDUCATION_QUERY,
    revalidate: 3600,
    tags: ['education'],
  });
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return sanityFetch<Testimonial[]>({
    query: TESTIMONIALS_QUERY,
    revalidate: 300,
    tags: ['testimonial'],
  });
}

export async function getAbout(): Promise<About | null> {
  return sanityFetch<About | null>({
    query: ABOUT_QUERY,
    revalidate: 3600,
    tags: ['about'],
  });
}
