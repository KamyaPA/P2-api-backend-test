export function filterResponse(responce, filterStr){
	let filterObject = createFilterObject(filterStr);
	switch(filterObject.objectType){
		case "object":
			responce = filterResponseObject(responce, filterObject.format);
			break;
		case "array":
			responce = filterResponseArray(responce, filterObject.format);
			break;
	}
	return responce;
}

function filterResponseObject(responce, format){
	let formatKeys = Object.keys(format);
	let responceKeys = Object.keys(responce);
	responceKeys.forEach(key => {
		if(!formatKeys.find(value => value === key)){
			delete responce[key];
		}
	})
	formatKeys.forEach(key => {
		if(format[key].objectType === "object"){
			responce[key] = filterResponseObject(responce[key], format[key].format);
		}
		else if(format[key].objectType === "array"){
			responce[key] = filterResponseArray(responce[key], format[key].format);
		}
	})
	return responce;
}
function filterResponseArray(responce, format){
	function setArgument (argumentStr, object){
		if(argumentStr.charAt(0) === "'"){
			return argumentStr.match(/(?<=\')[^\s]+(?=\')/g);
		}
		else{
			return argumentStr.split(".").reduce((before, current) => current = before[current], object);
		}
	}
	// Options And resizing of array
	switch(format.options.type){
		case "all":
			break;
		case "between":
			let numbers = format.options.argument.match(/[\d]+/g);
			responce = responce.slice(numbers[0], numbers[1]);
			break;
		case "at":
			responce = [responce[format.options.argument]];
			break;
		case "eq":
			responce = responce.filter((value) => {
				let arg1 = setArgument(format.options.argument[0], value);
				let arg2 = setArgument(format.options.argument[1], value);
				return arg1 == arg2;
			}) 
	}
	// Do nested objects or arrays of this array
	if(format.contains.objectType === "object"){
		responce.map(value => filterResponseObject(value, format.contains.format));
	}
	else if(format.contains.objectType === "array"){
		responce.map(value => filterResponseArray(value, format.contains.format));
	};
	return responce;
}

// Filters object
function createFilterObject(filterStr){
	let filterArray = filterStr.match(/([:\(\)\[\]\{\}]|[^\s:\(\)\[\]\{\}]+)/g);
	return createObject(filterArray, {objectType : "value", format : {}});
}

// The recursive function that creates the object that will be used to filter the response
function createObject(filterArray, object){
	// Check for data
	let argument = filterArray.shift();
	object.objectType =  argument === "{" ? "object" : argument === "[" ? "array" : undefined;
	if(!object.objectType){
		throw "Not a valid char after ':'";
	}

	let activeObject;
	
	// OBJECT
	if(object.objectType === "object"){
		while((argument = filterArray.shift()) !== "}"){
			if(argument === undefined) throw "Wrong syntax in filter forgotten an '}'";
			if(argument === ":"){
				createObject(filterArray, activeObject);
			}else{
				object.format[argument] = {
					objectType : "value",
					format : {}
				}
				activeObject = object.format[argument];
			}
		}
	}
	// ARRAY
	if(object.objectType === "array"){
		object.format["contains"] = {
			objectType : "value",
			format : {},
		}
		object.format["options"] = {
			type : "all",
			argument : "",
		};
		while((argument = filterArray.shift()) !== "]"){
			if(argument === undefined) throw "Wrong syntax in filterforgotten an ']'";
			switch(argument){
				case ':':
					createObject(filterArray, object.format.contains);
					break;
				case 'all':
					object.format.options.type = argument;
					break;
				case 'between':
					object.format.options.type = argument;
					object.format.options.argument = filterArray.shift();
					break;
				case 'at':
					object.format.options.type = argument;
					object.format.options.argument = filterArray.shift();
					break;
				case 'eq':
				case 'gt':
				case 'lt':
					object.format.options.type = argument;
					object.format.options.argument = [filterArray.shift(), filterArray.shift()];
					break;
			}
		}
	}
	return object;
}

