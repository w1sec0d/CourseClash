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
    KFactorNewPlayer  = 40 // Para primeros 10 duelos o ELO < 1000
    KFactorDefault    = 32 // Para ELO 1000-2000
    KFactorEstablished = 24 // Para ELO > 2000
    DefaultElo        = 0   // ELO inicial para nuevos jugadores
)

// GetRankByElo retorna el rango correspondiente según el ELO del jugador.
func GetRankByElo(elo int) Rank {
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

// getKFactor determina el factor K basado en el ELO del jugador, básicamente es el factor de cambio de ELO 
// hace que los primeros  duelos valgan más que los siguientes
func getKFactor(playerElo int) int {
    if playerElo < 1000 {
        return KFactorNewPlayer
    } else if playerElo < 2000 {
        return KFactorDefault
    }
    return KFactorEstablished
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
    
    // Determinar el resultado real (1 para victoria, 0.5 para empate, 0 para derrota)
    var actualScore float64
    if isDraw {
        actualScore = 0.5
    } else if playerWon {
        actualScore = 1.0
    }
    
    // Obtener el factor K apropiado
    kFactor := getKFactor(playerElo)
    
    // Calcular el cambio de ELO
    eloChange := int(float64(kFactor) * (actualScore - expectedScore))
    
    // Asegurar un cambio mínimo de 1 punto en victorias
    if playerWon && eloChange < 1 {
        eloChange = 1
    }
    
    // Calcular el nuevo ELO
    newElo := playerElo + eloChange
    
    // Asegurar que el ELO nunca baje por debajo de 0
    if newElo < 0 {
        newElo = 0
    }
    
    // Retornar el nuevo ELO
    return newElo
}

// calculateExpectedScore calcula la probabilidad esperada de victoria basada en la diferencia de ELO
func calculateExpectedScore(playerElo, opponentElo int) float64 {
    return 1.0 / (1.0 + pow10(float64(opponentElo-playerElo)/400.0))
}

// pow10 calcula 10 elevado a la potencia dada
func pow10(n float64) float64 {
    return math.Pow(10, n)
}