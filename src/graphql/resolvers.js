import data from '../data/apis.js'

export const resolvers = {
	Query : {apis : () => data.getStoredApis()},
	Api   : {},
	Endpoint : {},

	Mutation : {
		createApi : (_ , {domain}) => data.createApi(domain),
		modifyApi : (_ , {domain}) => data.modifyApi(domain),
	},

	ModifyApi : {
		createEndpoint : (parrent , {path}) => data.createEndpoint(parrent, path),
		modifyEndpoint : (parrent , {path}) => data.modifyEndpoint(parrent, path),
	},

	ModifyEndpoint : {
		setPath : (parrent, {path}) => parrent.path = path,
		setMethod : (parrent, {method}) => parrent.method = method,
		modifyHeaders : (parrent) => parrent.headers,
		modifyResponceHeaders: (parrent) => parrent.responceHeaders,
		modifyBody : () => "unset",
		modifyResponceBody : () => "unset",
	},

	ModifyHeaders : {
		setHeader : (parrent, {key, value}) => data.setHeader(parrent, key, value),
		deleteHeader : (parrent, {key}) => "unset",
	},
}
