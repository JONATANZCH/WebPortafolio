import { getProjects, type Language } from '../lib/sanity.queries';
import ProjectsExplorer from './ProjectsExplorer';

export default async function ProjectsGrid({ locale = 'es' }: { locale?: string }) {
  const projects = await getProjects(locale as Language);
  return <ProjectsExplorer projects={projects} />;
}
