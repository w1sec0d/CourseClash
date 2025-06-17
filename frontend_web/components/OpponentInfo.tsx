import React from "react";
import { useGetPlayer } from "@/lib/duel-hooks-apollo";
import { StarIcon } from "@heroicons/react/24/solid";

interface OpponentInfoProps {
  opponentId: string;
  opponentName: string;
  opponentEmail: string;
  opponentRole: string;
  className?: string;
}

export function OpponentInfo({
  opponentId,
  opponentName,
  opponentEmail,
  opponentRole,
  className = "",
}: OpponentInfoProps) {
  const { player, loading, error } = useGetPlayer(opponentId);

  // Determinar el color según el rango
  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "bronce":
        return "text-amber-700";
      case "plata":
        return "text-gray-500";
      case "oro":
        return "text-yellow-500";
      case "diamante":
        return "text-blue-500";
      case "maestro":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  // Determinar el emoji del rango
  const getRankEmoji = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "bronce":
        return "🥉";
      case "plata":
        return "🥈";
      case "oro":
        return "🥇";
      case "diamante":
        return "💎";
      case "maestro":
        return "👑";
      default:
        return "⭐";
    }
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
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center">
        <span className="font-medium text-gray-800 min-w-[80px]">Nombre:</span>
        <span className="ml-2 text-gray-700">{opponentName}</span>

        {loading && (
          <div className="ml-2 animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-emerald-500"></div>
        )}

        {!loading && !error && player && (
          <div className="ml-2 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
            <StarIcon className="h-3 w-3 text-emerald-500" />
            <span className="text-xs text-emerald-600 font-semibold">
              {player.elo}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs">{getRankEmoji(player.rank)}</span>
            <span
              className={`text-xs font-semibold ${getRankColor(player.rank)}`}
            >
              {player.rank}
            </span>
          </div>
        )}

        {!loading && (error || !player) && (
          <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            ELO no disponible
          </span>
        )}
      </div>

      <p className="text-gray-700 flex items-center">
        <span className="font-medium text-gray-800 min-w-[80px]">Correo:</span>
        <span className="ml-2">{opponentEmail}</span>
      </p>

      <p className="text-gray-700 flex items-center">
        <span className="font-medium text-gray-800 min-w-[80px]">Rol:</span>
        <span className="ml-2">{translateRole(opponentRole)}</span>
      </p>
    </div>
  );
}
