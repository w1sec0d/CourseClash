FROM golang:1.19-alpine AS builder

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o duel_service ./cmd/api

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/duel_service .

EXPOSE 8002

CMD ["./duel_service"]
