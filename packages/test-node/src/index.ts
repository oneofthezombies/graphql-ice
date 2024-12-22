import { createServer } from "@graphql-ice/server/adapter/node";

const server = await createServer();
console.log(server);
