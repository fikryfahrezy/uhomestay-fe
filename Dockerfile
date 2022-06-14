# Copy from https://t.me/golangID/138064
FROM golang:1.18.0-alpine3.15 AS builder

RUN apk update
RUN apk add --no-cache git

WORKDIR /app

# COPY .git ./.git

WORKDIR backend

COPY backend/go.mod ./
COPY backend/go.sum ./

RUN go mod download

COPY backend ./

RUN go build -o /main -ldflags "-X main.buildDate=$(date +%Y%m%d%H%M%S) -X main.commitHash=$(git rev-parse HEAD)"

FROM alpine:3.15.4

WORKDIR /app

COPY --from=builder /main ./main
COPY backend/docs ./docs
COPY backend/tmpl ./tmpl

EXPOSE 8080

ENTRYPOINT ["/app/main"]