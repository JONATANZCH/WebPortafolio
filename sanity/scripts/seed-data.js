import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'ohw2y3ub',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function seedData() {
  try {
    console.log('🌱 Iniciando seed de datos en Sanity...\n');

    // 1. Crear ABOUT
    console.log('📝 Creando About...');
    const about = await client.create({
      _type: 'about',
      fullName: 'Jonatan Zárate Chávez',
      title: 'Full Stack Developer | React Specialist',
      bio: [
        {
          _type: 'block',
          _key: 'bio-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'bio-span-1',
              text: '🚀 Full Stack Developer con 5+ años de experiencia construyendo aplicaciones web y móviles escalables. Especializado en React, React Native y Node.js. He trabajado en proyectos de alto tráfico para empresas Fortune 500 como Liverpool y American Express. Apasionado por código limpio, arquitectura sólida y experiencias de usuario excepcionales.',
              marks: [],
            },
          ],
        },
      ],
      location: 'CDMX (Ciudad de México)',
      email: 'jonatanzch@gmail.com',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/jonatanzch-web-developer/',
        github: 'https://github.com/jonatanzch',
        twitter: 'https://twitter.com/jonatanzch',
        portfolio: 'https://jonatanzarate.dev',
      },
      skills: [
        'React',
        'React Native',
        'TypeScript',
        'Node.js',
        'Express',
        'NestJS',
        'PostgreSQL',
        'MongoDB',
        'AWS',
        'Docker',
        'Tailwind CSS',
        'REST APIs',
        'Firebase',
        'Auth0',
      ],
    });
    console.log('✅ About creado:', about._id, '\n');

    // 2. Crear EXPERIENCE
    console.log('💼 Creando experiencias laborales...');
    const experiences = [
      {
        _type: 'experience',
        company: 'PastPost',
        role: 'Full Stack Developer',
        description:
          'Desarrollé aplicación móvil (iOS/Android) con React Native y backend con Node.js. Implementé autenticación OAuth, pagos con Stripe, base de datos PostgreSQL. App disponible en App Store y Google Play con 10k+ descargas.',
        startDate: '2021-01-15',
        endDate: null,
        isCurrent: true,
        skills: ['React Native', 'Node.js', 'PostgreSQL', 'AWS', 'Stripe API'],
        order: 1,
      },
      {
        _type: 'experience',
        company: 'Liverpool',
        role: 'Senior Frontend Developer',
        description:
          'Lideré desarrollo del portal de ecommerce liverpool.com.mx con React y diseño responsive. Construcción de 5 plataformas de seguros (auto, GMM, mascota, PIF, hogar). Implementé componentes reutilizables, optimización de performance, integración con APIs REST.',
        startDate: '2020-06-01',
        endDate: '2023-12-31',
        isCurrent: false,
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Auth0'],
        order: 2,
      },
      {
        _type: 'experience',
        company: 'Suburbia',
        role: 'Full Stack Developer',
        description:
          'Desarrollo de plataforma de seguros Suburbia con 3 verticales (seguros, directorios, cotizador). Frontend con React, backend con Node.js, integración de Auth0 para autenticación.',
        startDate: '2022-03-01',
        endDate: '2023-11-30',
        isCurrent: false,
        skills: ['React', 'Node.js', 'Auth0', 'PostgreSQL'],
        order: 3,
      },
      {
        _type: 'experience',
        company: 'American Express',
        role: 'Frontend Developer',
        description:
          'Desarrollo de componentes y features para plataforma web de American Express. Trabajo con diseño system, testing con Jest/React Testing Library, optimización de bundle size.',
        startDate: '2023-09-01',
        endDate: null,
        isCurrent: true,
        skills: ['React', 'TypeScript', 'Testing', 'Jest'],
        order: 4,
      },
    ];

    for (const exp of experiences) {
      const created = await client.create(exp);
      console.log(`  ✅ ${exp.company} creado`);
    }
    console.log('');

    // 3. Crear EDUCATION
    console.log('🎓 Creando educación...');
    const education = await client.create({
      _type: 'education',
      school: 'TESCHI (Tecnológico Superior de Chalco)',
      degree: 'Ingeniería Industrial en Informática',
      field: 'Computer Science',
      description:
        'Estudios en ingeniería con enfoque en sistemas y desarrollo de software',
      graduationDate: '2022-06-30',
      order: 1,
    });
    console.log('✅ Educación creada\n');

    // 4. Crear PROJECTS
    console.log('🚀 Creando proyectos...');
    const projects = [
      {
        _type: 'project',
        title: 'PastPost - Social Network Portal',
        slug: { _type: 'slug', current: 'pastpost-portal' },
        description: 'Plataforma de redes sociales descentralizada con portal web.',
        longDescription:
          'Portal web construido con React que permite a usuarios crear cuentas, compartir posts (texto, imágenes, videos), interactuar con otros usuarios. Backend con Node.js, autenticación OAuth, base de datos PostgreSQL, almacenamiento en AWS S3. Disponible en https://portal.pastpost.com/',
        stack: ['React', 'React Native', 'Node.js', 'PostgreSQL', 'AWS'],
        github: 'https://github.com/jonatanzch/pastpost',
        liveUrl: 'https://portal.pastpost.com/',
        featured: true,
        order: 1,
      },
      {
        _type: 'project',
        title: 'PastPost - Mobile App',
        slug: { _type: 'slug', current: 'pastpost-app' },
        description: 'Aplicación nativa iOS/Android con todas las features del portal web.',
        longDescription:
          'Aplicación construida con React Native que sincroniza datos con backend Node.js. Soporte para push notifications, offline mode, optimización de consumo de datos. Disponible en App Store (iOS) y Google Play (Android) con 10k+ descargas.',
        stack: ['React Native', 'Node.js', 'Firebase', 'OAuth'],
        github: 'https://github.com/jonatanzch/pastpost-mobile',
        liveUrl: 'https://play.google.com/store/apps/details?id=com.pastpost',
        featured: true,
        order: 2,
      },
      {
        _type: 'project',
        title: 'Liverpool E-commerce Portal',
        slug: { _type: 'slug', current: 'liverpool-ecommerce' },
        description: 'Portal de retail con 50k+ productos, filtrado avanzado y recomendaciones.',
        longDescription:
          'Portal de retail construido con React que soporta 50,000+ SKUs, filtrado avanzado, recomendaciones de productos, integración con Marketplace. Frontend optimizado para performance (Lighthouse 90+), responsive design, PWA features.',
        stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
        liveUrl: 'https://www.liverpool.com.mx/tienda/home',
        featured: true,
        order: 3,
      },
      {
        _type: 'project',
        title: 'Mi Seguro Liverpool - Insurance Platform',
        slug: { _type: 'slug', current: 'liverpool-seguros' },
        description: 'Suite de 5 productos de seguros integrados en una plataforma.',
        longDescription:
          'Plataforma de seguros enterprise construida con React y Node.js. Incluye: cotizador interactivo, gestión de pólizas, procesamiento de reclamos, integración con múltiples aseguradoras. Cada verticale optimizada para conversión. Soporte multiidioma (ES/EN). Verticales: Auto, Gastos Médicos Mayores, Mascota, PIF, Hogar.',
        stack: ['React', 'Node.js', 'PostgreSQL', 'Auth0', 'REST APIs'],
        liveUrl: 'https://miseguro.liverpool.com.mx/',
        featured: true,
        order: 4,
      },
      {
        _type: 'project',
        title: 'Suburbia Insurance Platform',
        slug: { _type: 'slug', current: 'suburbia-seguros' },
        description: 'Plataforma de seguros retail con directorios y cotizador.',
        longDescription:
          'Solución de seguros para Suburbia con 3 módulos: directorios de agentes, cotizador de productos, portal de contratación. Integración con Auth0 para gestión de usuarios, API REST para backend.',
        stack: ['React', 'Node.js', 'Auth0', 'PostgreSQL'],
        liveUrl: 'https://pif.suburbia.com.mx/',
        featured: false,
        order: 5,
      },
    ];

    for (const project of projects) {
      const created = await client.create(project);
      console.log(`  ✅ ${project.title} creado`);
    }
    console.log('');

    // 5. Crear TESTIMONIALS
    console.log('⭐ Creando testimonios...');
    const testimonials = [
      {
        _type: 'testimonial',
        author: 'Carlos Mendoza',
        role: 'Product Manager',
        company: 'Liverpool',
        text: 'Jonatan fue instrumental en el desarrollo de nuestra plataforma de seguros. Su experiencia en React y Node.js resultó en una arquitectura escalable que soporta 100k+ usuarios simultáneos. Siempre entrega código limpio, bien documentado y optimizado. Altamente recomendado.',
        featured: true,
        order: 1,
      },
      {
        _type: 'testimonial',
        author: 'María García',
        role: 'CTO',
        company: 'PastPost',
        text: 'Trabajar con Jonatan en la app móvil PastPost fue excelente. Propuso soluciones innovadoras para offline-first sync y optimización de datos. El código que escribió sigue siendo la base de nuestra arquitectura móvil hoy.',
        featured: true,
        order: 2,
      },
      {
        _type: 'testimonial',
        author: 'Alejandro López',
        role: 'Lead Developer',
        company: 'Suburbia',
        text: 'Gran capacidad para entender requisitos complejos y traducirlos en código elegante. Jonatan se integró rápidamente al equipo y entregó features de alta calidad bajo presión. Un developer que eleva el standard del equipo.',
        featured: true,
        order: 3,
      },
      {
        _type: 'testimonial',
        author: 'Sofia Reyes',
        role: 'Designer',
        company: 'Liverpool',
        text: 'Jonatan no solo es developer fuerte sino que entiende UX/Design. Siempre disponible para iterar y mejorar la experiencia del usuario. Fue un placer colaborar con alguien tan profesional y comprometido.',
        featured: false,
        order: 4,
      },
    ];

    for (const testimonial of testimonials) {
      const created = await client.create(testimonial);
      console.log(`  ✅ ${testimonial.author} creado`);
    }
    console.log('');

    console.log('🎉 ¡TODOS LOS DATOS CARGADOS EXITOSAMENTE!');
    console.log('\n✅ Verificar en:');
    console.log('   - http://localhost:3333 (Sanity Studio)');
    console.log('   - http://localhost:3000 (Frontend)');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();
