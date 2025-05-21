'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { AuthError } from '@/lib/auth-hooks';
import { useForgotPassword } from '@/lib/auth-hooks';

// Schema for password reset validation
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /[a-z]/,
        'La contraseña debe contener al menos una letra minúscula'
      )
      .regex(
        /[A-Z]/,
        'La contraseña debe contener al menos una letra mayúscula'
      )
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const code = searchParams.get('code');
  const email = searchParams.get('email');
  const { updatePassword } = useForgotPassword();

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      if (!token || !code || !email) {
        throw new Error(
          'Información incompleta para restablecer la contraseña'
        );
      }

      // Call the API to update the password
      await updatePassword(data.password, code, email, token);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        text: 'Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
        confirmButtonColor: '#10b981',
      }).then(() => {
        // Redirect to login page
        router.push('/login');
      });

      // Reset form
      reset();
    } catch (error) {
      console.error('Error resetting password:', error);

      // Check if it's an AuthError first, then regular Error
      if (error instanceof AuthError) {
        setError('root', {
          message: error.message || 'Error de autenticación',
        });
      } else if (error instanceof Error) {
        setError('root', {
          message: error.message || 'Error al actualizar la contraseña',
        });
      } else {
        setError('root', {
          message:
            'Error desconocido al actualizar la contraseña. Por favor, intenta de nuevo.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If no token is provided, show an error message
  if (!token) {
    return (
      <div className='mx-auto my-12 container bg-white rounded-xl shadow-2xl max-w-2xl overflow-hidden p-8 text-center'>
        <div className='text-red-500 text-5xl mb-6'>⚠️</div>
        <h1 className='text-2xl font-bold text-emerald-700 mb-4'>
          Enlace inválido
        </h1>
        <p className='text-gray-600 mb-6'>
          El enlace para restablecer la contraseña es inválido o ha expirado.
        </p>
        <Link
          href='/login'
          className='inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg'
        >
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className='mx-auto my-12 container bg-white rounded-xl shadow-2xl md:flex-row max-w-7xl overflow-hidden flex flex-col'>
      {/* Sección de ilustración */}
      <div className='w-full md:w-1/2 bg-emerald-600 items-center justify-center flex p-8'>
        <div className='text-center'>
          <div className='justify-center mb-6 flex'>
            {/* Logo could go here */}
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
            Crear nueva contraseña
          </p>
          <p className='text-gray-600'>
            Ingresa y confirma tu nueva contraseña
          </p>
        </div>
        {errors.root && (
          <div className='p-4 text-white bg-red-500 rounded-lg mb-6'>
            {errors.root.message}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Nueva contraseña
            </label>
            <input
              type='password'
              id='password'
              {...register('password')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
            />
            {errors.password && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700'
            >
              Confirmar contraseña
            </label>
            <input
              type='password'
              id='confirmPassword'
              {...register('confirmPassword')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
            />
            {errors.confirmPassword && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
            >
              {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
