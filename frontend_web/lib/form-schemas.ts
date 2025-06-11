import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Por favor, ingresa un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'El nombre es requerido')
      .max(50, 'El nombre debe tener máximo 50 caracteres'),
    lastName: z
      .string()
      .min(1, 'El apellido es requerido')
      .max(50, 'El apellido debe tener máximo 50 caracteres'),
    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('Por favor, ingresa un email válido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmPassword: z
      .string()
      .min(1, 'La confirmación de contraseña es requerida')
      .min(8, 'La confirmación de contraseña debe tener al menos 8 caracteres'),
    user_type: z
      .string()
      .min(1, 'Debe seleccionar un tipo de usuario')
      .refine(
        (value) => value === 'teacher' || value === 'student',
        'Tipo de usuario no válido'
      ),
    terms: z.boolean().refine((value) => value === true, {
      message: 'Debe aceptar los términos y condiciones para continuar',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
