package models

// RequestDuelResponse representa la respuesta exitosa al solicitar un duelo.
type RequestDuelResponse struct {
	DuelID  string `json:"duel_id" example:"player123_vs_player456"`
	Message string `json:"message" example:"Duel successfully requested"`
}

// AcceptDuelResponse representa la respuesta exitosa al aceptar un duelo.
type AcceptDuelResponse struct {
	DuelID  string `json:"duel_id" example:"player123_vs_player456"`
	Message string `json:"message" example:"Duel accepted"`
}

// ErrorResponseInvalidRequest representa un error de solicitud malformada o inválida.
type ErrorResponseInvalidRequest struct {
	ErrorCode string `json:"error_code" example:"invalid_request"`
	Message   string `json:"message" example:"The request body is missing required fields or is malformed"`
}

// ErrorResponseDuelAlreadyRequested representa un error cuando ya existe un duelo entre los jugadores.
type ErrorResponseDuelAlreadyRequested struct {
	ErrorCode string `json:"error_code" example:"duel_already_requested"`
	Message   string `json:"message" example:"A duel between these players has already been requested"`
}

// ErrorDuelNotFound representa un error cuando no se encuentra un duelo con el ID dado.
type ErrorResponseDuelNotFound struct {
	ErrorCode string `json:"error_code" example:"duel_not_found"`
	Message   string `json:"message" example:"No duel found with the provided ID"`
}

// ErrorResponse representa un error genérico del servidor.
type ErrorResponse struct {
	Error string `json:"error" example:"Error interno del servidor"`
}
