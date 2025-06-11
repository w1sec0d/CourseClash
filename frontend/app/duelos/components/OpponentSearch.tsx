import { FormEvent } from "react";
import Button from "@/components/Button";

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
}

export default function OpponentSearch({
  opponentEmail,
  setOpponentEmail,
  onSearch,
  onRequestDuel,
  foundUser,
  searchLoading,
  requestLoading,
}: OpponentSearchProps) {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSearch();
  };

  return (
    <div className="lg:w-1/2 bg-white rounded-xl shadow-lg border border-emerald-100 p-6 flex flex-col justify-center">
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
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
          <h3 className="font-bold text-emerald-800 mb-2">
            Oponente Encontrado:
          </h3>
          <p className="text-gray-700">
            Nombre: {foundUser.fullName || foundUser.username}
          </p>
          <p className="text-gray-700">Correo: {foundUser.email}</p>
          <p className="text-gray-700">Rol: {foundUser.role}</p>
          <Button
            onClick={onRequestDuel}
            disabled={requestLoading}
            className="mt-4 hover:bg-emerald-700 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 w-full bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-md"
          >
            {requestLoading ? "Solicitando..." : "Solicitar Duelo"}
          </Button>
        </div>
      )}
    </div>
  );
}
