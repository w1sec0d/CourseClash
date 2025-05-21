package constants

// Constantes para el sistema de ELO
const (
	// DefaultElo es el ELO inicial para nuevos jugadores
	DefaultElo = 0
	
	// Rangos de ELO
	RankBronce   = "Bronce"
	RankPlata    = "Plata"
	RankOro      = "Oro"
	RankDiamante = "Diamante"
	RankMaestro  = "Maestro"
)

// GetRankByElo retorna el rango correspondiente según el ELO del jugador.
func GetRankByElo(elo int) string {
	switch {
	case elo < 500:
		return RankBronce
	case elo < 1200:
		return RankPlata
	case elo < 2000:
		return RankOro
	case elo < 3000:
		return RankDiamante
	default:
		return RankMaestro
	}
}
