package models

// RequestDuelResponse representa la respuesta al solicitar un duelo.
type RequestDuelResponse struct {
	DuelID string `json:"duel_id"`
}

// AcceptDuelResponse representa la respuesta al aceptar un duelo.
type AcceptDuelResponse struct {
	DuelAccepted string `json:"duel_accepted"`
}

// ErrorResponseInvalidRequest representa un error de request inválido.
type ErrorResponseInvalidRequest struct {
	Error string `json:"error"`
}

// ErrorResponseDuelAlreadyRequested representa un error de duelo ya solicitado.
type ErrorResponseDuelAlreadyRequested struct {
	Error string `json:"error"`
}

// ErrorResponseDuelNotFound representa un error de duelo no encontrado.
type ErrorResponseDuelNotFound struct {
	Error string `json:"error"`
}
