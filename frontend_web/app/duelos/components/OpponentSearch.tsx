import { FormEvent } from "react";
import Button from "@/components/Button";
import { Category } from "../../types/duel";

interface User {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  role?: string;
}

interface OpponentSearchProps {
  opponentEmail: string;
  setOpponentEmail: (email: string) => void;
  onSearch: () => Promise<void>;
  onRequestDuel: () => Promise<void>;
  foundUser: User | null;
  searchLoading: boolean;
  requestLoading: boolean;
  categories: Category[];
  categoriesLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function OpponentSearch({
  opponentEmail,
  setOpponentEmail,
  onSearch,
  onRequestDuel,
  foundUser,
  searchLoading,
  requestLoading,
  categories,
  categoriesLoading,
  selectedCategory,
  setSelectedCategory,
}: OpponentSearchProps) {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSearch();
  };

  // Mapeo de emojis para categorías
  const categoryEmojis: { [key: string]: string } = {
    matematica: "🔢",
    historia: "📚",
    geografia: "🌍",
    ciencias: "🔬",
    literatura: "📖",
    fisica: "⚛️",
    quimica: "🧪",
    biologia: "🧬",
  };

  // Función para obtener el emoji de una categoría
  const getCategoryEmoji = (categoryName: string) => {
    return categoryEmojis[categoryName] || "📝";
  };

  // Función para traducir roles
  const translateRole = (role: string) => {
    const roleTranslations: { [key: string]: string } = {
      student: "Estudiante",
      STUDENT: "Estudiante",
      teacher: "Profesor",
      TEACHER: "Profesor",
      admin: "Administrador",
      ADMIN: "Administrador",
      user: "Usuario",
      USER: "Usuario",
    };
    return roleTranslations[role] || role;
  };

  return (
    <div className="lg:w-full bg-white rounded-xl shadow-lg border border-emerald-100 p-6 flex flex-col justify-center">
      <div className="items-center mb-6 flex">
        <div className="bg-emerald-100 rounded-full mr-3 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
            />
          </svg>
        </div>
        <p className="text-2xl font-bold text-gray-800">
          Desafiar a un Estudiante
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="opponentEmail"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Correo del estudiante
          </label>
          <div className="relative">
            <div className="pl-3 items-center absolute inset-y-0 left-0 flex pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <input
              name="opponentEmail"
              type="email"
              value={opponentEmail}
              onChange={(e) => setOpponentEmail(e.target.value)}
              placeholder="estudiante@universidad.edu"
              className="border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition pl-10 w-full py-3 rounded-lg"
              id="opponentEmail"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Categoría del duelo
          </label>
          <div className="relative">
            <div className="pl-3 items-center absolute inset-y-0 left-0 flex pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14-4H9m4 8H5m6-4h4"
                />
              </svg>
            </div>
            <select
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition pl-10 w-full py-3 rounded-lg appearance-none bg-white"
              id="category"
              disabled={categoriesLoading}
            >
              {categoriesLoading ? (
                <option value="">Cargando categorías...</option>
              ) : (
                categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {getCategoryEmoji(category.name)} {category.displayName}
                  </option>
                ))
              )}
            </select>
            <div className="pr-3 items-center absolute inset-y-0 right-0 flex pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {selectedCategory && !categoriesLoading && (
            <p className="text-sm text-gray-600 mt-1">
              {getCategoryEmoji(selectedCategory)} {categories.find(cat => cat.name === selectedCategory)?.description}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={searchLoading}
            className="hover:bg-emerald-700 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 w-full bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-md"
          >
            {searchLoading ? "Buscando..." : "Buscar Estudiante"}
          </Button>
        </div>
      </form>

      {foundUser && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <h3 className="font-bold text-emerald-800 mb-3 flex items-center">
            <span className="bg-emerald-100 rounded-full p-1 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            Oponente Encontrado
          </h3>
          <div className="space-y-2">
            <p className="text-gray-700 flex items-center">
              <span className="font-medium text-gray-800 min-w-[80px]">Nombre:</span>
              <span className="ml-2">{foundUser.fullName || foundUser.username}</span>
            </p>
            <p className="text-gray-700 flex items-center">
              <span className="font-medium text-gray-800 min-w-[80px]">Correo:</span>
              <span className="ml-2">{foundUser.email}</span>
            </p>
            <p className="text-gray-700 flex items-center">
              <span className="font-medium text-gray-800 min-w-[80px]">Rol:</span>
              <span className="ml-2">{translateRole(foundUser.role || "")}</span>
            </p>
            <p className="text-gray-700 flex items-center">
              <span className="font-medium text-gray-800 min-w-[80px]">Categoría:</span>
              <span className="ml-2 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
                {getCategoryEmoji(selectedCategory)} {categories.find(cat => cat.name === selectedCategory)?.displayName}
              </span>
            </p>
          </div>
          <Button
            onClick={onRequestDuel}
            disabled={requestLoading}
            className="mt-4 hover:bg-emerald-700 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 w-full bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-md"
          >
            {requestLoading ? "Solicitando..." : `Solicitar Duelo de ${categories.find(cat => cat.name === selectedCategory)?.displayName || "Conocimiento"}`}
          </Button>
        </div>
      )}
    </div>
  );
}
