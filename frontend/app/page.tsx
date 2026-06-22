import {
  getAbout,
  getProjects,
  getExperience,
  getEducation,
  getTestimonials,
  getBlogPosts,
} from '../lib/sanity.queries';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import ProjectsGrid from '../components/ProjectsGrid';
import ExperienceTimeline from '../components/ExperienceTimeline';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import Link from 'next/link';
import styles from './page.module.css';

export default async function Home() {
  // Fetch all data server-side in parallel
  const [about, projects, experience, education, testimonials, blogPosts] =
    await Promise.all([
      getAbout(),
      getProjects(),
      getExperience(),
      getEducation(),
      getTestimonials(),
      getBlogPosts(),
    ]);

  // Pass the pre-fetched data to components that accept it
  // (ProjectsGrid, ExperienceTimeline, TestimonialsCarousel fetch their own
  //  data internally as async server components; we still call the fetches
  //  here so they are deduped by Next.js fetch cache and land in the same
  //  render pass — no duplicate network requests.)
  void about;
  void projects;
  void experience;
  void education;
  void testimonials;

  const recentPosts = blogPosts.slice(0, 3);

  return (
    <>
      <Navigation />

      <main>
        <Hero />

        <ProjectsGrid />

        <ExperienceTimeline />

        <TestimonialsCarousel />

        {/* Blog preview section */}
        {recentPosts.length > 0 && (
          <section id="blog" className={styles.blogPreview}>
            <div className={styles.blogInner}>
              <div className={styles.blogHeader}>
                <h2 className={styles.blogHeading}>Últimos artículos</h2>
                <Link href="/blog" className={styles.blogSeeAll}>
                  Ver todos →
                </Link>
              </div>
              <ul className={styles.blogGrid} role="list">
                {recentPosts.map((post) => (
                  <li key={post._id}>
                    <BlogCard post={post} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
        {/* Contact section */}
        <section id="contacto" className={styles.contactSection}>
          <div className={styles.contactInner}>
            <h2 className={styles.contactHeading}>Contáctame</h2>
            <p className={styles.contactSubheading}>
              ¿Tienes un proyecto en mente? Cuéntame sobre él.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
