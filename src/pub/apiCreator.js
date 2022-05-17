document.addEventListener("DOMContentLoaded", function(event) {
    init();
});

//Demo Api
//output bliver ikke gemt som imput ordentligt
//checkech caching når object bliver valgt flere gange
//giv output ende værdier en id, og sæt imput der vælger dem lig den id.
//hvis method bliver kaldt flere gange bliver dom ikke wiped på forhånd
//OutputFilter til sidst

//Optimize:
    //endpoint:
        //HeaderList updates with addHeader / removeHeader rather than making a new list every time.

const testApi = {
    Name : "testApi",
    Endpoint : [
        {
            Path: "getCard2",
            Method: [
                {
                    Method: "Get",
                    Headers : {
                        Auth: "oauth",
                        User: "string",
                        pass: "string",
                    },
                    query: [
                        "id",
                        "boxNr",
                        "test3",
                    ],
                    
                    Body : {
                        required: "false",
                    },
                    Output : {
                        Headers : {
                            StatusCode : "number",
                            Accept : "string",
                            User : "string",
                        },
                        Body : {
                            "Content-type" : "xml",
                            "Content-size" : "mB",
                        }
                    }
                },
            ]
            
        },
        {
            Path: "getCard1",
            Method: [  
                {
                    Method: "Get",
                    Headers : {
                        Auth: "oauth",
                        User: "string",
                        pass: "string",
                    },
                    query: [
                        "id",
                        "boxNr",
                        "test3",
                    ],
                    
                    Body : {
                        required: "false",
                    },
                    Output : {
                        Headers : {
                            StatusCode : "number",
                            Accept : "string",
                            User : "string",
                        },
                        Body : {
                            "Content-type" : "xml",
                            "Content-size" : "mB",
                        }
                    }
                },
                {
                    Method: "POST",
                    Headers : {
                        Auth: "oauth",
                        User: "string",
                        pass: "string",
                    },
                    query: [
                        "id",
                        "boxNr",
                        "test3",
                    ],
                    
                    Body : {
                        required: "false",
                    },
                    Output : {
                        Headers : {
                            StatusCode : "number",
                            Accept : "string",
                            User : "string",
                        },
                        Body : {
                            "data": {
                                "hero": {
                                  "name": "string",
                                  "friends": [
                                    {
                                      "name": "string",
                                      "age": "string",
                                    },
                                  ]
                                }
                            }
                        }
                    }
                }
            ]  
        }
    ],
}

let selectedOutputs = [];
let apiList = [testApi];
let createdEndpoints = [];

function init(){
    const container = document.querySelector(".Creator");


    const endpointButton = document.createElement("button");
    container.append(endpointButton);
    endpointButton.innerText = "Add Endpoint"
    endpointButton.addEventListener("click", addEndpointClick)


    const endpoint = new Endpoint();
    container.querySelector(".endpointContainer").append(endpoint.dom);


    const submit = document.createElement("button");
    submit.innerText = "submit";
    container.append(submit);
    submit.addEventListener("click", submitClick);


}

function addApi(endpoint){
 
    return new Api(endpoint);

}



