import data from '../data/apis.js'
import { callApi } from '../data/callApi.js'
import { GraphQLJSON } from 'graphql-type-json'

export const resolvers = {

	JSON : GraphQLJSON, 
	Query : {

		apis : (_, {name}) =>  {
			if(name){ 
				return data.getStoredApis().filter((api) => api.name === name)
			} else{
				return data.getStoredApis();
			}
		},
		call : (parrent, {api, argv, filter}) => callApi(api, argv, filter),

	},

	Api   : {
    endpoints : (parrent, {name}) => {
        if(name){
            return Object.values(parrent.endpoints).filter(endpoint => endpoint.name === name)
        } else{
            return Object.values(parrent.endpoints);
        }
    }
},
	Endpoint : {
		query : (parrent) => {
			let rtn = [];
			rtn = rtn.concat(parrent.query.query);
			rtn = rtn.concat(parrent.query.path);
			return rtn;
		}
	},

	Mutation : {
		createApi : (_ , {name}) => data.createApi(name),
		modifyApi : (_ , {name}) => data.modifyApi(name),
		deleteApi : (_ , {name}) => data.deleteApi(name),
	},

	ModifyApi : {
		setDomain      : (parrent , {domain}) => parrent.domain = domain,
		createEndpoint : (parrent , {name}) => data.createEndpoint(parrent, name),
		modifyEndpoint : (parrent , {name}) => data.modifyEndpoint(parrent, name),
		deleteEndpoint : (parrent , {name}) => data.deleteEndpoint(parrent, name),
	},

	ModifyEndpoint : {
		setPath : (parrent, {path}) => parrent.setPath = path,
		setMethod : (parrent, {method}) => parrent.method = method,
		setDescription: (parrent, {description}) => parrent.description = description,
		modifyHeaders : (parrent) => parrent.headers,
		modifyResponceHeaders: (parrent) => parrent.responceHeaders,

		addQueryParam : (parrent, {params}) => 
			{params.forEach((value)=>{
				parrent.queryParams.push(value)
				parrent.query.query.push(value)
			});

			return params;
		},
		modifyBody : (parrent) => parrent,
		modifyOutput : (parrent) => parrent.output
	},

	ModifyHeaders : {
		setHeader : (parrent, {key, value}) => data.setHeader(parrent, key, value),
		deleteHeader : (parrent, {key}) => data.deleteHeader(parrent, key),
	},

	ModifyBody: {
		setBody : (parrent, {content}) => data.setBody(parrent, content),
	},

	ModifyOutput : {
		setHeaders : (parrent, {headers}) => parrent.headers = JSON.parse(headers),
		setBody : (parrent, {body}) => parrent.body = JSON.parse(body),
	}
}
