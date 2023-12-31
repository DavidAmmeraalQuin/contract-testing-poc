export PACT_BROKER_BASE_URL="http://localhost:9292"
export PACT_BROKER_TOKEN="0GBR0amkEdHEsixDY8ASuA"

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
		pactfoundation/pact-cli:latest \
  	pact-broker can-i-deploy\
		--pacticipant=MyConsumer\
		--to-environment=${DEPLOY_ENV} \
 		--version=${VERSION}