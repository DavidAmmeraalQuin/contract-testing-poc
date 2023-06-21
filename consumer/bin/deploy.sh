#!/bin/bash

export PACT_BROKER_BASE_URL="http://localhost:9292"

docker run --rm \
 --network="host" \
 -w ${PWD} \
 -v ${PWD}:${PWD} \
 -e PACT_BROKER_BASE_URL \
 -e PACT_BROKER_TOKEN \
  pactfoundation/pact-cli:latest \
  pact-broker record-deployment \
	--pacticipant=MyConsumer \
	--environment=$DEPLOY_ENV\
  --version=$(git rev-parse --short HEAD)