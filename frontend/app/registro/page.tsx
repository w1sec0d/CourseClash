import Button from '@/components/Button';
import SocialIcon from '@/components/SocialIcon';
import Image from 'next/image';
import Link from 'next/link';

export default function Register() {
  return (
    <section className='py-4 px-4 sm:px-6 lg:px-8 text-black mx-auto container bg-white rounded-2xl overflow-hidden max-w-7xl md:grid-cols-2 grid grid-cols-1'>
      {/* Sección de ilustración */}
      <div className='bg-emerald-50 justify-center items-center w-full p-10 flex flex-col relative overflow-hidden'>
        {/* Decoraciones */}
        <div className='w-40 h-40 bg-emerald-100 rounded-full absolute -top-10 -right-10 opacity-60'></div>
        <div className='w-32 h-32 bg-emerald-200 rounded-full absolute bottom-20 -left-10 opacity-60'></div>
        {/* Texto */}
        <div className='text-center relative z-10'>
          <Image
            alt='Ilustración de estudiantes compitiendo en duelos académicos con insignias y trofeos'
            src='/images/register.webp'
            className='mx-auto mb-6 rounded-lg shadow-md'
            width={400}
            height={300}
          />
          <p className='text-2xl font-bold text-emerald-800 mb-4'>
            Transforma tu experiencia académica
          </p>
          {/* Lista de beneficios */}
          <ul className='text-left mb-6 space-y-3'>
            <li className='items-start flex'>
              <svg
                className='h-6 w-6 text-emerald-500 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                id='Windframe_3LsC3trV6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
              <span>Gana insignias y logros por tus avances</span>
            </li>
            <li className='items-start flex'>
              <svg
                className='h-6 w-6 text-emerald-500 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                id='Windframe_N5EeJ5ivQ'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
              <span>Participa en duelos académicos y sube de rango</span>
            </li>
            <li className='items-start flex'>
              <svg
                className='h-6 w-6 text-emerald-500 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                id='Windframe_7FjJpLY1r'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
              <span>Acumula monedas virtuales para ventajas exclusivas</span>
            </li>
            <li className='items-start flex'>
              <svg
                className='h-6 w-6 text-emerald-500 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                id='Windframe_LBmv9SWij'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
              <span>Personaliza tu perfil y muestra tus logros</span>
            </li>
          </ul>
        </div>
      </div>
      {/* Sección de formulario */}
      <div className='lg:p-12 w-full p-8'>
        <div className='mx-auto max-w-md'>
          <p className='text-3xl font-extrabold text-emerald-800 mb-2'>
            Crea tu cuenta
          </p>
          <p className='text-gray-600 mb-8'>
            ¡Únete a Course Clash y comienza tu aventura académica!
          </p>
          <div className='mb-6 space-y-3'>
            <SocialIcon icon='google' />
            <SocialIcon icon='facebook' />
          </div>
          <div className='my-6 relative'>
            <div className='items-center absolute inset-0 flex'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='justify-center text-sm relative flex'>
              <span className='px-2 bg-white text-gray-500'>
                O regístrate con email
              </span>
            </div>
          </div>
          <form className='space-y-6'>
            <div className='md:grid-cols-2 grid grid-cols-1 gap-6'>
              <div>
                <label
                  htmlFor='first_name'
                  className='text-sm font-medium text-gray-700 mb-1 block'
                >
                  Nombre
                </label>
                <input
                  name='first_name'
                  type='text'
                  className='border border-gray-300 focus:ring-emerald-500
                      focus:border-emerald-500 w-full px-4 py-2 rounded-lg'
                  id='first_name'
                />
              </div>
              <div>
                <label
                  htmlFor='last_name'
                  className='text-sm font-medium text-gray-700 mb-1 block'
                >
                  Apellido
                </label>
                <input
                  name='last_name'
                  type='text'
                  className='border border-gray-300 focus:ring-emerald-500
                      focus:border-emerald-500 w-full px-4 py-2 rounded-lg'
                  id='last_name'
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='email'
                className='text-sm font-medium text-gray-700 mb-1 block'
              >
                Email
              </label>
              <input
                name='email'
                type='email'
                className='border border-gray-300 focus:ring-emerald-500
                    focus:border-emerald-500 w-full px-4 py-2 rounded-lg'
                id='email'
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='text-sm font-medium text-gray-700 mb-1 block'
              >
                Contraseña
              </label>
              <input
                name='password'
                type='password'
                className='border border-gray-300 focus:ring-emerald-500
                    focus:border-emerald-500 w-full px-4 py-2 rounded-lg'
                id='password'
              />
            </div>
            <div>
              <label
                htmlFor='confirm_password'
                className='text-sm font-medium text-gray-700 mb-1 block'
              >
                Confirmar Contraseña
              </label>
              <input
                name='confirm_password'
                type='password'
                className='border border-gray-300 focus:ring-emerald-500
                    focus:border-emerald-500 w-full px-4 py-2 rounded-lg'
                id='confirm_password'
              />
            </div>
            <div>
              <label
                htmlFor='user_type'
                className='text-sm font-medium text-gray-700 mb-1 block'
              >
                Tipo de usuario
              </label>
              <select
                name='user_type'
                className='border border-gray-300 focus:ring-emerald-500
                    focus:border-emerald-500 w-full px-4 py-2 rounded-lg'
                id='user_type'
              >
                <option value=''>Selecciona una opción</option>
                <option value='teacher'>Profesor</option>
                <option value='student'>Estudiante</option>
              </select>
            </div>
            <div className='items-start flex'>
              <input
                name='terms'
                type='checkbox'
                className='focus:ring-emerald-500 border-gray-300 rounded h-4 w-4
                    text-emerald-600'
                id='terms'
              />
              <label
                htmlFor='terms'
                className='ml-2 text-sm text-gray-600 block'
              >
                <span className='mr-1'>Acepto los</span>
                <a
                  href='/9twIWsbSYpNA4lj2s5SG#'
                  className='text-emerald-600 hover:text-emerald-500'
                >
                  Términos de Servicio
                </a>
                <span className='mx-1'>y la</span>
                <a
                  href='/9twIWsbSYpNA4lj2s5SG#'
                  className='text-emerald-600 hover:text-emerald-500'
                >
                  Política de Privacidad
                </a>
              </label>
            </div>
            <div>
              <Button type='submit' variant='primary' className='w-full'>
                Crear Cuenta
              </Button>
            </div>
          </form>
          <p className='mt-6 text-center text-sm text-gray-600'>
            ¿Ya tienes una cuenta?{' '}
            <Link
              href='/login'
              className='text-emerald-600 hover:text-emerald-500'
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
