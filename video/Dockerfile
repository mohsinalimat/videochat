FROM alpine:3.14.2
RUN apk add --no-cache ca-certificates
ARG BINARY
COPY ./$BINARY /usr/local/bin/video
ENTRYPOINT ["/usr/local/bin/video"]