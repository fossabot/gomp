FROM alpine:3.5
MAINTAINER ch@dweimer.com

ENV PORT 5000

WORKDIR /var/app/gomp

COPY build/gomp-linux-amd64 ./gomp
COPY db/ ./db/
COPY static/ ./static/
COPY templates/ ./templates/

VOLUME /var/app/gomp/data

EXPOSE 5000
ENTRYPOINT ["./gomp"]
