import React from 'react';

interface Material {
  id: number;
  title: string;
  type: string;
  date: string;
  downloadUrl: string;
  fileSize: string;
  icon: React.ReactNode;
  isImportant?: boolean;
}

interface MaterialesDestacadosCarouselProps {
  materials: Material[];
}

const MaterialesDestacadosCarousel: React.FC<MaterialesDestacadosCarouselProps> = ({ materials }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const carouselRef = React.createRef<HTMLDivElement>();
  
  // Filtrar solo materiales destacados
  const destacados = materials.filter(material => material.isImportant);
  
  // Si no hay materiales destacados, no mostrar el carrusel
  if (destacados.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex === destacados.length - 1 ? 0 : prevIndex + 1;
      return newIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? destacados.length - 1 : prevIndex - 1;
      return newIndex;
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="mb-8 px-3 sm:px-0">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-amber-500 mr-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>
        Materiales destacados
      </h3>
      
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="relative bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg shadow-md border border-amber-100"
          ref={carouselRef}
        >
          {/* Contenido del slide actual */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-0">
            <div className="flex-shrink-0 sm:mr-4 relative">
              {destacados[currentIndex].icon}
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 text-xs text-white flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                </span>
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-lg text-gray-800">
                {destacados[currentIndex].title}
                <span className="ml-2 inline-block px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">Destacado</span>
              </h3>
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="inline-block px-2 py-1 bg-gray-200 rounded-full mr-2">{destacados[currentIndex].type}</span>
                    <span>{destacados[currentIndex].date}</span>
                  </div>
                  <div className="text-sm text-gray-600">{destacados[currentIndex].fileSize}</div>
                </div>
              </div>
              <div className="mt-3">
                <a 
                  href={destacados[currentIndex].downloadUrl}
                  className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Descargar
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Controles del carrusel */}
        {destacados.length > 1 && (
          <>
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-amber-600 focus:outline-none"
              onClick={prevSlide}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-amber-600 focus:outline-none"
              onClick={nextSlide}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
      
      {/* Indicadores del carrusel */}
      {destacados.length > 1 && (
        <div className="flex justify-center mt-4">
          {destacados.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full mx-1 ${
                index === currentIndex ? 'bg-amber-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MaterialesDestacadosCarousel;