function Api(endpoint) {
    // ---- dom element for API box ---
    const dom = document.createElement("div");
    dom.classList = "apiBox";

    this.dom = dom;
    this.endpoint = endpoint;

    this.init = () => {
        
        endpoint.createdApis.push(this);

        this.id = endpoint.createdApis.length;

        // ----- create domain selection element---------
        const domainContainer =document.createElement("div");
        domainContainer.classList = "selectionBox";
        dom.append(domainContainer);


        this.selectDom = createSelect("apiSelect", "No Api's found","apiSelect");


        domainContainer.append(createLabel("apiSelect", "Select API: "));
        domainContainer.append(this.selectDom);


        //Updates chosable domains
        this.updateApiSelectOptions();

        //add event listener for when selection is changed.
        this.selectDom.addEventListener("change", updateDomain, false);
        //------------------------------------


        //--------Add delete functionality to the box----
        const deleteBut = document.createElement("button");
        deleteBut.innerText= "X";
        deleteBut.addEventListener("click", deleteApi);

        dom.append(deleteBut);

        //---------------------------------------------

    }

    

    this.delete = () => {
        this.dom.innerHTML="";
        this.dom.outerHTML = "";
    }

    this.filter = {
        dom: document.createElement("div"), //;querySelector(".filterBox"),

        addFilterParam: (object) => {
            createOptions([object],"key", this.filter.dom.querySelector(".outputField"))
        },

        removeFilterParam: (id) => {
            let dom = this.filter.dom.querySelector(".outputField");
            for(option of  dom.children){
                if(option.innerText == id)
                    return option.outerHTML = "";
            }
        },

        onSelect: (value) => {
            
            for(object of this.Output.selectedList){
                if(object.key == value){
                    this.filter.selectedObject = object;
                    break;
                }
            }

            

            //test, skal laves om til value type
            const filterContainer = this.filter.dom;
            if(!this.filter.dom.querySelector(".outputField")?.nextSibling){
                
                filterContainer.append(document.createElement("div"));
            }
            const filterDiv = this.filter.dom.querySelector("div");
            filterDiv.innerHTML = "";

            filterDiv.append(createLabel("intFilter", "Filter based on: ", "block"));
            
            

            if(value == "index" || this.filter?.selectedObject?.valueType == "number" ) {
                //if valuetype int
                
                //filterContainer.append(createLabel("intFilter", "Filter based on: ", "block"));
                const intOpperatorSelect = createSelect("intFilter filter","","intFilter");
                filterDiv.append(intOpperatorSelect);
                const intOpperators = [{symbol : "<"},{symbol: "<="},{symbol: ">"}, {symbol: ">="},{symbol: "=="},{symbol: "!="}];
                createOptions(intOpperators,"symbol", intOpperatorSelect);
                
                filterDiv.append(createInput("FilterValueInput", "Insert value here"));
            }
            else if(value != ""){
                //if valuetype string
                const stringSelect = createSelect("stringFilter filter","","stringFilter");
                filterDiv.append(stringSelect);
                const stringSelects = [{symbol : "Equal"},{symbol: "Contains"}];
                createOptions(stringSelects,"symbol", stringSelect);
                
                filterDiv.append(createInput("FilterValueInput", "Insert value here"));
            }

        },

        createFilter: () => {
            const filterContainer = this.filter.dom;
            filterContainer.classList = "box filterBox";
            
            filterContainer.append(createLabel("", "Filter", "block"));
            this.dom.appendChild(filterContainer);
            
            let filterParamDom = createSelect("outputField","", "outputField");
            filterParamDom.addEventListener("change",filterChange)
            filterContainer.append(createLabel("outputField", "Select filter paramater: "));
            filterContainer.append(filterParamDom);
            //Lav array over selectet output!
            let option = document.createElement("option");
            option.value = "index";
            option.innerText = "index";
            filterParamDom.append(option);
    
        }
    }

    

   
    this.createBody = () => {
        let label = document.createElement("label");
        label.innerHTML="Body: ";
        this.dom.append(label)
/*
        let dom = document.createElement("div");
        dom.classList = "apiBody box";
        this.dom.append(dom);
        Object.entries(this.methodObj.body).forEach(valueSet => {
            dom.append(createLabel("", valueSet[0] + "  :  " + valueSet[1]));
        
        });
*/

    }

    this.Query = {
        queryList: [],
        setup: () => {

            //-------------------dom setup ----------------
            let label = createLabel("", "Query: ");
            label.style = "display: block;"
            this.dom.append(label);

            this.queryContainer = document.createElement("div"); 
            this.queryContainer.classList="queryContainer";
            this.dom.append(this.queryContainer);
            this.queryContainer.innerHTML = "";

            let container = document.createElement("div");
            container.addEventListener("click", inputClick)
            container.classList = "query box";
            //console.log(this.methodObj);
            // ------------------------------------------------

            for (query of this.methodObj.query){
                let queryDom = document.createElement("div");
                queryDom.append(createLabel("", query));
                queryDom.append(createLabel("", "   - Select Value : "));
                let input = createSelect("header querySelect");
                queryDom.append(input);
                container.append(queryDom);
                this.Query.queryList.push(
                    {inputDom: input,
                    key:query,
                    }
                );
            }
            
            this.queryContainer.append(container);
        },

        update: (dom) => {

            dom.innerHTML= "";

            this.endpoint.Header.headerOptionList.forEach(optionDom => {
                let copy = optionDom.cloneNode(true);
                    copy.refrenceId = optionDom.refrenceId;
                    dom.append(copy);
                
            })

            
            this.endpoint.API.outputOptionDoms.forEach(option => {
                if(option.id < this.id){
                    let copy = option.cloneNode(true);
                    copy.refrenceId = option.refrenceId;
                    dom.append(copy);
                    
                }
            })
        },

        getList: () => {
            
            const queryList = [];
            this.Query.queryList.forEach(query => {
                queryList.push({
                    key: query.key,
                    id: query.inputDom.selectedOptions[0].id + " " + query.inputDom.selectedOptions[0].value,
                })
                
            })
            return queryList;
            
    
        }
    }

    this.Headers = {
        headerList: [],

        createHeaders: () => {
            //-------------------dom setup ----------------
            let label = createLabel("", "Headers: ");
            label.style = "display: block;"
            this.dom.append(label);
    
            this.headerContainer = document.createElement("div"); 
            this.headerContainer.classList="apiHeadersContainer";
            this.dom.append(this.headerContainer);
            this.headerContainer.innerHTML = "";
    
            let container = document.createElement("div");
            container.addEventListener("click", inputClick)
            container.classList = "apiHeaders box";
           // console.log(this.methodObj);
            // ------------------------------------------------
    
     
            for (valueSet of Object.entries(this.methodObj.headers)){
                let header = document.createElement("div");
                header.append(createLabel("",valueSet[0] + " - Value type:"))
                header.append(createLabel("", valueSet[1]));
                let input = createSelect("header " + valueSet[1]);
                header.append(input);
                container.append(header);
                this.Headers.headerList.push(
                    {inputDom: input,
                    key: valueSet[0],
                    ValueType: valueSet[1],
                    }
                );
            }
            
            this.headerContainer.append(container);
        },

        getHeaderList: () => {
            const headerList = [];
            this.Headers.headerList.forEach(header => {
                headerList.push({
                    key: header.key,
                    id: header.inputDom?.selectedOptions[0]?.id + " " + header.inputDom?.selectedOptions[0]?.refrenceId,
                })
                
            })
            return headerList;
        },

        update: (dom) => {

            dom.innerHTML= "";

            this.endpoint.Header.headerOptionList.forEach(optionDom => {
                //omskrinv til at være i forhold til dom type
                if(dom.classList.contains(optionDom.valueType)){
                    
                    let copy = optionDom.cloneNode(true);
                        copy.refrenceId = optionDom.refrenceId;
                        dom.append(copy);
                }
            })

            
            this.endpoint.API.outputOptionDoms.forEach(option => {
                if(option.id < this.id){
                    if(dom.classList.contains(option.valueType)){
                        let copy = option.cloneNode(true);
                        copy.refrenceId = option.refrenceId;
                        dom.append(copy);

                    }
                }
            })
        }
    }

    //#region ---------------------API Object -----------------
    //gets called from outside the class, based on the dom element a event hits.
    this.updateDomain = async (value) => {
       // console.log("test");
        this.removeApiContent();
        this.selectedDomain = value;
        this.domainObj = await this.getDomainObj(this.selectedDomain);
        
        const domainSelect = this.dom.querySelector(".selectionBox .apiSelect");

        // If there isnt a labele for selectin an endpoint, create one.
        if(domainSelect.nextSibling == null){

            domainSelect.parentNode.append(createLabel("endpointSelect","Select Endpoint: "));
            const select = createSelect("endpointSelect","","endpointSelect");
            domainSelect.parentNode.append(select);
            select.addEventListener("change", updateEndpoint);
            
        }

        const endpointSelectDom = this.dom.querySelector(".selectionBox .endpointSelect");
        this.endpointSelectDom = endpointSelectDom;
        if(value != ""){
            createOptions(this.domainObj, "name", endpointSelectDom);
            
            if(this.endpointSelectDom){
                this.updateEndpoint(endpointSelectDom.value);
            }
        }
        else{
            this.updateEndpoint("");
        }
    }

    this.getDomainObj = async(domain) => {

        let responseObj = (await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query : `
                query {
                    apis(name :"` + domain + `"){
                        name
                        domain
                        endpoints{
                            name
                            path
                        }
                    }
                }` 
            }),
        })
        .then(res => res.json())).data.apis[0];
        console.log(responseObj.endpoints);
        return responseObj.endpoints;

        for(apiObj of apiList){
            if (apiObj.Name == domain)
                return apiObj;

            
        }
        return "";
    }


    //gets called from outside the class based on dom event.
    this.updateEndpoint = async (value) => {
        this.removeApiContent()
        this.selectedEndpoint = value;
        if(value != ""){
            this.endpointObj = await this.getEndpointObj(this.selectedEndpoint);
            //console.log(this.obj);
       


            const EndpointSelect = this.dom.querySelector(".selectionBox .endpointSelect");

            // If there isnt a labele for selectin an endpoint, create one.
            if(EndpointSelect.nextSibling == null){

                EndpointSelect.parentNode.append(createLabel("MethodSelect","Select Method: "));
                
            }

            //If there exist a box delete it
            if(this.dom.querySelector(".selectionBox .methodSelect"))
                this.dom.querySelector(".selectionBox .methodSelect").outerHTML="";

            //create enpoint select and propegate it 
            EndpointSelect.parentNode.append(createSelect("methodSelect","","methodSelect"));
            const methodSelectDom = this.dom.querySelector(".selectionBox .methodSelect");
            this.methodSelectDom = methodSelectDom
            if(this.endpointObj[0].method != undefined){
                
                createOptions(this.endpointObj, "method", methodSelectDom);

                methodSelectDom.addEventListener("change", updateMethod);
            }
        }
        else{
            if(this.endpointSelectDom && this.selectedDomain == ""){
                this.endpointSelectDom.innerHTML = "";
            }
            this.updateMethod("");
            
        }

    }

    this.getEndpointObj = async(Endpoint) =>{

        let responseObj = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query : `
                query {
                    apis(name :"` + this.selectedDomain + `"){
                        name
                        domain
                        endpoints(name:"`+ Endpoint + `"){
                            name
                            path
                            method
							query
							headers{
								key
								value
							}
							output {
								headers
								body
							}
                        }
                    }
                }` 
            }),
        })
        .then(res => res.json());
        console.log(responseObj);
        return responseObj.data.apis[0].endpoints;

        for(endpointObj of this.domainObj.Endpoint){
            if(endpointObj.Path == Endpoint){
                return endpointObj;
            }
        };
        
        return "";
        
    }

    this.updateMethod = async (value) => {
        this.removeApiContent();
        this.selectedMethod = value;
        if(value != ""){
        this.methodObj = await this.getMethodObj(this.selectedMethod);
            if(this.methodObj != "") {
                //console.log(this.obj);
                this.Query.setup();
                this.Headers.createHeaders();
                this.endpoint.Header.updateHeaderOptions();
                this.createBody();
                this.Output.createOutput();

                this.filter.createFilter(); 
            }
        }
        else{
            if(this.methodSelectDom && this.selectedEndpoint == ""){
                this.methodSelectDom.innerHTML = "";
                
            }
        }

    }

    this.getMethodObj = async(method) =>{

		let methodObj = this.endpointObj.filter(obj => (obj.method == method))
		return methodObj[0];
        for(methodObj of this.endpointObj.Method){
            if(methodObj.Method == method){
                return methodObj;
            }
        }
        
            
        return "";
        
    }

    //#endregion --------------------------

    //removes all other boxes than select API, this is called when any select under Select API is changed
    this.removeApiContent = () => {

        Object.entries(this.dom.children).forEach(element =>{
            if(!(element[1].localName == "button" || element[1].classList.contains("selectionBox") )){
                element[1].innerHTML="";
                this.dom.removeChild(element[1]);
                
            }
            
        })
        this.filter.dom.innerHTML = "";
    }
    
    //~note    potentially make into a prototype?? also domain select ikke api select
    this.updateApiSelectOptions = async() => {
        //extract know domains, and place them in option pool
        await fetch("/graphql",{
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query : `
                query {
                    apis{
                        name
                        domain
                    }
                }` 
            }),
        })
        .then(res => res.json())
        .then(res => apiList = res.data.apis);
        apiList.forEach(api => {
            let option = document.createElement("option");
            option.value = api.name;
            option.innerText = api.name;
            this.selectDom.append(option);
        });
    }

    this.Output = {
        dom: document.createElement("div"),
        selectedList : [],
        outputOptionDoms: [],
        //keeps track of number of checkable outputs, in order to give them unique id's.
        outPutNr: 0,

        listUpdate: (eventDom) => {
            //called from outside API
            if (eventDom.checked){
                const object = {}
                object.key  = eventDom.id.slice(1);
                object.data = eventDom.data;
                object.valueType = eventDom.nextSibling.innerText.split(': ')[1];
                object.dom = eventDom;
                object.id = this.id;
                object.Area = eventDom.closest(".box").previousSibling.innerText.slice(0, -1);
                this.Output.selectedList.push(object);
               // console.log(object);
                this.filter.addFilterParam(object);
            }
            else{
                this.Output.selectedList = this.Output.selectedList.filter(obj => obj.dom != eventDom);
                
                this.filter.removeFilterParam(eventDom.id);       
            }
            this.Output.outputOptionDoms = [];
            this.Output.selectedList.forEach(output => {
                let option = document.createElement("option");
                option.value = output.key;
                option.id = output.id;
                option.valueType = output.valueType;
                option.innerText = "Api : " + output.id + " " + output.key;
                option.refrenceId = output.dom.refrenceId;
                this.Output.outputOptionDoms.push(option);
            })
            this.endpoint.Header.updateHeaderOptions();
           // console.log(this.Output.selectedList);
        },

        //Create the doms 
        createOutput: () => {
            let label = createLabel("", "Output: ");
            label.style = "display: block;";
            this.dom.append(label);

            const container = this.Output.dom;
            container.classList = "Output box";
            this.dom.append(container);


            container.addEventListener("change", updateOutputList);

            //headers
            let headerLabel = createLabel("", "Headers: ");
            container.append(headerLabel);

            const headerContainer = document.createElement("div");
            headerContainer.classList = "headers box";
            container.append(headerContainer);
            Object.entries(this.methodObj.output.headers).forEach(valueSet => {
                let container = document.createElement("div");
                
                let input = document.createElement("input");
                input.type = "checkbox";
                input.id = this.endpoint.id + this.id + valueSet[0];
                
                container.append(input);
                container.append(createLabel(this.endpoint.id + this.id + valueSet[0], valueSet[0] + "  :  " + valueSet[1]));
                headerContainer.append(container);

            });


            //body
            const bodyContainer = document.createElement("div");
            bodyContainer.classList = "body box";


            let bodyLabel = createLabel("", "Body: ");
            container.append(bodyLabel);

            container.append(bodyContainer);
            let valueSet = Object.entries(this.methodObj.output.body)[0]; //.forEach(valueSet => {


            if(typeof valueSet[1] == "object"){
                this.Output.readObj(valueSet[1], this.Output.dom.querySelector(".body"));
            }

            

        },

        
        readObj: (object, dom, parent = "") => {
            let list = "";
            list = this.Output.getParent(parent, list);
           // console.log(list);
            

            Object.entries(object).forEach(valueSet => {
               // console.log(valueSet);
                let container = document.createElement("div");

                let element = {
                    key : valueSet[0],
                    valueType: valueSet[1],
                    parent: parent
                }
                if (parent.valueType == "array"){
                    element.key = parent.key;
                }
                if(Array.isArray(valueSet[1]) ){
                    container.append(createLabel("", valueSet[0] + "  :  ["));
                    let dom = document.createElement("div");
                    dom.classList= "indent";
                    
                    container.append(dom);

                   // console.log("array:");

                    element.valueType = "array";

                    this.Output.readObj(valueSet[1], dom, element);

                    container.append(createLabel("","]"));
                }
                else if(typeof valueSet[1] == "object"){
                    if(parent.valueType != "array"){
                        container.append(createLabel("", valueSet[0] + "  :  {"));
                    }
                    else{
                        container.append(createLabel("", "{"));
                    }
                    let dom = document.createElement("div");
                    dom.classList= "indent";
                    container.append(dom);
                    element.valueType = "object";
                    this.Output.readObj(valueSet[1], dom, element);
                    container.append(createLabel("","}"));
                }
                else{
                    let input = document.createElement("input");

                    input.type = "checkbox";
                    input.id = this.endpoint.id +  this.id + list + valueSet[0];
                    if(list.includes("[{")){
                        input.refrenceId =  "["+ this.Output.outPutNr++ + "]";
                    }
                    else{
                        input.refrenceId =   this.Output.outPutNr++;
                    }
                    input.data = parent;
                    container.append(input);
                    
                   
                    element.valueType = valueSet[1];
                    container.append(createLabel(this.endpoint.id + this.id + list + valueSet[0], valueSet[0] + "  :  " + valueSet[1]));
                    
                }

                dom.append(container);
            });
        },

        getParent: (parent, list) => {
            if(parent != ""){
                
                list +=  this.Output.getParent(parent.parent, list)

                if(parent.parent.valueType != "array" && parent.valueType != "array"){ //&& parent.valueType != "array"
                    list += parent.key + "." ;
                }
                else if(parent.valueType == "object"){
                    list += "[{";
                    
                }
                else{
                    list += parent.key
                }
            }
            return list
        },

        //Create a json showing the chosen output paramaters
        getBodyObj: (list, index, object, id) => {
            let param = list[index]
            //Higer layer dosent exist go down
            
            if(!object[param]){
                let tmpObj = {};
                //check if layer is array or object
                if(param == ""){
                    //check length of list to go deeper
                    if(typeof object[0] == "object"){
                        //tmpObj = object[0];
                        return [Object.assign(this.Output.getBodyObj(list, ++index, tmpObj, id), object[0])] ; //object[0]
                    }
                    if(list.length > index + 1){
                        return [this.Output.getBodyObj(list, ++index, tmpObj, id)];
                    }
                }
                else{
                    //check length of list to go deeper
                    if(list.length > index + 1){
                        return {[param]: this.Output.getBodyObj(list, ++index, tmpObj, id)};
                    }
                    //Adds the new param to the object
                    return {[param]: id};
                }

            }
            else{
                // combines objects on the same layer
                object[param] = Object.assign(object[param], this.Output.getBodyObj(list, ++index, object[param], id));

                return object;
            }
        },
        //Creates object for the api
        getObject: () => {

            //---------------handle checked output params-----------
            const headerList = [];
            // const bodyList = [];
            let bodyObj = {};
            this.Output.selectedList.forEach(header => {
               // console.log(header);
                //There prob. need to be done something to handle nested objects.
                const object = {
                    key: header.key, 
                }
                if(header.Area == "Headers"){
                    headerList.push(object);
                }
                else if (header.Area == "Body") {

                    let paramlist = object.key.split(/\.|[[{]/);

                    bodyObj = this.Output.getBodyObj(paramlist,0,bodyObj, header.dom.refrenceId);   
             
                   
                }
                else{
                   // console.log("Invalid output area");
                }
                
            })
            //-------------------------------------------------------

            //------------------get filter values-------------------

            //this.filter.
            let filterObj = {};
            if(this.filter.dom.querySelector(".outputField") && this.filter.dom.querySelector(".outputField")?.value != "") { //}.value!= ""){
                let filter = this.filter.dom.querySelector(".filter").value;
                let filterValue = this.filter.dom.querySelector(".FilterValueInput").value;
                
                if(this.filter.selectedObject){
                    filterObj = {
                        parameter: this.filter.selectedObject.dom.refrenceId,
                        location: this.filter.selectedObject.Area,
                        filter: filter,
                        filterValue,
                    }
                }
                else{
                    filterObj = {
                        parameter: "index",
                        location: "index",
                        filter: filter,
                        filterValue,
                    }
                }
            }
            else{
                filterObj = {
                    parameter: "none"
                }
            }
           // console.log({headers: headerList, body: bodyObj, filter: filterObj})
            return {headers: headerList, body: bodyObj, filter: filterObj};
        }
    }
    
    this.getObject = () => {
        const  object = {
            id: this.id,
            domain: this.selectedDomain,
            endpoint: this.selectedEndpoint,
            method: this.selectedMethod,
            input: {
                headers: this.Headers.getHeaderList(),
                query: this.Query.getList(),
                body: "",
            },
            output: this.Output.getObject(),

            
        }
        return object;
        //console.log(object);
    }

    this.init();
    
}

function Endpoint() {
    //Prototype?
    this.init = () => {

        this.id = createdEndpoints.length;
        //-------------------Create container dom---------------------------
        this.dom = document.createElement("div");
        this.dom.classList = "endpoint box";

        createdEndpoints.push(this);

        const container = document.querySelector(".endpointContainer");
        
        //------------------------------------------------------------------
        //----------------------Create Endpoint Input ---------------------
        const endpointLabel = createLabel("","Endpoint :", "");
        this.dom.append(endpointLabel);

        const endpointIndput = createInput("endpointInput", "Input backend endpoint");
        this.endpointLabelDom = endpointIndput;
        this.dom.append(endpointIndput);

        //------------------------------------------------------------------


        let inputContainer = this.Header.dom;
        inputContainer.classList = "inputHeaders box";
        this.dom.append(inputContainer);
        inputContainer.addEventListener("keyup",updateHeaderOptions, false);

        //--------------------- Add endpoint header -------------------------
        const addHeaderBut = document.createElement("button");
        addHeaderBut.innerText = "Add header";
        inputContainer.append(addHeaderBut);
        addHeaderBut.addEventListener("click", addInputHeaderClick);

        this.Header.addInputHeader();

        //------------------------------------------------------------------

        //----------------Add API Button---------------------

        const buttonDom = document.createElement("button");
        this.dom.append(buttonDom);
        buttonDom.classList = "butAddApi";
        buttonDom.innerText = "Add Api"

        buttonDom.addEventListener("click", addApiForEndpoint);

        //-----------------------------------------------------


        //-----------------Add Container for API's and add API ----------------
        const apiContainer = this.API.container;
        apiContainer.classList = "APIContainer";
        this.dom.append(apiContainer);


        let API = addApi(this);
        apiContainer.append(API.dom);
        //---------------------------------------------------
        
        //--------Add delete functionality to the box----
        const deleteBut = document.createElement("button");
        deleteBut.innerText= "X";
        deleteBut.addEventListener("click", deleteEndpoint);

        this.dom.append(deleteBut);

        //---------------------------------------------

        // const container = document.querySelector(".APIContainer");
        

    }

    this.createdApis = [];

    //Prototype? skal den overhovdet ind i en class?
    

    this.API= {
        container: document.createElement("div"),
        deleteApi: (api) => {
            this.createdApis = this.createdApis.filter(obj => obj != api);
           // console.log(this.createdApis);
            api.delete();
    
            this.createdApis.forEach((api, index) => {
                api.id = index + 1;
            })
    
        },
        addApi: () =>{
           this.API.container.append((new Api(this)).dom);
        },
        outputOptionDoms: []

    };

    this.Header = {
        dom: document.createElement("div"),
        headerList: [],
        headerOptionList: [],
        addInputHeader: () => {
            let parent = this.dom.querySelector(".inputHeaders");
            let container = document.createElement("div");
            
            container.classList = "inputHeader";
            parent.append(container);
            
            container.append(createLabel("","Key: "));
            container.append(createInput("","Header Key"));
            container.append(createLabel(""," - Value type: "));
            container.append(createInput("","insert Value type"));
            // let inputKey = document.createElement("input")
            let deleteBut = document.createElement("button");
            deleteBut.innerText = "X"; 
            // container.append(inputKey)
            deleteBut.addEventListener("click", deleteHeader);
            container.append(deleteBut);
            
        },
    
        deleteHeader: (event) => {
           // console.log(event.target.parentElement);
            event.target.parentElement.innerHTML="";
        },
          
        //Handles both endpoint headers, and selected api outputs.
        updateHeaderOptions: () => {
            
            //----------------Get Headers from endpoint ------------
            let elements = this.dom.querySelectorAll(".inputHeader");
            this.Header.headerList = [];
            elements.forEach(header => {
                headerobj = {}
                headerobj.key = header.children[1].value;
                headerobj.id = 0;
                headerobj.valueType = header.children[3].value;
                this.Header.headerList.push(headerobj);
            })
            //----------------------------------------------------------
           //-----------------Make options based on headers --------
           this.Header.headerOptionList = [];
            this.Header.headerList.forEach(header => {
                if(header.valueType != ""){
                    let option = document.createElement("option");
                    option.value = header.key;
                    option.id = 0;
                    option.innerText = header.key;
                    option.valueType = header.valueType;
                    option.refrenceId = header.key;
                    this.Header.headerOptionList.push(option);
                }
            })
            //----------------------------------------------------------
            //------------------make options from api outputs-----------
            this.API.outputOptionDoms = [];
            this.createdApis.forEach(Api => {
                Api.Output.outputOptionDoms.forEach(dom => {
                    this.API.outputOptionDoms.push(dom);
                })
            })
            //----------------------------------------------------------
        },

        getAsList: () => {
            this.Header.updateHeaderOptions();

           // console.log(this.Header.headerList);
            return this.Header.headerList;
            //// console.log(array[1].tagName=="DIV");
        },
    };

    this.delete = () =>{
        
        createdEndpoints = createdEndpoints.filter(obj => obj != this);
        this.dom.innerHTML="";
        this.dom.outerHTML="";
    };

    this.getObject = () => {
        let apiArr =[];
        this.createdApis.forEach(Api => {
            apiArr.push(Api.getObject());
        }) 
         
        let object = { backend: {
                endpoint: this.endpointLabelDom.value,
                headers: this.Header.getAsList(),
				api : apiArr,
            },
            
        }
		return object

    }

    this.init();
};

//Handle checked output paramaters
function updateOutputList(event) {
    createdEndpoints.forEach(endpoint => {
        endpoint.createdApis.forEach(api => {
            if(api.dom == event.target.closest(".apiBox")){
                api.Output.listUpdate(event.target);
            }
            
        });
        
    });

}

//#region Dynamically update based on select API dropdowns. 

function updateDomain(event){
    
    createdEndpoints.forEach(endpoint => {
        if(endpoint.dom == event.target.closest(".endpoint")){
            endpoint.createdApis.forEach(api => {
                if(api.dom == event.target.closest(".apiBox")){

                    api.updateDomain(event.target.value);
                }
                
            });
        }
        
    });
    
}

function updateEndpoint(event){
    
    createdEndpoints.forEach(endpoint => {
        if(endpoint.dom == event.target.closest(".endpoint")){
            endpoint.createdApis.forEach(api => {
                if(api.dom == event.target.closest(".apiBox")){

                    api.updateEndpoint(event.target.value);
                }
                
            });
        }
        
    });
    
}

function updateMethod(event){
    createdEndpoints.forEach(endpoint => {
        if(endpoint.dom == event.target.closest(".endpoint")){
            endpoint.createdApis.forEach(api => {
                if(api.dom == event.target.closest(".apiBox")){
        
                    api.updateMethod(event.target.value);
                }
                
            });
        }
        
    });
    
}

function filterChange(event){
    createdEndpoints.forEach(endpoint => {
        if(endpoint.dom == event.target.closest(".endpoint")){

            endpoint.createdApis.forEach(api => {
                if(api.dom == event.target.closest(".apiBox")){
        
                    api.filter.onSelect(event.target.value);
                }
                
            });
        }
        
    });
    
}

//#endregion

function addApiForEndpoint(event) {
    createdEndpoints.forEach(endpoint => {
        if(endpoint.dom == event.target.closest(".endpoint")){
            endpoint.API.addApi();
        }
        
    });

}


function deleteApi(event){
    createdEndpoints.forEach(endpoint => {
        if(endpoint.dom == event.target.closest(".endpoint")){

            endpoint.createdApis.forEach(api => {
                if(api.dom == event.target.closest(".apiBox")){

                    endpoint.API.deleteApi(api);
                }
                
            });
        }
        
    });
    
}



function deleteEndpoint(event) {
    createdEndpoints.forEach(endpoint => {
        if(endpoint.dom == event.target.closest(".endpoint")){
            endpoint.delete();
        }
            createdEndpoints.forEach((endpoint, index) => {
            endpoint.id = index + 1;
        })
        
    });
}

function inputClick(event) {
    if(event.target.tagName == "SELECT"){
        createdEndpoints.forEach(endpoint => {
            if(endpoint.dom == event.target.closest(".endpoint")){
                endpoint.createdApis.forEach(api => {
                    if(api.dom == event.target.closest(".apiBox")){
                        //console.log(event.target.closest(".box").parentElement.previousSibling.innerText.slice(0, -1)); //
                        api[event.target.closest(".box").parentElement.previousSibling.innerText.slice(0, -1)].update(event.target);

                    }
                    
                });
            }
            
        });
    }
}


function addEndpointClick() {
    document.querySelector(".endpointContainer").append((new Endpoint).dom);
}

function submitClick() {
    endpointArray = [];
    createdEndpoints.forEach(endpoint => {
        endpointArray.push(endpoint.getObject());
    })
    console.log(endpointArray);
    fetch("/submit",{
		headers: new Headers({'content-type': 'application/json'}),
		method: "POST",
		body: JSON.stringify(endpointArray),
     })
	.then(res => res.blob())
	.then(data => {
		let a = document.createElement("a");
		a.href = window.URL.createObjectURL(data);
		a.download = "server.js";
		a.click();
	});
}

//#region ------HTML creation helpers -------

function createInput (classList, placeholder) {
    const dom = document.createElement("input");
    dom.classList = classList;
    dom.placeholder = placeholder;
    return dom;
}

function createLabel(tag, text, classList = ""){
    const element = document.createElement("label");
    element.classList = classList;
    element.htmlFor  =  tag;
    element.innerText = text;
    return element;
}

function createSelect(classList, placeholder = "", name = "") {
    const element = document.createElement("select");
    element.classList = classList;
    element.placeholder = placeholder; // virker ikke, kan kun  bruge "selected" på en option.
    element.name = name;
    let option = document.createElement("option");
    element.append(option);
    return element;
}

function createOptions(arrayOfObj, selectionName, dom){

    arrayOfObj.forEach(element => {
        let option = document.createElement("option");
        option.value = element[selectionName];
        option.innerText = element[selectionName];
        option.refrenceId = element?.dom?.refrenceId;
        dom.append(option);
    });
}

//#endregion


function addInputHeaderClick(event){
    createdEndpoints.forEach(endpoint => {
        if(endpoint.dom == event.target.closest(".endpoint")){
            endpoint.Header.addInputHeader();

        }
        
    });
}

//#region --- Handle Endpoint headers -------


function deleteHeader(event) {
   // console.log(event.target.parentElement);
        event.target.parentElement.outerHTML="";
}

function updateHeaderOptions(event){
    createdEndpoints.forEach(endpoint => {
        if(endpoint.dom == event.target.closest(".endpoint")){
            endpoint.Header.updateHeaderOptions();
        }
        
    });
   
}
//#endregion

