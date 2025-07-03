import * as React from 'react';
import Image from 'next/image';
import Button from '../components/Button';
import FeatureCard from '../components/FeatureCard';

export default function Page() {
  // Get the server identifier from environment variable
  const serverId = process.env.NEXT_PUBLIC_CUSTOM_TEXT || 'Unknown Server';

  // Get the port from environment variable (use NEXT_PUBLIC_PORT)
  const serverPort = process.env.NEXT_PUBLIC_PORT || '3000';

  console.log({ serverPort });

  return (
    <div>
      {/* Sección de inicio */}
      <section className='bg-emerald-50 relative overflow-hidden' id='inicio'>
        {/* Contenido principal de la sección */}
        <div className='bg-emerald-700 text-white shadow-lg max-w-[400px] mx-auto mt-4 rounded-2xl'>
          <div className='container mx-auto px-4 py-2'>
            <p className='text-sm text-center'>
              Has sido asignado a: <span className='font-bold'>{serverId}</span>
            </p>
            <p className='text-xs text-center text-emerald-100'>
              Puerto: <span className='font-bold'>{serverPort}</span>
            </p>
          </div>
        </div>
        <div className='py-6 pb-12 md:pb-20 lg:pb-24 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl md:grid-cols-2 items-center grid grid-cols-1 gap-8'>
          {/* Texto principal */}
          <div className='text-center md:text-left'>
            <p className='text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-800 leading-tight'>
              ¡Transforma el aprendizaje en una aventura épica!
            </p>
            <p className='mt-4 text-xl text-gray-600 max-w-2xl'>
              Course Clash gamifica la experiencia académica con duelos, logros,
              rangos y personalización. ¡Aprende mientras compites y te
              diviertes!
            </p>
            <div
              className='mt-8 sm:flex-row md:justify-start sm:space-y-0 sm:space-x-4 justify-center flex flex-col
                space-y-4'
            >
              <Button href='/registro' variant='primary'>
                Empezar Ahora
              </Button>
              {/* <Button href='/#' variant='secondary'>
                Ver demo
              </Button> */}
            </div>
          </div>
          {/* Imagen principal */}
          <div className='justify-center md:justify-end relative flex'>
            <Image
              alt='Estudiantes participando en duelos académicos y ganando medallas'
              src='/images/landing.webp'
              className='rounded-lg shadow-xl'
              width={600}
              height={400}
            />
            <div className='bg-white rounded-lg shadow-lg items-center absolute -bottom-6 -left-6 p-4 flex space-x-3 border-l-4 border-emerald-500'>
              <div className='bg-emerald-100 rounded-full p-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-emerald-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div>
                <p className='text-xs text-gray-500'>Nuestros estudiantes</p>
                <p className='text-sm font-semibold text-gray-800'>
                  Aprenden Jugando
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Patron visual de decoración en el fondo 1 */}
        <div className='lg:block absolute top-0 right-0 -mt-20 -mr-20 hidden'>
          <svg
            width='404'
            height='404'
            fill='none'
            viewBox='0 0 404 404'
            className=''
            id='Windframe_VUKtvTKgL'
          >
            <defs>
              <pattern
                id='pattern-1'
                x='0'
                y='0'
                width='20'
                height='20'
                patternUnits='userSpaceOnUse'
              >
                <rect
                  x='0'
                  y='0'
                  width='4'
                  height='4'
                  fill='rgba(16, 185, 129, 0.1)'
                />
              </pattern>
            </defs>
            <rect width='404' height='404' fill='url(#pattern-1)' />
          </svg>
        </div>
        {/* Patron visual de decoración en el fondo 2 */}
        <div className='lg:block absolute bottom-0 left-0 -mb-20 -ml-20 hidden'>
          <svg width='404' height='404' fill='none' viewBox='0 0 404 404'>
            <defs>
              <pattern
                id='pattern-2'
                x='0'
                y='0'
                width='20'
                height='20'
                patternUnits='userSpaceOnUse'
              >
                <rect
                  x='0'
                  y='0'
                  width='4'
                  height='4'
                  fill='rgba(16, 185, 129, 0.1)'
                />
              </pattern>
            </defs>
            <rect width='404' height='404' fill='url(#pattern-2)' />
          </svg>
        </div>
      </section>
      {/* Sección de características */}
      <section className='py-16 bg-white' id='caracteristicas'>
        {/* Contenido de la sección con márgenes */}
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          {/* Titulo de la sección */}
          <div className='text-center'>
            <p className='text-3xl font-extrabold text-emerald-800 sm:text-4xl'>
              Características de Course Clash
            </p>
            <p className='mt-4 text-lg text-gray-600 max-w-4xl mx-auto'>
              Transforma tu experiencia de aprendizaje tradicional en una
              aventura interactiva y emocionante.
            </p>
          </div>
          {/* Grid de características */}
          <div className='mt-16 flex flex-col md:flex-row gap-8'>
            {/* <FeatureCard
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-emerald-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              }
              title='Sistema de Logros y Medallas'
              description='Colecciona insignias y medallas por completar tareas, obtener buenas calificaciones y participar activamente en el curso.'
              color='emerald'
              tags={['Motivación', 'Reconocimiento']}
            /> */}
            <FeatureCard
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-purple-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              }
              title='Duelos Académicos'
              description='Desafía a tus compañeros a competir en duelos de conocimiento para reforzar lo aprendido de forma divertida y competitiva.'
              color='purple'
              tags={['Competitivo', 'Aprendizaje activo']}
            />
            {/* <FeatureCard
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-blue-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              }
              title='Moneda Virtual'
              description='Gana monedas virtuales por tus logros académicos y cámbialas por ventajas como exenciones de exámenes o recursos adicionales.'
              color='blue'
              tags={['Recompensas', 'Incentivos']}
            /> */}
            <FeatureCard
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-amber-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              }
              title='Sistema de Rangos'
              description='Progresa a través de diferentes niveles académicos, desde Novato hasta Maestro, desbloqueando nuevas habilidades y privilegios.'
              color='amber'
              tags={['Progresión', 'Status']}
            />
            {/* <FeatureCard
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-red-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
                  />
                </svg>
              }
              title='Personalización de Perfil'
              description='Personaliza tu avatar, banner y tarjeta de estudiante para mostrar tus logros y expresar tu personalidad.'
              color='red'
              tags={['Identidad', 'Expresión']}
            /> */}
            {/* <FeatureCard
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='h-6 w-6 text-stone-500'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
                  ></path>
                </svg>
              }
              title='Misiones y Desafíos'
              description='Completa misiones diarioas y desafíos semanales para obtener recompensas exclusivas.'
              color='stone'
              tags={['Constancia', 'Objetivos']}
            /> */}
          </div>
        </div>
      </section>
      {/* Sección de cómo funciona */}
      <section className='py-16 bg-emerald-50'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='text-center mb-16'>
            <p className='text-3xl font-extrabold text-emerald-800 sm:text-4xl'>
              ¿Cómo funciona Course Clash?
            </p>
            <p className='mt-4 text-xl text-gray-600 mx-auto max-w-3xl'>
              Un vistazo al proceso de aprendizaje gamificado que revoluciona la
              educación tradicional.
            </p>
          </div>
          <div className='relative'>
            <div className='md:grid-cols-4 grid grid-cols-1 gap-8'>
              <div className='items-center flex flex-col relative'>
                <div
                  className='w-16 h-16 bg-emerald-600 rounded-full items-center justify-center text-white text-2xl font-bold
                mb-4 flex z-10'
                >
                  1
                </div>
                <p className='text-xl font-bold text-emerald-700 mb-2 text-center'>
                  Crear cuenta
                </p>
                <p className='text-gray-600 text-center'>
                  Regístrate, personaliza tu perfil y comienza a explorar los
                  cursos disponibles.
                </p>
              </div>
              <div className='items-center flex flex-col relative'>
                <div
                  className='w-16 h-16 bg-emerald-600 rounded-full items-center justify-center text-white text-2xl font-bold
                mb-4 flex z-10'
                >
                  2
                </div>
                <p className='text-xl font-bold text-emerald-700 mb-2 text-center'>
                  Unirse a cursos
                </p>
                <p className='text-gray-600 text-center'>
                  Únete a tus cursos y conecta con profesores y compañeros de
                  clase.
                </p>
              </div>
              <div className='items-center flex flex-col relative'>
                <div
                  className='w-16 h-16 bg-emerald-600 rounded-full items-center justify-center text-white text-2xl font-bold
                mb-4 flex z-10'
                >
                  3
                </div>
                <p className='text-xl font-bold text-emerald-700 mb-2 text-center'>
                  Participar activamente
                </p>
                <p className='text-gray-600 text-center'>
                  Completa tareas, participa en duelos y desafíos para ganar
                  puntos y monedas.
                </p>
              </div>
              <div className='items-center flex flex-col relative'>
                <div
                  className='w-16 h-16 bg-emerald-600 rounded-full items-center justify-center text-white text-2xl font-bold
                mb-4 flex z-10'
                >
                  4
                </div>
                <p className='text-xl font-bold text-emerald-700 mb-2 text-center'>
                  Subir de nivel
                </p>
                <p className='text-gray-600 text-center'>
                  Desbloquea logros, sube de rango y canjea monedas por
                  recompensas especiales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Sección de testimonios */}
      <section className='py-16 bg-white' id='testimonios'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='text-center'>
            <p className='text-3xl font-extrabold text-emerald-800 sm:text-4xl'>
              Lo que dicen nuestros usuarios
            </p>
            <p className='mt-4 text-xl text-gray-600 mx-auto max-w-3xl'>
              Descubre cómo Course Clash está cambiando la forma en que
              estudiantes y profesores experimentan la educación.
            </p>
          </div>
          <div className='mt-16 md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-8'>
            <div className='bg-emerald-50 rounded-lg shadow-md p-6 relative'>
              <div className='absolute -top-6 left-1/2 transform -translate-x-1/2'>
                {/* <Image
                  alt='Foto de Maria, estudiante universitaria'
                  src='https://placehold.co/100x100/emerald/white?text=Maria'
                  className='border-4 border-white w-12 h-12
                rounded-full shadow-md'
                /> */}
              </div>
              <div className='pt-6'>
                <p className='text-gray-700 mb-4'>
                  &quot;Desde que empecé a usar Course Clash, mis calificaciones
                  han mejorado notablemente. Los duelos académicos me motivan a
                  estudiar más y los logros me dan una sensación de
                  progreso.&quot;
                </p>
                <div className='items-center justify-between flex'>
                  <div>
                    <p className='font-semibold text-emerald-800'>
                      María Rodríguez
                    </p>
                    <p className='text-sm text-gray-500'>
                      Estudiante universitaria
                    </p>
                  </div>
                  <div className='text-emerald-500 flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_uHQFZksOC'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_rrL43BmHs'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_p5dgUUcen'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_Ek85BkstA'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-emerald-50 rounded-lg shadow-md p-6 relative'>
              <div className='absolute -top-6 left-1/2 transform -translate-x-1/2'>
                {/* <Image
                  alt='Foto de Carlos, profesor de matemáticas'
                  src='https://placehold.co/100x100/emerald/white?text=Carlos'
                  className='border-4 border-white w-12 h-12 rounded-full shadow-md'
                /> */}
              </div>
              <div className='pt-6'>
                <p className='text-gray-700 mb-4'>
                  &quot;Como profesor, Course Clash me ha permitido hacer mis
                  clases mucho más dinámicas. El sistema de duelos y recompensas
                  ha incrementado la participación de mis alumnos
                  significativamente.&quot;
                </p>
                <div className='items-center justify-between flex'>
                  <div>
                    <p className='font-semibold text-emerald-800'>
                      Carlos Méndez
                    </p>
                    <p className='text-sm text-gray-500'>
                      Profesor de matemáticas
                    </p>
                  </div>
                  <div className='text-emerald-500 flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_8Bob4lfWN'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_2zrSCy3S3'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_nEBOEsTpb'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_H9rmX21Hm'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_XPVLDhO3l'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-emerald-50 rounded-lg shadow-md p-6 relative'>
              <div className='absolute -top-6 left-1/2 transform -translate-x-1/2'>
                {/* <Image
                  alt='Foto de Laura, directora de instituto'
                  src='https://placehold.co/100x100/emerald/white?text=Laura'
                  className='border-4 border-white w-12 h-12 rounded-full shadow-md'
                /> */}
              </div>
              <div className='pt-6'>
                <p className='text-gray-700 mb-4'>
                  &quot;Implementar Course Clash en nuestro instituto ha sido
                  una decisión acertada. El entusiasmo de los estudiantes ha
                  aumentado y los resultados académicos generales han
                  mejorado.&quot;
                </p>
                <div className='items-center justify-between flex'>
                  <div>
                    <p className='font-semibold text-emerald-800'>
                      Laura Gutiérrez
                    </p>
                    <p className='text-sm text-gray-500'>
                      Directora de instituto
                    </p>
                  </div>
                  <div className='text-emerald-500 flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_No2pCmIXz'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_HR0hvmgTH'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_J60tz519l'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_B7fBLPn7K'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_LmZ2UNNFz'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Sección de precios */}
      {/* <section className='py-16 bg-emerald-50' id='precios'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='text-center'>
            <p className='text-3xl font-extrabold text-emerald-800 sm:text-4xl'>
              Planes y precios
            </p>
            <p className='mt-4 text-xl text-gray-600 mx-auto max-w-3xl'>
              Elige el plan que mejor se adapte a las necesidades de tu
              institución educativa.
            </p>
          </div>
          <div className='mt-16 md:grid-cols-3 grid grid-cols-1 gap-8'>
            <div
              className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform
            hover:-translate-y-2 duration-300'
            >
              <div className='bg-emerald-600 h-2'></div>
              <div className='p-6'>
                <p className='text-2xl font-bold text-emerald-700 mb-4'>
                  Básico
                </p>
                <div className='items-baseline mb-6 flex'>
                  <span className='text-5xl font-extrabold text-gray-900'>
                    $49
                  </span>
                  <span className='text-gray-500 ml-1'>/mes</span>
                </div>
                <p className='text-gray-600 mb-6'>
                  Ideal para pequeñas clases o tutores individuales que desean
                  comenzar con la gamificación.
                </p>
                <ul className='mb-8 space-y-4'>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_7LZQ6jxbe'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>Hasta 50 estudiantes</span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_DYPYmCaef'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>
                      Sistema de logros básicos
                    </span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_bEY4gaMdH'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>Duelos académicos</span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_vhqqoZGAE'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>Soporte por email</span>
                  </li>
                </ul>
                <a
                  href='/zowx8RNNrpnW15CxET0F#'
                  className='w-full bg-emerald-600 text-white text-center py-3 rounded-md
                font-medium block hover:bg-emerald-700 transition-colors duration-300'
                >
                  Comenzar prueba gratuita
                </a>
              </div>
            </div>
            <div
              className='bg-white rounded-lg shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all
            duration-300 border-2 border-emerald-500 relative z-10 scale-105'
            >
              <div
                className='bg-emerald-500 text-white py-1 px-4 rounded-bl-lg font-semibold text-sm absolute top-0
              right-0'
              >
                MÁS POPULAR
              </div>
              <div className='bg-emerald-600 h-2'></div>
              <div className='p-6'>
                <p className='text-2xl font-bold text-emerald-700 mb-4'>
                  Profesional
                </p>
                <div className='items-baseline mb-6 flex'>
                  <span className='text-5xl font-extrabold text-gray-900'>
                    $99
                  </span>
                  <span className='text-gray-500 ml-1'>/mes</span>
                </div>
                <p className='text-gray-600 mb-6'>
                  Perfecto para escuelas medianas que buscan una experiencia de
                  gamificación completa.
                </p>
                <ul className='mb-8 space-y-4'>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_IEqsT96l9'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>Hasta 500 estudiantes</span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_CizLEM1P5'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>
                      Sistema completo de logros y rangos
                    </span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_kb25ApirD'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>
                      Tienda virtual de recompensas
                    </span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_ueewEfufk'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>
                      Personalización de avatares
                    </span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_wjnPftGKL'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>Soporte prioritario</span>
                  </li>
                </ul>
                <a
                  href='/zowx8RNNrpnW15CxET0F#'
                  className='w-full bg-emerald-600 text-white text-center py-3 rounded-md
                font-medium block hover:bg-emerald-700 transition-colors duration-300'
                >
                  Comenzar prueba gratuita
                </a>
              </div>
            </div>
            <div
              className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform
            hover:-translate-y-2 duration-300'
            >
              <div className='bg-emerald-600 h-2'></div>
              <div className='p-6'>
                <p className='text-2xl font-bold text-emerald-700 mb-4'>
                  Institucional
                </p>
                <div className='items-baseline mb-6 flex'>
                  <span className='text-5xl font-extrabold text-gray-900'>
                    $299
                  </span>
                  <span className='text-gray-500 ml-1'>/mes</span>
                </div>
                <p className='text-gray-600 mb-6'>
                  La solución definitiva para universidades y grandes
                  instituciones educativas.
                </p>
                <ul className='mb-8 space-y-4'>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_z63Z8pjSG'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>Usuarios ilimitados</span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_PJa6bG7eO'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>
                      Personalización institucional
                    </span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_1WcFVs6Xl'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>API completa</span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_DaoVlQW1F'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>
                      Integraciones LMS avanzadas
                    </span>
                  </li>
                  <li className='items-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-emerald-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      id='Windframe_4QDzPgaQ7'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span className='text-gray-700'>Soporte dedicado 24/7</span>
                  </li>
                </ul>
                <a
                  href='/zowx8RNNrpnW15CxET0F#'
                  className='w-full bg-emerald-600 text-white text-center py-3 rounded-md
                font-medium block hover:bg-emerald-700 transition-colors duration-300'
                >
                  Contactar ventas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* Sección de solicitar demo */}
      {/* <section className='bg-emerald-700 py-16'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='bg-emerald-800 rounded-lg shadow-xl overflow-hidden'>
            <div className='px-6 py-12 sm:px-12 lg:py-16 lg:pr-0 xl:py-20 xl:px-20'>
              <div className='lg:flex'>
                <div className='lg:w-1/2'>
                  <p className='text-3xl font-extrabold text-white sm:text-4xl'>
                    Prepárate para revolucionar el aprendizaje
                  </p>
                  <p className='mt-6 text-xl text-emerald-100 max-w-3xl'>
                    Únete a los miles de educadores que están transformando sus
                    aulas con Course Clash. ¡Pruébalo gratis durante 30 días!
                  </p>
                  <div className='mt-8 sm:flex-row flex flex-col gap-4'>
                    <a
                      href='/zowx8RNNrpnW15CxET0F#'
                      className='items-center justify-center px-5 py-3 text-base font-medium
                    rounded-md text-emerald-700 bg-white inline-flex border border-transparent hover:bg-gray-50
                    transition-colors duration-300'
                    >
                      Solicitar demo
                    </a>
                    <Button
                      href='/#'
                      variant='secondary'
                      className='text-white border-white hover:bg-emerald-600 hover:text-white'
                    >
                      Conocer más
                    </Button>
                  </div>
                </div>
                <div className='mt-10 lg:mt-0 lg:w-1/2 lg:flex-grow lg:flex lg:items-center lg:justify-end'>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* Sección de preguntas frecuentes */}
      {/* <section className='py-16 bg-white'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='text-center'>
            <p className='text-3xl font-extrabold text-emerald-800 sm:text-4xl'>
              Preguntas frecuentes
            </p>
            <p className='mt-4 text-xl text-gray-600 mx-auto max-w-3xl'>
              Encuentra respuestas a las dudas más comunes sobre Course Clash.
            </p>
          </div>
          <div className='mt-12 mx-auto space-y-6 max-w-3xl'>
            <div className='bg-emerald-50 rounded-lg shadow-md p-6'>
              <p className='text-lg font-semibold text-emerald-800 mb-2'>
                ¿Cómo se integra Course Clash con otros LMS?
              </p>
              <p className='text-gray-600'>
                Course Clash se integra fácilmente con sistemas como Moodle,
                Canvas y Google Classroom a través de nuestra API. Ofrecemos
                plugins específicos para las plataformas más populares y soporte
                técnico para configurar integraciones personalizadas.
              </p>
            </div>
            <div className='bg-emerald-50 rounded-lg shadow-md p-6'>
              <p className='text-lg font-semibold text-emerald-800 mb-2'>
                ¿Cuánto tiempo lleva implementar Course Clash?
              </p>
              <p className='text-gray-600'>
                La implementación básica puede completarse en 1-2 días. Para
                integraciones más complejas o personalización institucional, el
                proceso puede tomar entre 1-2 semanas. Nuestro equipo de soporte
                te guiará durante todo el proceso.
              </p>
            </div>
            <div className='bg-emerald-50 rounded-lg shadow-md p-6'>
              <p className='text-lg font-semibold text-emerald-800 mb-2'>
                ¿Pueden los profesores crear sus propios desafíos y recompensas?
              </p>
              <p className='text-gray-600'>
                ¡Absolutamente! Los profesores tienen control total para crear
                desafíos personalizados, establecer recompensas específicas y
                diseñar duelos académicos adaptados al contenido de sus cursos.
              </p>
            </div>
            <div className='bg-emerald-50 rounded-lg shadow-md p-6'>
              <p className='text-lg font-semibold text-emerald-800 mb-2'>
                ¿Course Clash es accesible para estudiantes con discapacidades?
              </p>
              <p className='text-gray-600'>
                Sí, hemos diseñado Course Clash siguiendo las pautas WCAG 2.1
                para garantizar que sea accesible para todos los estudiantes,
                incluyendo aquellos con diversas discapacidades. Trabajamos
                continuamente para mejorar la accesibilidad.
              </p>
            </div>
            <div className='bg-emerald-50 rounded-lg shadow-md p-6'>
              <p className='text-lg font-semibold text-emerald-800 mb-2'>
                ¿Qué tipo de soporte ofrecen?
              </p>
              <p className='text-gray-600'>
                Ofrecemos soporte por email para todos los planes, soporte
                prioritario para el plan Profesional y soporte dedicado 24/7
                para el plan Institucional. También proporcionamos recursos de
                autoayuda, webinars y capacitación personalizada.
              </p>
            </div>
          </div>
        </div>
      </section> */}
      {/* Sección de contacto */}
      {/* <section className='py-16 bg-emerald-50' id='contacto'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='md:grid-cols-2 grid grid-cols-1 gap-10'>
            <div>
              <p className='text-3xl font-extrabold text-emerald-800 sm:text-4xl mb-6'>
                Contáctanos
              </p>
              <p className='text-lg text-gray-600 mb-8'>
                ¿Tienes alguna pregunta o necesitas más información? Nuestro
                equipo está listo para ayudarte a transformar la experiencia
                educativa.
              </p>
              <div className='space-y-6'>
                <div className='items-start flex'>
                  <div className='flex-shrink-0'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-emerald-600 mt-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                      id='Windframe_lDobGZupx'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      ></path>
                    </svg>
                  </div>
                  <div className='ml-3 text-gray-700'>
                    <p className='text-lg font-medium'>Email</p>
                    <p>cramirezmun@unal.edu.co</p>
                  </div>
                </div>
                <div className='items-start flex'>
                  <div className='flex-shrink-0'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-emerald-600 mt-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                      id='Windframe_KOFVMGx20'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                      ></path>
                    </svg>
                  </div>
                  <div className='ml-3 text-gray-700'>
                    <p className='text-lg font-medium'>Teléfono</p>
                    <p>+57 300 214 67 46</p>
                  </div>
                </div>
              </div>
              <div className='mt-8 flex space-x-6'>
                <a
                  href='/zowx8RNNrpnW15CxET0F#'
                  className='text-emerald-600 hover:text-emerald-500'
                >
                  <span className='sr-only'>Facebook</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    id='Windframe_i3PqNyBOX'
                  >
                    <path
                      fillRule='evenodd'
                      d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </a>
                <a
                  href='/zowx8RNNrpnW15CxET0F#'
                  className='text-emerald-600 hover:text-emerald-500'
                >
                  <span className='sr-only'>Twitter</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    id='Windframe_16x4N3fDx'
                  >
                    <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84'></path>
                  </svg>
                </a>
                <a
                  href='/zowx8RNNrpnW15CxET0F#'
                  className='text-emerald-600 hover:text-emerald-500'
                >
                  <span className='sr-only'>Instagram</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    id='Windframe_KjUXQce9r'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </a>
                <a
                  href='/zowx8RNNrpnW15CxET0F#'
                  className='text-emerald-600 hover:text-emerald-500'
                >
                  <span className='sr-only'>LinkedIn</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    id='Windframe_xLMmBw3bc'
                  >
                    <path
                      fillRule='evenodd'
                      d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <form className='bg-white shadow-md rounded-lg p-8'>
                <div className='mb-6'>
                  <label
                    htmlFor='name'
                    className='text-gray-700 font-medium mb-2 block'
                  >
                    Nombre
                  </label>
                  <input
                    name='name'
                    type='text'
                    placeholder='Tu nombre completo'
                    className='border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full px-4 py-3
                  rounded-md'
                    id='name'
                  />
                </div>
                <div className='mb-6'>
                  <label
                    htmlFor='email'
                    className='text-gray-700 font-medium mb-2 block'
                  >
                    Email
                  </label>
                  <input
                    name='email'
                    type='email'
                    placeholder='tu@email.com'
                    className='border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full px-4 py-3
                  rounded-md'
                    id='email'
                  />
                </div>
                <div className='mb-6'>
                  <label
                    htmlFor='subject'
                    className='text-gray-700 font-medium mb-2 block'
                  >
                    Asunto
                  </label>
                  <input
                    name='subject'
                    type='text'
                    placeholder='¿Cómo podemos ayudarte?'
                    className='border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full px-4 py-3
                  rounded-md'
                    id='subject'
                  />
                </div>
                <div className='mb-6'>
                  <label
                    htmlFor='message'
                    className='text-gray-700 font-medium mb-2 block'
                  >
                    Mensaje
                  </label>
                  <textarea
                    name='message'
                    rows={4}
                    placeholder='Cuéntanos más sobre tus necesidades...'
                    className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2
                  focus:ring-emerald-500 focus:border-transparent'
                    id='message'
                  ></textarea>
                </div>
                <button
                  type='submit'
                  className='hover:bg-emerald-700 transition-colors duration-300 w-full bg-emerald-600
                text-white py-3 px-4 rounded-md font-medium'
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
