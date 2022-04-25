import data from '../data/apis.js'
import { callApi } from '../data/callApi.js'
import { GraphQLJSONObject } from 'graphql-type-json'

export const resolvers = {

	JSONObject : GraphQLJSONObject, 
	Query : {
		apis : (_, {name}) =>  {
			if(name){ 
				return data.getStoredApis().filter((api) => {
					return api.name === name;
				})
			} else{
				return data.getStoredApis();
			}
		},
		call : (parrent, {api, argv}) => callApi(api, argv),
	},

	Api   : {
		endpoints : (parrent) => Object.values(parrent.endpoints),
	},
	Endpoint : {
	},

	Mutation : {
		createApi : (_ , {name}) => data.createApi(name),
		modifyApi : (_ , {name}) => data.modifyApi(name),
	},

	ModifyApi : {
		setDomain      : (parrent , {domain}) => parrent.domain = domain,
		createEndpoint : (parrent , {name}) => data.createEndpoint(parrent, name),
		modifyEndpoint : (parrent , {name}) => data.modifyEndpoint(parrent, name),
	},

	ModifyEndpoint : {
		setPath : (parrent, {path}) => parrent.path = path,
		setMethod : (parrent, {method}) => parrent.method = method,
		setDescription: (parrent, {description}) => parrent.description = description,
		modifyHeaders : (parrent) => parrent.headers,
		modifyResponceHeaders: (parrent) => parrent.responceHeaders,
		addQueryParam : (parrent, {params}) => parrent.queryParams.push(...params),
		modifyBody : () => "unset",
		modifyResponceBody : () => "unset",
	},

	ModifyHeaders : {
		setHeader : (parrent, {key, value}) => data.setHeader(parrent, key, value),
		deleteHeader : (parrent, {key}) => data.deleteHeader(parrent, key),
	},
}