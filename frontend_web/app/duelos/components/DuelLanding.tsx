import Image from 'next/image';

export default function DuelLanding() {
  return (
    <div className='lg:w-1/2 bg-gradient-to-br rounded-xl shadow-xl from-emerald-500 to-emerald-700 overflow-hidden'>
      <div className='flex flex-col'>
        <div className='items-center justify-center p-6 flex'>
          <Image
            src='/images/duels.webp'
            alt='Duelo'
            width={300}
            height={400}
            className='object-cover transform hover:scale-105 transition duration-300 rounded-lg h-64'
          />
        </div>
        <div className='text-white p-6'>
          <p className='text-2xl font-bold mb-4'>¡Desafía a tus compañeros!</p>
          <p className='mb-4'>
            Pon a prueba tus conocimientos y demuestra quién es el mejor en tu
            clase. Gana monedas, experiencia y desbloquea logros especiales.
          </p>
          <div className='bg-white/20 rounded-lg mb-4 backdrop-blur-sm p-4'>
            <p className='font-bold text-xl mb-2'>Beneficios de los Duelos</p>
            <ul className='list-disc list-inside space-y-1'>
              <li>Gana hasta 50 monedas por victoria</li>
              <li>Sube en el ranking de tu clase</li>
              <li>Desbloquea insignias exclusivas</li>
              <li>Refuerza tu aprendizaje mientras juegas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
