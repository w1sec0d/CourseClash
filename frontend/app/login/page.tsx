import SocialIcon from '@/components/SocialIcon';
import Link from 'next/link';

export default function Login() {
  return (
    <div className='mx-auto my-12 container bg-white rounded-xl shadow-2xl md:flex-row max-w-7xl overflow-hidden flex flex-col'>
      {/* Sección de ilustración */}
      <div className='w-full md:w-1/2 bg-emerald-600 items-center justify-center flex p-8'>
        <div className='text-center'>
          <div className='justify-center mb-6 flex'>
            {/* <img alt="Logo de Course Clash: Una espada insertada en un birrete de graduación" src="https://placehold.co/200x200/emerald/white?text=CC" className="object-contain w-32 h-32"> */}
          </div>
          <p className='text-white text-3xl font-bold mb-4'>Course Clash</p>
          <p className='text-emerald-100 mb-6'>
            ¡Aprende, compite y conquista el conocimiento!
          </p>
          <div className='md:flex hidden flex-col space-y-4'>
            <div className='items-center bg-emerald-700 rounded-lg flex p-3'>
              <div className='bg-emerald-500 rounded-full mr-3 p-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  id='Windframe_UrXOQxH9O'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
              </div>
              <p className='text-white text-sm'>
                Duelos académicos emocionantes
              </p>
            </div>
            <div className='items-center bg-emerald-700 rounded-lg flex p-3'>
              <div className='bg-emerald-500 rounded-full mr-3 p-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  id='Windframe_h43ZSvfQZ'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
              </div>
              <p className='text-white text-sm'>
                Insignias y logros exclusivos
              </p>
            </div>
            <div className='items-center bg-emerald-700 rounded-lg flex p-3'>
              <div className='bg-emerald-500 rounded-full mr-3 p-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  id='Windframe_zcDmNuzsr'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
              </div>
              <p className='text-white text-sm'>
                Tienda de bonificaciones con ventajas
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Sección de formulario */}
      <div className='w-full md:w-1/2 p-8'>
        <div className='text-center mb-10'>
          <p className='text-3xl font-bold text-emerald-700 mb-2'>
            ¡Bienvenido de nuevo!
          </p>
          <p className='text-gray-600'>
            Inicia sesión para continuar tu aventura académica
          </p>
        </div>
        <form className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='text-sm font-medium text-gray-700 mb-1 block'
            >
              Correo electrónico
            </label>
            <input
              name='email'
              required
              type='email'
              placeholder='tu@email.com'
              className='border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition w-full px-4
              py-3 rounded-lg'
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
              required
              type='password'
              placeholder='••••••••'
              className='border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition w-full px-4
              py-3 rounded-lg'
              id='password'
            />
          </div>
          <div className='items-center justify-between flex'>
            <div className='items-center flex'>
              <input
                name='remember-me'
                type='checkbox'
                className='focus:ring-emerald-500 border-gray-300 rounded h-4 w-4
                text-emerald-600'
                id='remember-me'
              />
              <label
                htmlFor='remember-me'
                className='ml-2 text-sm text-gray-700 block'
              >
                Recordarme
              </label>
            </div>
            <div className='text-sm'>
              <a
                href='/9twIWsbSYpNA4lj2s5SG#'
                className='font-medium text-emerald-600 hover:text-emerald-500'
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
          <div>
            <button
              type='submit'
              className='flex border border-transparent hover:bg-emerald-700 focus:outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition transform hover:scale-105 w-full
              justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600'
            >
              Iniciar sesión
            </button>
          </div>
        </form>
        <div className='mt-8'>
          <div className='relative'>
            <div className='items-center absolute inset-0 flex'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='justify-center text-sm relative flex'>
              <span className='px-2 bg-white text-gray-500'>
                O continúa con
              </span>
            </div>
          </div>
          <div className='mt-6 grid grid-cols-2 gap-3'>
            <SocialIcon icon='google' showText={false} />
            <SocialIcon icon='facebook' showText={false} />
          </div>
        </div>
        <p className='mt-8 text-center text-sm text-gray-600'>
          ¿No tienes una cuenta?{' '}
          <Link
            href='/registro'
            className='font-medium text-emerald-600 hover:text-emerald-500'
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
