FROM golang:1.22.2
WORKDIR /app
COPY go.mod .
COPY go.sum .
RUN go mod download



COPY . .


RUN curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin


EXPOSE 8000

CMD ["air"]

