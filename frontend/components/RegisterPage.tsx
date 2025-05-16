'use client';
import * as React from 'react';
import Link from 'next/link';

export const RegisterPage: React.FC = () => {
  return (
    <div className='bg-emerald-50 min-h-screen flex flex-col'>
      <div className='items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-grow flex'>
        <div className='w-full md:grid-cols-2 max-w-6xl grid grid-cols-1 gap-8'>
          <div className='bg-white rounded-lg shadow-md h-fit p-6'>
            <div className='text-center'>
              <p className='text-lg font-medium text-emerald-800'>
                ¿Por qué unirte a Course Clash?
              </p>
            </div>
            <div className='mt-4 grid grid-cols-1 gap-4'>
              <div className='items-start flex'>
                <div className='flex-shrink-0'>
                  <div className='h-10 w-10 rounded-full bg-emerald-100 items-center justify-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-emerald-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      id='Windframe_oX7BjNFL9'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-900'>
                    Logros y medallas
                  </p>
                  <p className='mt-1 text-xs text-gray-500'>
                    Colecciona insignias por tus esfuerzos académicos
                  </p>
                </div>
              </div>
              <div className='items-start flex'>
                <div className='flex-shrink-0'>
                  <div className='h-10 w-10 rounded-full bg-purple-100 items-center justify-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-purple-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      id='Windframe_G5k71Vz5C'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-900'>
                    Duelos académicos
                  </p>
                  <p className='mt-1 text-xs text-gray-500'>
                    Compite y aprende con tus compañeros
                  </p>
                </div>
              </div>
              <div className='items-start flex'>
                <div className='flex-shrink-0'>
                  <div className='h-10 w-10 rounded-full bg-blue-100 items-center justify-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-blue-500'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      id='Windframe_kLStJ5Lpi'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-900'>
                    Moneda virtual
                  </p>
                  <p className='mt-1 text-xs text-gray-500'>
                    Gana monedas para canjear por ventajas
                  </p>
                </div>
              </div>
              <div className='items-start flex'>
                <div className='flex-shrink-0'>
                  <div className='h-10 w-10 rounded-full bg-amber-100 items-center justify-center flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-amber-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      id='Windframe_jfPauEBJJ'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M13 10V3L4 14h7v7l9-11h-7z'
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-900'>
                    Sistema de Rangos
                  </p>
                  <p className='mt-1 text-xs text-gray-500'>
                    Sube de nivel y desbloquea nuevas habilidades
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='space-y-8'>
            <div className='text-center'>
              {/* <img alt="Icono de Course Clash" src="https://placehold.co/120x120/emerald/white?text=CC" className="mx-auto h-16
              w-auto"> */}
              <p className='mt-6 text-3xl font-extrabold text-emerald-800'>
                Únete a Course Clash
              </p>
              <p className='mt-2 text-sm text-gray-600 hover:text-emerald-600 cursor-pointer transition-colors duration-300'>
                o <span className='text-emerald-600'>inicia sesión</span>
              </p>
            </div>
            <form action='#' method='POST' className='space-y-6'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='space-y-5'>
                  <div>
                    <label
                      htmlFor='nombre'
                      className='text-sm font-medium text-black block'
                    >
                      Nombre completo
                    </label>
                    <input
                      name='nombre'
                      required={true}
                      type='text'
                      className='focus:ring-emerald-500 focus:border-emerald-500
                    block border-gray-300 mt-1 w-full shadow-sm rounded-md px-3 py-2 text-black'
                      id='nombre'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='email'
                      className='text-sm font-medium text-black block'
                    >
                      Correo electrónico
                    </label>
                    <input
                      name='email'
                      autoComplete='email'
                      required={true}
                      type='email'
                      className='focus:ring-emerald-500
                    focus:border-emerald-500 block border-gray-300 mt-1 w-full shadow-sm rounded-md px-3 py-2 text-black'
                      id='email'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='password'
                      className='text-sm font-medium text-black block'
                    >
                      Contraseña
                    </label>
                    <input
                      name='password'
                      autoComplete='new-password'
                      required={true}
                      type='password'
                      className='focus:ring-emerald-500 focus:border-emerald-500 block border-gray-300 mt-1 w-full shadow-sm
                    rounded-md px-3 py-2'
                      id='password'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='confirm-password'
                      className='text-sm font-medium text-black block'
                    >
                      Confirmar contraseña
                    </label>
                    <input
                      name='confirm-password'
                      autoComplete='new-password'
                      required={true}
                      type='password'
                      className='focus:ring-emerald-500 focus:border-emerald-500 block border-gray-300 mt-1 w-full shadow-sm
                    rounded-md px-3 py-2'
                      id='confirm-password'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='tipo-usuario'
                      className='text-sm font-medium text-black block'
                    >
                      Tipo de usuario
                    </label>
                    <select
                      name='tipo-usuario'
                      required={true}
                      className='block border border-gray-300 focus:outline-none
                    focus:ring-emerald-500 focus:border-emerald-500 mt-1 w-full py-2 px-3 bg-white rounded-md shadow-sm'
                      id='tipo-usuario'
                    >
                      <option>Estudiante</option>
                      <option>Profesor</option>
                      <option>Administrador</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor='institucion'
                      className='text-sm font-medium text-black block'
                    >
                      Institución educativa
                    </label>
                    <input
                      name='institucion'
                      type='text'
                      className='focus:ring-emerald-500 focus:border-emerald-500 block
                    border-gray-300 mt-1 w-full shadow-sm rounded-md px-3 py-2'
                      id='institucion'
                    />
                  </div>
                  <div className='items-center flex'>
                    <input
                      name='acepto-terminos'
                      type='checkbox'
                      className='focus:ring-emerald-500 border-gray-300 rounded h-4
                    w-4 text-emerald-600'
                      id='acepto-terminos'
                    />
                    <label
                      htmlFor='acepto-terminos'
                      className='ml-2 text-sm text-black block'
                    >
                      Acepto los términos y condiciones
                    </label>
                  </div>
                </div>
                <div className='mt-6'>
                  <button
                    type='submit'
                    className='flex border border-transparent hover:bg-emerald-700 focus:outline-none
                  focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 w-full justify-center py-3 px-4 rounded-md
                  shadow-sm text-sm font-medium text-white bg-emerald-600'
                  >
                    Registrarse
                  </button>
                </div>
                <div className='mt-6'>
                  <div className='relative'>
                    <div className='items-center absolute inset-0 flex'>
                      <div className='w-full border-t border-gray-300'></div>
                    </div>
                    <div className='justify-center text-sm relative flex'>
                      <span className='px-2 bg-white text-black'>
                        O regístrate con
                      </span>
                    </div>
                  </div>
                  <div className='mt-6 grid grid-cols-3 gap-3'>
                    <div>
                      <a
                        href='/WBquzYERXPhyGuvAJnpT#'
                        className='w-full justify-center py-2 px-4 rounded-md shadow-sm bg-white
                      text-sm font-medium text-gray-500 inline-flex border border-gray-300 hover:bg-gray-50'
                      >
                        <svg
                          className='h-5 w-5 text-blue-600'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                          id='Windframe_FVNZexe2u'
                        >
                          <path
                            fillRule='evenodd'
                            d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                            clipRule='evenodd'
                          ></path>
                        </svg>
                      </a>
                    </div>
                    <div>
                      <a
                        href='/WBquzYERXPhyGuvAJnpT#'
                        className='w-full justify-center py-2 px-4 rounded-md shadow-sm bg-white
                      text-sm font-medium text-gray-500 inline-flex border border-gray-300 hover:bg-gray-50'
                      >
                        <svg
                          className='h-5 w-5 text-blue-400'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                          id='Windframe_ETHRf4MK0'
                        >
                          <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84'></path>
                        </svg>
                      </a>
                    </div>
                    <div>
                      <a
                        href='/WBquzYERXPhyGuvAJnpT#'
                        className='w-full justify-center py-2 px-4 rounded-md shadow-sm bg-white
                      text-sm font-medium text-gray-500 inline-flex border border-gray-300 hover:bg-gray-50'
                      >
                        <svg
                          className='h-5 w-5 text-red-500'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                          id='Windframe_zAKjmMt8s'
                        >
                          <path
                            fillRule='evenodd'
                            d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z'
                            clipRule='evenodd'
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <footer className='bg-emerald-800 py-6'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='items-center md:flex-row md:justify-between flex flex-col'>
            <div className='items-center flex'>
              {/* <img alt="Logo de Course Clash" src="https://placehold.co/140x40/emerald/white?text=Course+Clash" className="h-8
              w-auto"> */}
            </div>
            <div className='mt-4 md:mt-0'>
              <p className='text-center text-sm text-emerald-100'>
                © 2023 Course Clash. Todos los derechos reservados.
              </p>
            </div>
            <div className='mt-4 md:mt-0 flex space-x-4'>
              <a
                href='/WBquzYERXPhyGuvAJnpT#'
                className='text-emerald-200 hover:text-white'
              >
                <span className='sr-only'>Facebook</span>
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  id='Windframe_BKE5w979Y'
                >
                  <path
                    fillRule='evenodd'
                    d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </a>
              <a
                href='/WBquzYERXPhyGuvAJnpT#'
                className='text-emerald-200 hover:text-white'
              >
                <span className='sr-only'>Twitter</span>
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  id='Windframe_ZPj4C11ux'
                >
                  <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84'></path>
                </svg>
              </a>
              <a
                href='/WBquzYERXPhyGuvAJnpT#'
                className='text-emerald-200 hover:text-white'
              >
                <span className='sr-only'>Instagram</span>
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden={true}
                  id='Windframe_PQ0TwmRTY'
                >
                  <path
                    fillRule='evenodd'
                    d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
