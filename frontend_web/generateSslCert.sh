#!/bin/bash

# Make sure the ssl directory exists
mkdir -p ./ssl

# Generate the SSL certificate using OpenSSL
openssl req \
  -newkey rsa:2048 \
  -x509 \
  -nodes \
  -keyout ./ssl/server.key \
  -new \
  -out ./ssl/server.crt \
  -config ./ssl/certdef.cnf \
  -sha256 \
  -days 365