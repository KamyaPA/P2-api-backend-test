import data from '../data/apis.js'
import {callApi} from '../data/callApi.js'

let activeApi;

export const resolvers = {
	Query : {
		apis : () =>  data.getStoredApis(),
		domain : () => "Hello World"
	},
	Api   : {
		endpoints : (parrent) => {
			activeApi = parrent;
			return parrent.endpoints;
		}
	},
	Endpoint : {
		call : (parrent) => callApi(activeApi, parrent),
	},

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
		setDescription: (parrent, {description}) => parrent.description = description,
		modifyHeaders : (parrent) => parrent.headers,
		modifyResponceHeaders: (parrent) => parrent.responceHeaders,
		modifyBody : () => "unset",
		modifyResponceBody : () => "unset",
	},

	ModifyHeaders : {
		setHeader : (parrent, {key, value}) => data.setHeader(parrent, key, value),
		deleteHeader : (parrent, {key}) => data.deleteHeader(parrent, key),
	},
}
