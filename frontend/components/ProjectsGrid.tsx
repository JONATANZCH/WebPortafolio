import { getProjects } from '../lib/sanity.queries';
import ProjectCard from './ProjectCard';
import styles from './ProjectsGrid.module.css';

// Bento layout rules:
//  - Slot 0: featured card, spans 2 rows on the left
//  - Slots 1-4: up to 4 regular cards, 2×2 grid on the right
//  - Slot 5+: "+more" card occupying the last slot if there are more than 5 projects

export default async function ProjectsGrid() {
  const projects = await getProjects();

  const featured = projects[0] ?? null;
  const regular = projects.slice(1, 5);
  const extraCount = projects.length > 5 ? projects.length - 5 : 0;

  return (
    <section id="proyectos" className={styles.section} aria-labelledby="projects-heading">
      <div className={styles.inner}>
        {/* Section heading */}
        <div className={styles.headingRow}>
          <h2 className={styles.heading} id="projects-heading">
            <span className={styles.headingAccent}>Proyectos</span>
          </h2>
          <p className={styles.subheading}>
            Una selección de los proyectos que he construido.
          </p>
        </div>

        {/* Bento grid */}
        {projects.length === 0 ? (
          <p className={styles.empty}>Próximamente...</p>
        ) : (
          <div className={styles.grid}>
            {/* Featured: left column, 2 rows tall */}
            {featured && (
              <div className={styles.featuredSlot}>
                <ProjectCard variant="featured" project={featured} />
              </div>
            )}

            {/* Right column: 2×2 regular cards */}
            <div className={styles.regularSlots}>
              {regular.map((project) => (
                <ProjectCard key={project._id} variant="regular" project={project} />
              ))}

              {/* "+more" card fills the last slot when there are extra projects */}
              {extraCount > 0 && (
                <ProjectCard variant="more" count={extraCount} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
