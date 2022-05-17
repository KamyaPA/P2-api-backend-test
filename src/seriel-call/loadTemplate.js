import fs from 'fs';


// Setup
function loadTemplates(){
	let templateStr = fs.readFileSync("./src/seriel-call/template.js", "utf-8");
	let templateArr = templateStr.match(/(?<=(\/\/#))[^@]+(?=(\/\/@))/gm);
	let templateObj = {};
	templateArr.forEach((string) => {
		let strArr = string.split("#").map(value => value.trim().replace(/\s+/g,' '));
		templateObj[strArr[0]] = strArr[1];
	});
	return templateObj;
}

const templates = loadTemplates();
const RAW = "<@raw>"

// Creates the code
function setTemplate(template, parameters = []){
	let templateStr = templates[template];
	let argumentStr;
	parameters.forEach((parameter, index) => {
		templateStr = templateStr.replace(`_${index}_`, createJsStr(parameter));
	})
	return RAW + templateStr;
}

// Creates the right formatted string for java Script to replace the parameters  
function createJsStr(parameter){
	if(Array.isArray(parameter)){
		return createArrStr(parameter);
	} else { 
		switch(typeof(parameter)){
			case 'boolean':
			case 'number':
				return parameter.toString();
			case 'string':
				if(parameter.slice(0, RAW.length) === RAW){
					return parameter.slice(6);
				} else {
					return '"' + parameter + '"';
				}
			case 'object':
				return createObjStr(parameter);
		}
	}
}

function createArrStr(parameter){
	let rtn = '[';
	parameter.forEach(value => {
		rtn += createJsStr(value) + ',';
	})
	return rtn.replace(/.$/, ']');
}

function createObjStr(parameter){
	let rtn = '{';
	let keys = Object.keys(parameter);
	let values = Object.values(parameter);

	for(let i in values){
		rtn += keys[i] + ":" +  createJsStr(values[i]) + ',';
	}
	return rtn.replace(/.$/,'}');
}

// Create the server 
export async function createServer(objectTemplate){
	let rtn = setTemplate("Setup").slice(RAW.length);
	rtn += setTemplate("Setup HTTP", [
		objectTemplate.reduce((code, {backend}) => (code + (createEndpoint(backend))), RAW)
	]).slice(RAW.length);
	rtn += setTemplate("Start Server").slice(RAW.length);
	return rtn;
}

// Endpoints
function createEndpoint(endpointTemplate){
	return setTemplate("Create Endpoint", [
		endpointTemplate.endpoint, 
		endpointTemplate.api.reduce((code, api) => (code + createApi(api)), RAW) + 
		setTemplate("Create Response", [RAW + "JSON.stringify(R)"]).slice(RAW.length)
	]).slice(RAW.length) }

// APIs
function createApi(apiTemplate){
	let argvObj = createArgvObj(apiTemplate.input.headers, {constants:{}, arrays:{}});
	argvObj = createArgvObj(apiTemplate.input.query, argvObj);
	let filter = createFilter(apiTemplate.output.body, apiTemplate.output.header);

	if(Object.values(argvObj.arrays).length > 0){
		return setTemplate("Multi Call", [
			createArrayCallObjCode(argvObj.arrays, 0, apiTemplate.domain, apiTemplate.endpoint, argvObj.constants, filter)
		]).slice(RAW.length);
	} else {
		let argv = [];
		for(let [key, value] of Object.entries(argvObj.constants)){
			argv.push({key : key, value : RAW + `R[${value[0]}]["${value[1]}"]`});;
		}
		return setTemplate("Single Call", [
			setTemplate("Call Object", [
				apiTemplate.domain, apiTemplate.endpoint, argv, filter
			])
		]).slice(RAW.length);
	}
}

function createArgvObj(array, start){
	return array.reduce((argv, item) => {
		let arg = item.id.split(/\s+/);
		if(arg[1].match(/\[[^]+\]/)){
			arg[1] = arg[1].slice(1, -1);
			argv.arrays[item.key] = arg;
		} else {
			argv.constants[item.key] = arg;
		}
		return argv;
	}, start)
}

function createArrayCallObjCode(argvArray, index, domain, endpoint, constants, filter){
	let arrKeys = Object.keys(argvArray);
	let constKeys = Object.keys(constants);
	if(index === arrKeys.length){
		return setTemplate("Concat", [RAW + `p${index - 1}`, 
			setTemplate("Call Object", [
				domain, 
				endpoint, 
				arrKeys.map((key, i) => ({key: key, value: RAW + `c${i}`}))
					.concat(constKeys
					.map(key => ({key : key, value : RAW + `R[${constants[key][0]}]["${constants[key][1]}"]`}))), 
				filter])]);
	} else if (index === 0){
		return setTemplate("Reduce", [RAW + `R[${argvArray[arrKeys[index]][0]}]["${argvArray[arrKeys[index]][1]}"]`, RAW + "p0", RAW + "c0", RAW + "[]", 
			createArrayCallObjCode(argvArray, index + 1, domain, endpoint, constants, filter)]);
	} else {
		return setTemplate("Reduce", [RAW + `R[${argvArray[arrKeys[index]][0]}][${argvArray[arrKeys[index]][1]}]`, RAW + `p${index}`, RAW + `c${index}`, RAW + `p${index - 1}`, 
			createArrayCallObjCode(argvArray, index + 1, domain, endpoint, constants, filter)]);
	}
}

// Create filter
function createFilter(config, headers){
	let rtn = ""
	if(Array.isArray(config)){
		rtn += "[" + fitlerArr(config) + "]";
	} else {
		rtn += "{" + filterObj(config) + "}";
	}
	headers.forEach(header => {
		rtn += "#" + header.key + " " + header.id;
	})
	return rtn;
}

function filterObj(config){
	let rtn = "";
	let keys = Object.keys(config);
	for(let key of keys){
		if(Array.isArray(config[key])){
			rtn += key + ":[" + fitlerArr(config[key]) + "]";
			rtn.replace(/.$/, "]");
		} else {
			switch(typeof(config[key])){
				default:
					if(config[key].match(/[\[\]]/)){
						rtn += `${key}[=]${config[key].match(/[^\[\]]+/g)} ` 
					} else {
						rtn += `${key}=>${config[key]} ` 
					}
					break;
				case "object":
					rtn += key + ":{" + filterObj(config[key]) + "}";
					break;
			}
		}
	}
	return rtn;
}

function fitlerArr(config){
	let rtn = "";
	for(let argument of config){
		if(Array.isArray(argument)){
			rtn += ":[" + filterArr(argument) + "]";
		} else {
			switch(typeof(argument)){
				default:
					rtn += argument;
					break;
				case "object":
					rtn += ":{" + filterObj(argument) + "}";
					break;
			}
		}
	}
	return rtn;
}
