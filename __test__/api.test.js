import {storedApis} from "../src/data/apis.js";
import data from "../src/data/apis.js";
import {callApi} from "../src/data/callApi.js";

const TEST_API_NAME = "TEST";
const TEST_ENDPOINT_NAME = "TEST";
const TEST_PATH = "https://pokeapi.com/api/v2/pokemon/{pokemon}"

let api;
let endpoint;

test('Create API', ()=>{
	data.createApi(TEST_API_NAME);
	expect(typeof storedApis[TEST_API_NAME]).toBe("object");
})

test('Create Endpoint', ()=>{
	data.createEndpoint(storedApis[TEST_API_NAME], TEST_ENDPOINT_NAME);
	expect(typeof storedApis[TEST_API_NAME].endpoints[TEST_ENDPOINT_NAME]).toBe("object");
})

test('Modify Api', ()=>{
	api = data.modifyApi(TEST_API_NAME);
	expect(typeof api).toBe("object");
})

test('Modify Endpoint', ()=>{
	endpoint = data.modifyEndpoint(api, TEST_ENDPOINT_NAME);
	expect(typeof endpoint).toBe("object");
})

test('Set Path', ()=>{
	endpoint.setPath = TEST_PATH;;
	endpoint.method = "GET";
	expect(endpoint.path).toBe(TEST_PATH);
	expect(endpoint.query.path[0]).toBe("pokemon");
})

test('Create Header', () => {
	data.setHeader(endpoint.headers, "content-type", "application/json");
	expect(endpoint.headers[0].key).toBe('content-type');
	expect(endpoint.headers[0].value).toBe('application/json');
})

test('Delete Header', () => {
	data.deleteHeader(endpoint.headers, "content-type");
	expect(endpoint.headers[0]).toBe(undefined);
})

test('Call', () => {
	callApi(`${TEST_API_NAME}/${TEST_ENDPOINT_NAME}`, ["pokemon=charmander"], "{name=>name}")
	.then(({data}) => {
		expect(data.call.name).toBe("charmander");
	});
})

test('Delete Endpoint', () => {
	data.deleteEndpoint(api, TEST_ENDPOINT_NAME);
	expect(api.endpoints[TEST_ENDPOINT_NAME]).toBe(undefined);
})

test('Delete Api', () => {
	data.deleteApi(TEST_API_NAME);
	expect(storedApis[TEST_API_NAME]).toBe(undefined);
})



