'use client';

import SocialIcon from '@/components/SocialIcon';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/form-schemas';
import Swal from 'sweetalert2';
import { AuthError } from '@/lib/auth-hooks';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, resetPassword, updatePassword } = useAuth();
  const router = useRouter();

  const handleForgotPassword = async () => {
    const { value: email, isConfirmed } = await Swal.fire({
      title: '¿Olvidaste tu contraseña?',
      input: 'email',
      inputLabel: 'Ingresa tu correo electrónico para recuperar tu contraseña',
      inputPlaceholder: 'tu@email.com',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      inputValidator: (value) => {
        if (!value) {
          return 'Necesitas ingresar tu correo electrónico';
        }
        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Por favor ingresa un correo electrónico válido';
        }
        return null;
      },
    });

    if (isConfirmed && email) {
      console.log('📧 Password reset requested for:', email);
      try {
        const result = await resetPassword(email);

        // Mostrar el código de verificación en modo desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log('🔑 Verification code:', result.code);
        }

        // Pedir el código de verificación
        const { value: code } = await Swal.fire({
          title: 'Código de verificación',
          input: 'text',
          inputLabel: 'Ingresa el código que recibiste en tu correo',
          inputPlaceholder: 'Código de 6 caracteres',
          showCancelButton: true,
          confirmButtonText: 'Verificar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#10b981',
          cancelButtonColor: '#6b7280',
          inputValidator: (value) => {
            if (!value) {
              return 'Necesitas ingresar el código de verificación';
            }
            if (value.length !== 6) {
              return 'El código debe tener 6 caracteres';
            }
            return null;
          },
        });

        if (code && code.length === 6 && code === result.code) {
          // Pedir la nueva contraseña
          const { value: newPassword } = await Swal.fire({
            title: 'Nueva contraseña',
            input: 'password',
            inputLabel: 'Ingresa tu nueva contraseña',
            inputPlaceholder: '••••••••',
            showCancelButton: true,
            confirmButtonText: 'Cambiar contraseña',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            inputValidator: (value) => {
              if (!value) {
                return 'Necesitas ingresar una contraseña';
              }
              if (value.length < 8) {
                return 'La contraseña debe tener al menos 8 caracteres';
              }
              return null;
            },
          });

          if (newPassword) {
            try {
              await updatePassword(newPassword, code, email, result.token);
              Swal.fire({
                icon: 'success',
                title: '¡Contraseña actualizada!',
                text: 'Tu contraseña ha sido actualizada exitosamente.',
                confirmButtonColor: '#10b981',
              });
            } catch (error) {
              if (error instanceof AuthError) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error.message,
                  confirmButtonColor: '#10b981',
                });
              }
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof AuthError) {
          let title = 'Error';
          let message = error.message;

          switch (error.code) {
            case 'USER_NOT_FOUND':
              title = 'Usuario no encontrado';
              message =
                'El correo electrónico no está registrado en nuestra plataforma. Por favor, verifica tu correo electrónico o regístrate.';
              break;
            case 'SERVER_ERROR':
              title = 'Error del servidor';
              message =
                'Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo más tarde.';
              break;
            case 'INVALID_CODE':
              title = 'Código inválido';
              message =
                'El código de verificación es inválido o ha expirado. Por favor solicita un nuevo código.';
              break;
          }

          Swal.fire({
            icon: 'error',
            title,
            text: message,
            confirmButtonColor: '#10b981',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error inesperado. Por favor intenta de nuevo más tarde.',
            confirmButtonColor: '#10b981',
          });
        }
      }
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Call the login function from auth context
      const result = await login(data.email, data.password);

      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      // Set form error to display to the user
      if (error instanceof AuthError) {
        setError('root', {
          message: error.message,
          type: error.code,
        });
      } else {
        setError('root', {
          message: 'Error al iniciar sesión. Por favor, intenta de nuevo.',
          type: 'UNKNOWN_ERROR',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        {errors.root && (
          <div className='p-4 text-white bg-red-500 rounded-lg mb-6'>
            {errors.root.message}
          </div>
        )}
        <form
          className='space-y-6'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label
              htmlFor='email'
              className='text-sm font-medium text-gray-700 mb-1 block'
            >
              Correo electrónico
            </label>
            <input
              {...register('email')}
              type='email'
              placeholder='tu@email.com'
              className='border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition w-full px-4 py-3 rounded-lg'
              id='email'
              autoComplete='email'
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.email.message as string}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor='password'
              className='text-sm font-medium text-gray-700 mb-1 block'
            >
              Contraseña
            </label>
            <input
              {...register('password')}
              type='password'
              placeholder='••••••••'
              className='border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition w-full px-4 py-3 rounded-lg'
              id='password'
              autoComplete='current-password'
            />
            {errors.password && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.password.message as string}
              </p>
            )}
          </div>
          <div className='items-center justify-between flex'>
            <div className='items-center flex'>
              <input
                {...register('rememberMe')}
                type='checkbox'
                className='focus:ring-emerald-500 border-gray-300 rounded h-4 w-4 text-emerald-600'
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
              <button
                type='button'
                onClick={handleForgotPassword}
                className='font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer border-0 bg-transparent'
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
          <div>
            <button
              type='submit'
              className='flex border border-transparent hover:bg-emerald-700 focus:outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition transform hover:scale-105 w-full
              justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600'
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
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
