const Contract = require("../solver/contract.js");

let c = new Contract("|- ( !(a v b) -> (!a ^ !b) )  ^  ( (!a ^ !b) -> !(a v b) )");
console.log(c.toString(), "\n\n\n")
c.simplify();  
console.log(c.toString())