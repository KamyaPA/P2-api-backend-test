import fs from 'fs';

import express from 'express';
import { setupGraphQL } from './graphql/graphql.js';

const app = express();
const PORT = 8080;
const HOSTNAME = 'localhost';

app.use('/graphql', setupGraphQL());

app.listen(PORT, HOSTNAME, () => {
	console.log(`Server is on at ${HOSTNAME}:${PORT}`);
})

