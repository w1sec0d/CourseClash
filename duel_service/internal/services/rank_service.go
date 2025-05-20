package services

import "math"

type Rank string

const (
	RankBronce   Rank = "Bronce"
	RankPlata    Rank = "Plata"
	RankOro      Rank = "Oro"
	RankDiamante Rank = "Diamante"
	RankMaestro  Rank = "Maestro"
)

// Factor K para el cálculo del ELO
const (
	KFactorDefault = 32 // Factor K estándar para ajustar la magnitud de los cambios de ELO
	DefaultElo     = 1200 // ELO inicial por defecto para nuevos jugadores
)


// GetRankByElo retorna el rango correspondiente según el ELO del jugador.
func GetRankByElo(elo int) Rank {
	switch {
	case elo < 1200:
		return RankBronce
	case elo < 1400:
		return RankPlata
	case elo < 1600:
		return RankOro
	case elo < 1800:
		return RankDiamante
	default:
		return RankMaestro
	}
}

// CalculateEloChange calcula el cambio en el ELO después de un duelo.
// Parámetros:
// - playerElo: ELO actual del jugador
// - opponentElo: ELO actual del oponente
// - playerWon: true si el jugador ganó, false si perdió
// - isDraw: true si el duelo terminó en empate
// Retorna el nuevo ELO del jugador
func CalculateEloChange(playerElo, opponentElo int, playerWon, isDraw bool) int {
	// Calcular la probabilidad esperada de victoria
	expectedScore := calculateExpectedScore(playerElo, opponentElo)
	
	// Determinar el resultado actual (1 para victoria, 0.5 para empate, 0 para derrota)
	var actualScore float64
	if isDraw {
		actualScore = 0.5
	} else if playerWon {
		actualScore = 1.0
	} else {
		actualScore = 0.0
	}
	
	// Calcular el cambio de ELO
	eloChange := int(float64(KFactorDefault) * (actualScore - expectedScore))
	
	// Retornar el nuevo ELO
	return playerElo + eloChange
}

// calculateExpectedScore calcula la probabilidad esperada de victoria basada en la diferencia de ELO
func calculateExpectedScore(playerElo, opponentElo int) float64 {
	return 1.0 / (1.0 + pow10(float64(opponentElo-playerElo)/400.0))
}

// pow10 calcula 10 elevado a la potencia dada
func pow10(n float64) float64 {
	return math.Pow(10, n)
}
