#!/bin/bash

export PACT_BROKER_BASE_URL="http://localhost:9292"

DEFAULT_VERSION=$(git rev-parse --short HEAD)

if [ -z ${VERSION+x} ];
then
	VERSION=$DEFAULT_VERSION
else
	echo "Checking if we can deploy $VERSION"
fi

docker run --rm \
 --network="host" \
 -w ${PWD} \
 -v ${PWD}:${PWD} \
 -e PACT_BROKER_BASE_URL \
 -e PACT_BROKER_TOKEN \
  pactfoundation/pact-cli:latest \
  pact-broker record-support-ended \
	--pacticipant=MyConsumer \
	--environment=test\
  --version=${VERSION}