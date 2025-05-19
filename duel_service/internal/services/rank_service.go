package services

type Rank string

const (
	RankBronce   Rank = "Bronce"
	RankPlata    Rank = "Plata"
	RankOro      Rank = "Oro"
	RankDiamante Rank = "Diamante"
	RankMaestro  Rank = "Maestro"
)

// GetRankByScore retorna el rango correspondiente según el puntaje.
func GetRankByScore(score int) Rank {
	switch {
	case score < 500:
		return RankBronce
	case score < 1000:
		return RankPlata
	case score < 1500:
		return RankOro
	case score < 2000:
		return RankDiamante
	default:
		return RankMaestro
	}
}
