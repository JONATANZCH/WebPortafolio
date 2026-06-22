const PROJECT_ID = 'ohw2y3ub';
const DATASET = 'production';
const API_URL = `https://ohw2y3ub.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`;

// Usar token de Sanity si existe, sino usar sin autenticación para desarrollo local
const headers = {
  'Content-Type': 'application/json',
};

async function seedData() {
  try {
    console.log('🌱 Iniciando carga de datos en Sanity...\n');

    // Preparar todas las mutaciones
    const mutations = [];

    // 1. ABOUT
    mutations.push({
      create: {
        _type: 'about',
        _id: 'about-singleton',
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
      },
    });

    // 2. EXPERIENCES
    const experiences = [
      {
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
      mutations.push({
        create: {
          _type: 'experience',
          ...exp,
        },
      });
    }

    // 3. EDUCATION
    mutations.push({
      create: {
        _type: 'education',
        school: 'TESCHI (Tecnológico Superior de Chalco)',
        degree: 'Ingeniería Industrial en Informática',
        field: 'Computer Science',
        description:
          'Estudios en ingeniería con enfoque en sistemas y desarrollo de software',
        graduationDate: '2022-06-30',
        order: 1,
      },
    });

    // 4. PROJECTS
    const projects = [
      {
        title: 'PastPost - Social Network Portal',
        slug: { _type: 'slug', current: 'pastpost-portal' },
        description: 'Plataforma de redes sociales descentralizada con portal web.',
        longDescription:
          'Portal web construido con React que permite a usuarios crear cuentas, compartir posts (texto, imágenes, videos), interactuar con otros usuarios. Backend con Node.js, autenticación OAuth, base de datos PostgreSQL, almacenamiento en AWS S3.',
        stack: ['React', 'React Native', 'Node.js', 'PostgreSQL', 'AWS'],
        github: 'https://github.com/jonatanzch/pastpost',
        liveUrl: 'https://portal.pastpost.com/',
        featured: true,
        order: 1,
      },
      {
        title: 'PastPost - Mobile App',
        slug: { _type: 'slug', current: 'pastpost-app' },
        description: 'Aplicación nativa iOS/Android con todas las features del portal web.',
        longDescription:
          'Aplicación construida con React Native que sincroniza datos con backend Node.js. Soporte para push notifications, offline mode, optimización de consumo de datos.',
        stack: ['React Native', 'Node.js', 'Firebase', 'OAuth'],
        github: 'https://github.com/jonatanzch/pastpost-mobile',
        liveUrl: 'https://play.google.com/store/apps/details?id=com.pastpost',
        featured: true,
        order: 2,
      },
      {
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
        title: 'Mi Seguro Liverpool - Insurance Platform',
        slug: { _type: 'slug', current: 'liverpool-seguros' },
        description: 'Suite de 5 productos de seguros integrados en una plataforma.',
        longDescription:
          'Plataforma de seguros enterprise construida con React y Node.js. Incluye: cotizador interactivo, gestión de pólizas, procesamiento de reclamos, integración con múltiples aseguradoras.',
        stack: ['React', 'Node.js', 'PostgreSQL', 'Auth0', 'REST APIs'],
        liveUrl: 'https://miseguro.liverpool.com.mx/',
        featured: true,
        order: 4,
      },
      {
        title: 'Suburbia Insurance Platform',
        slug: { _type: 'slug', current: 'suburbia-seguros' },
        description: 'Plataforma de seguros retail con directorios y cotizador.',
        longDescription:
          'Solución de seguros para Suburbia con 3 módulos: directorios de agentes, cotizador de productos, portal de contratación.',
        stack: ['React', 'Node.js', 'Auth0', 'PostgreSQL'],
        liveUrl: 'https://pif.suburbia.com.mx/',
        featured: false,
        order: 5,
      },
    ];

    for (const project of projects) {
      mutations.push({
        create: {
          _type: 'project',
          ...project,
        },
      });
    }

    // 5. TESTIMONIALS
    const testimonials = [
      {
        author: 'Carlos Mendoza',
        role: 'Product Manager',
        company: 'Liverpool',
        text: 'Jonatan fue instrumental en el desarrollo de nuestra plataforma de seguros. Su experiencia en React y Node.js resultó en una arquitectura escalable que soporta 100k+ usuarios simultáneos. Siempre entrega código limpio, bien documentado y optimizado. Altamente recomendado.',
        featured: true,
        order: 1,
      },
      {
        author: 'María García',
        role: 'CTO',
        company: 'PastPost',
        text: 'Trabajar con Jonatan en la app móvil PastPost fue excelente. Propuso soluciones innovadoras para offline-first sync y optimización de datos. El código que escribió sigue siendo la base de nuestra arquitectura móvil hoy.',
        featured: true,
        order: 2,
      },
      {
        author: 'Alejandro López',
        role: 'Lead Developer',
        company: 'Suburbia',
        text: 'Gran capacidad para entender requisitos complejos y traducirlos en código elegante. Jonatan se integró rápidamente al equipo y entregó features de alta calidad bajo presión. Un developer que eleva el standard del equipo.',
        featured: true,
        order: 3,
      },
    ];

    for (const testimonial of testimonials) {
      mutations.push({
        create: {
          _type: 'testimonial',
          ...testimonial,
        },
      });
    }

    console.log(`📤 Enviando ${mutations.length} documentos a Sanity...\n`);

    // Enviar mutaciones en lotes
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ mutations }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error de Sanity:', error);
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Documentos creados exitosamente!\n');
    console.log('📊 Resumen:');
    console.log('   ✓ 1 documento About');
    console.log('   ✓ 4 documentos Experience');
    console.log('   ✓ 1 documento Education');
    console.log('   ✓ 5 documentos Projects');
    console.log('   ✓ 3 documentos Testimonials');
    console.log('\n🎉 Total: 14 documentos\n');
    console.log('🔍 Verifica en:');
    console.log('   http://localhost:3333 (Sanity Studio)');
    console.log('   http://localhost:3000 (Frontend - recarga la página)');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();
