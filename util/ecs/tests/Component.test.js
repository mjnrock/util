import { Component } from "./../Component";

const comp = Component.Create({ $name: "test", test: "test" });

let test1 = comp.test;
console.log(comp.test);

comp.test = "test2"; 

let test2 = comp.test;
console.log(comp.test);

comp.$reset();

let test3 = comp.test;
console.log(comp.test);

console.log(test1 === test2);
console.log(test2 === test3);
console.log(test1 === test3);