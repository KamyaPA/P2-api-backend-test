export function filterResponse(responce, headers, filterStr, filteredResonce){
	let rtnObj = {};
	let filterObject = createFilterObject(filterStr);
	filterObject.forEach(({objectType, format}) => {
		switch(objectType){
			case "object":
				responce = filterResponseObject(responce, format, rtnObj);
				break;
			case "array":
				responce = filterResponseArray(responce, format, rtnObj);
				break;
			case "header":
				rtnObj[format.assignTo] = headers.get(format.name);
				console.log("hi");
				break;
		}
	})
	return rtnObj;
}
// Deletes from object according to the filter object
function filterResponseObject(responce, format, rtnObj){
	let formatKeys = Object.keys(format);
	let responceKeys = Object.keys(responce);
	responceKeys.forEach(key => {
		if(!formatKeys.find(value => value === key)){
			delete responce[key];
		}
	})
	formatKeys.forEach(key => {
		if(format[key].objectType === "object"){
			responce[key] = filterResponseObject(responce[key], format[key].format, rtnObj);
		} else if(format[key].objectType === "array"){
			responce[key] = filterResponseArray(responce[key], format[key].format, rtnObj);
		} else if(format[key].objectType === "value" && format[key].rtn.isOn){
			if(format[key].rtn.isArray){
				if(rtnObj[format[key].rtn.name]){
					rtnObj[format[key].rtn.name].push(responce[key]);
				} else {
					rtnObj[format[key].rtn.name] = [responce[key]];
				}
			} else {
				rtnObj[format[key].rtn.name] = responce[key];
			
			}
		}
	})
	return responce;
}


// Deletes from array according to the filter object
function filterResponseArray(responce, format, rtnObj){
	function setArgument (argumentStr, object){
		if(argumentStr.charAt(0) === "'"){
			return argumentStr.match(/(?<=\')[^\s]+(?=\')/g)[0];
		}
		else{
			return argumentStr.split(".").reduce((before, current) => current = before[current], object);
		}
	}
	function filterLogicOperators(option, logicFunc){
		return responce.filter((value) => {
			let arg1 = setArgument(option.argument[0], value);
			let arg2 = setArgument(option.argument[1], value);
			function checkRegex(arg, cmp){
				if(arg.charAt(0) === "/"){
					let match = arg.match(/((?<=\/)[^]*(?=\/)|[gims]*)/g);
					if(cmp.match(new RegExp(match[1], match[3]))){
						arg1 = true;
						arg2 = true;
						return true
					} else {
						return false;
					}
				}
			}

			// Regex?
			if(!checkRegex(arg2, arg1))
				checkRegex(arg1, arg2);
			// Check
			return logicFunc(arg1, arg2);
		}) 
	}
	// Options And resizing of array
	format.options.forEach((option) => {
		switch(option.type){
			case "all":
				break;
			case "between":
				let numbers = option.argument.match(/[\d]+/g);
				responce = responce.slice(numbers[0], numbers[1]);
				break;
			case "at":
				responce = [responce[option.argument]];
				break;
			case "eq":
				responce = filterLogicOperators(option, (a, b) => a == b);
				break;
			case "ne":
				responce = filterLogicOperators(option, (a, b) => a != b);
				break;
			case "lt":
				responce = filterLogicOperators(option, (a, b) => a < b);
				break;
			case "gt":
				responce = filterLogicOperators(option, (a, b) => a > b);
				break;
			case "lte":
				responce = filterLogicOperators(option, (a, b) => a <= b);
				break;
			case "gte":
				responce = filterLogicOperators(option, (a, b) => a >= b);
				break;
		}
	})
	// Do nested objects or arrays of this array
	if(format.contains.objectType === "object"){
		responce.map(value => filterResponseObject(value, format.contains.format, rtnObj));
	} else if(format.contains.objectType === "array"){
		responce.map(value => filterResponseArray(value, format.contains.format, rtnObj));
	} else if(format.contains.objectType === "value" && format.contains.rtn.isOn){
		if(format.contains.rtn.isArray){
			if(rtnObj[format.contains.rtn.name] === undefined){
				rtnObj[format.contains.rtn.name] = [];
			}
			responce.forEach((value) => {
				rtnObj[format.contains.rtn.name].push(value);
			})
		} else {
			rtnObj[format.contains.rtn.name] = responce[responce.length - 1];
		}
	} 
	return responce;
}



// Filters object
function createFilterObject(filterStr){
	let filterArray = filterStr.match(/((=>)|\[=\]|(\[=\])|('[^]+')|[:\(\)\[\]\{\}\#]|[^\s:\(\)\[\]\{\}=>]+)/g);
	let rtn = [];
	while(filterArray.length){
		rtn.push(createObject(filterArray, {objectType : "value", format : {}}));
	}
	return rtn;
}

// The recursive function that creates the object that will be used to filter the response
function createObject(filterArray, object){
	// Check for data
	let argument = filterArray.shift();
	object.objectType =  argument === "{" ? "object" : argument === "[" ? "array" : argument === "#" ? "header": undefined ;
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
			} else if(argument === "=>"){
				activeObject.rtn.isOn = true;
				activeObject.rtn.name = filterArray.shift();
				activeObject.rtn.isArray = false;
			} else if(argument === "[=]"){
				activeObject.rtn.isOn = true;
				activeObject.rtn.name = filterArray.shift();
				activeObject.rtn.isArray = true;
			}else{
				activeObject = object.format[argument] = {
					objectType : "value",
					rtn : {isOn : false},
					format : {}
				}
			}
		}
	} else if(object.objectType === "array"){
		// ARRAY
		object.format["contains"] = {
			objectType : "value",
			rtn : {isOn : false},
			format : {},
		}
		object.format["options"] = [];
		const addOption = (type, argument) => ({type: type, argument: argument});

		while((argument = filterArray.shift()) !== "]"){
			if(argument === undefined) throw "Wrong syntax in filterforgotten an ']'";
			switch(argument){
				case ':':
					createObject(filterArray, object.format.contains);
					continue;
				case '=>':
					object.format.contains.rtn.isOn = true;
					object.format.contains.rtn.name = filterArray.shift();
					object.format.contains.rtn.isArray = false;
					continue;
				case '[=]':
					object.format.contains.rtn.isOn = true;
					object.format.contains.rtn.name = filterArray.shift();
					object.format.contains.rtn.isArray = true;
					continue;
				case 'all': // No arguments
					object.format.options.push(addOption(argument, ""));
					break;
				case 'between': // One argument
				case 'at':
					object.format.options.push(addOption(argument, filterArray.shift()));
					break;
				case 'eq': // Two arguments
				case 'ne':
				case 'lt':
				case 'gt':
				case 'gte':
				case 'lte':
					object.format.options.push(addOption(argument, [filterArray.shift(), filterArray.shift()]));
					break;
			}
		}
	} else if (object.objectType === "header"){
		object.format.name = filterArray.shift();
		object.format.assignTo = filterArray.shift();
	} 
	return object;
}

