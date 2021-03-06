export let storedApis = {};

export default {
	getStoredApis : () => Object.values(storedApis),

	// API - domain \\

	modifyApi : (name) => {
		let api = storedApis[name];
		if (!api) {
			throw "Api does not exist";
		}
		return api;
	},

	createApi : (name) =>  {
		if( storedApis[name] ){
			throw "Api allready exists";
		}

		let newApi = {
			name : name,
			domain : "",
			endpoints : {}
		}
		storedApis[name] = newApi;
		return newApi;
	},

	deleteApi : (name) => {
		delete storedApis[name];
		return `Deleted api ${name}`
	},

	// ENDPOINTS \\

	createEndpoint : (api, name) => {
		if(api.endpoints[name]){
			throw "Endpoint allready exists";
		}
		let endpoint = {
			name: name,
			path : "",
			set setPath(value) {
				let params = value.match(new RegExp("(?<=\{)[^\}]+(?=\})", "g"));
				console.log(params);
				this.query.path = params === null ? [] : params;
				this.path = value;
			},
			method : undefined,
			description : "",
			headers : [],
			queryParams : [],
			query : {path: [], query: []},
			output: {
				body: {},
				headers: {},
			},
			body : "",

		}
		api.endpoints[name] = endpoint;
		return endpoint;
	},

	modifyEndpoint : (api, name) => {
		let endpoint = api.endpoints[name];
		if(!endpoint){
			throw "Endpoint does not exist";
		}
		
		return endpoint;
	},

	deleteEndpoint : (api, name) => {
		delete api.endpoints[name]
		return `Deleted Enpoint "${api.name}/${name}"`
	},

	// HEADERS \\

	setHeader : (headerList, key, value) => {
		let header = headerList.find(value => value.key === key);
		if(header){
			 header.value = value;
			return `Header value of key: ${key} has been replaced by a new value: ${value}.`
		}
		else{
			header = headerList.push({key : key, value : value});
			return `Header has been created with key: ${key} and value : ${value}`;
		}
	},

	deleteHeader : (headerList, key) => {
		let oldLength = headerList.length;
		for(let i = 0; i < headerList.length; i++){
			if(headerList[i].key === key){
				headerList.splice(i, 1);
				break;
			}
		}
		let newLength = headerList.length;
		if(newLength === oldLength){
			throw "header does not exist";
		}
		return `Header whith key: ${key}  deleted`
	},

	//Body\\
	setBody : (parent, content) => {
		
		if(parent.body === ""){ // if already empty
			if(content == ""){ // and no input
				parent.body = content; 
			}else{
				parent.body = content; 
				return `content: ${content}`
			}
	    }
	}
}

