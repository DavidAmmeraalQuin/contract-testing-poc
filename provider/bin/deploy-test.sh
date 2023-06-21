#!/bin/bash

export PACT_BROKER_BASE_URL="http://localhost:9292"

docker run --rm \
 --network="host" \
 -w ${PWD} \
 -v ${PWD}:${PWD} \
 -e PACT_BROKER_BASE_URL \
  pactfoundation/pact-cli:latest \
  pact-broker record-deployment \
	--pacticipant=MyProvider \
	--environment=test\
  --version=$(git rev-parse --short HEAD)