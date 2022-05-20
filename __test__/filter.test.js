import {filterResponse} from '../src/data/filter.js';

let testObj = {
	val : "Hello",
	obj : {
		field1 : 1,
	},
	arr : [
		"hi",
		"hello"
	],
	obj2 : {
		field1 : [
			{
				field2 : "hi"
			}
		]
	}
}

test('Simple Filter Value', () => {
	expect(filterResponse(Object.assign({}, testObj), undefined, "{val=>hello}").hello).toBe("Hello");
})

test('Simple Filter Object', () => {
	expect(filterResponse(Object.assign({}, testObj), undefined, "{obj:{field1=>hello}}").hello).toBe(1);
})

test('Simple Filter Array', () => {
	expect(filterResponse(Object.assign({}, testObj), undefined, "{arr:[at 0 =>hello]}").hello).toBe("hi");
})

test('Simple Filter Array return to array', () => {
	expect(filterResponse(Object.assign({}, testObj), undefined, "{arr:[[=]hello]}").hello[1]).toBe(testObj.arr[1]);
})
test('Simple Filter Nested', () => {
	expect(filterResponse(Object.assign({}, testObj), undefined, "{obj2:{field1:[at 0 :{field2=>hello}]}}").hello).toBe("hi");
})
