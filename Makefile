proto:
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto -I=./src/proto --ts_proto_out=./src/auth src/proto/auth.proto --ts_proto_opt=nestJs=true --ts_proto_opt=fileSuffix=.pb

server:
	yarn start:dev

prisma:
	yarn prisma generate
	yarn prisma db push --accept-data-loss
