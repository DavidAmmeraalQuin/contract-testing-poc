#!/bin/bash

export PACT_BROKER_BASE_URL="http://localhost:9292"

docker run --rm \
 --network="host" \
 -w ${PWD} \
 -v ${PWD}:${PWD} \
 -e PACT_BROKER_BASE_URL \
 -e PACT_BROKER_TOKEN \
  pactfoundation/pact-cli:latest \
  publish \
  ${PWD}/contracts \
  --branch=main \
  --consumer-app-version=${CONTRACT_VERSION}