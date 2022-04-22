import fs from 'fs';

import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema} from 'graphql-tools';

import { resolvers } from './resolvers.js';

const schema = makeExecutableSchema({
	typeDefs : fs.readFileSync('./src/graphql/schema.gql', 'utf8'),
	resolvers : resolvers,
});

export function setupGraphQL(){
	return graphqlHTTP({
		graphiql : true,
		schema : schema,
	})
}
