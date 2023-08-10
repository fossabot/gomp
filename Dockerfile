FROM alpine:3.18 as alpine

RUN apk add --no-cache ca-certificates

FROM scratch
ARG TARGETPLATFORM

EXPOSE 5000

WORKDIR /var/app/gomp
VOLUME /var/app/gomp/data

COPY build/$TARGETPLATFORM ./
COPY --from=alpine /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

ENTRYPOINT ["./gomp"]
