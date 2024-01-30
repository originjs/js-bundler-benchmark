// ES6 解构语法
export function destructuringSyntax() {
    // 简单数组解构
    const [a, b] = [1, 2]; // a = 1, b = 2
    // 忽略某些值
    const [c, , d] = [3, 4, 5]; // c = 3, d = 5
    // 剩余参数
    const [e, ...f] = [6, 7, 8, 9]; // e = 6, f = [7, 8, 9]
    // 简单对象解构
    const {name, age} = {name: 'Alice', age: 30}; // name = 'Alice', age = 30
    // 重命名属性
    const {name: personName, age: personAge} = {name: 'Bob', age: 25}
    console.log(a, b, c, d, e, f, name, age, personName, personAge);
}


// ES6 Promise
export async function promise(num) {
    if (num === 1) {
        return Promise.resolve(true);
    } else {
        return Promise.reject(false);
    }
}


// ES6 map
export function map() {
    const myMap = new Map();
    myMap.set('key1', 'value1');
    myMap.set('key2', 'value2');
    myMap.get('key1'); // 返回 'value1'
    myMap.has('key1'); // 返回 true
    myMap.delete('key2');
    myMap.forEach((value, key) => {
        console.log(key, value);
    });
}


// ES6 set
export function set() {
    const mySet = new Set();
    mySet.add('value1');
    mySet.add('value2');
    mySet.has('value1'); // 返回 true
    mySet.delete('value2');
    mySet.forEach(value => {
        console.log(value);
    });
}


// ES6 for of
export function forOf() {
    const myString = "Hello";
    for (const char of myString) {
        console.log(char);
    }
}

// ES6 startWith endWith
// ES7 padStart padEnd
export function newStringMethod() {
    let str = "12123";
    let startWith = str.startsWith("1");
    let endWith = str.endsWith("1");
    str = str.padStart(10, 's')
    str = str.padEnd(20, 'e');
    return startWith + endWith + str;
}

export function all(){
    destructuringSyntax();
    promise(1).then(x=>console.log(x));
    map();
    set();
    forOf();
    newStringMethod();
}