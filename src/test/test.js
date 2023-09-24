const Contract = require("../solver/contract.js");

//Evaluate to true
const LogicProblems = [
    //Basic
    "f |- f",
    "foo |- foo",
    "foo, bar |- bar",
    //Normal Logical Problems
    "!p ^ !q |- !(p ^ q)",
    "|- p v (p -> q)",
    "p v !p, p -> q |- !p V q",
    "p V (q ^ r) |- (p V q) ^ (p V r)",
    "p ^ (q V (p -> q)) |- q",
    "p ^ q -> r |- p -> (q -> r)",
    "(p ^ q) -> r, r -> s, q ^ !s |- !p", 
    "!(p V q) |- !p ^ !q",
    "!(!t v f) |- t",
    "!!p |- p",
    "!!!!p |- p",
    "p |- !!p",
    "p |- !!p",
    "p -> !q, !s -> p, t V !s, !t |- !(!p V q)",
    "(c ^ n) -> t, h ^ !s, h ^ !(s V c) -> p |- (n ^ !t) -> p",
    "p -> (q V r), !q, !r, p |- w",
    "(p -> q) -> r, s -> !p, t, (!s ^ t) -> q |- r",
    "|- (p -> q) -> ((!p -> q) -> q)",
    "|- ((b -> b) ^ (b -> b)) -> ((b V b) -> (b ^ b))",
    "(c ^ a) V (b ^ c) |- (b V a) ^ c",
    "a V b V c |- c V b V a",
    //Using numbers as variables works too
    "1 V (3 ^ 2) |- (1 V 3) ^ (1 V 2)",
    "!(1 V 2) |- !1 ^ !2",
    //Symbols too
    "!($ V %) |- !$ ^ !%",
    "f(x) |- f(x)",   //"f(x)" is one variable (parenthisis are not on the outside)
    //And names over 1 char
    "!(!bar V foo) |- bar ^ !foo",
    "!(!fo V foo) |- fo ^ !foo",
    //proof by contradiction
    "p -> q |- !p V q",
    "|- (p -> q) -> ((!p -> q) -> q)",
    "p -> !p |- !p",
    //Demorgan's Laws
    "!(a ^ b) |- !a v !b",
    "!a v !b |- !(a ^ b) ",
    "!(a v b) |- !a ^ !b",
    "!a ^ !b |- !(a v b)",
    "|- ( !(a v b) -> (!a ^ !b) )  ^  ( (!a ^ !b) -> !(a v b) )",
    //pbc
    "!o -> !(i V !o) |- o",
    "w -> p, !w -> p |- p",
];

//Assert Logic Problems True
console.log("__________Truthful_Tests__________")
for(let i=0; i<LogicProblems.length; i++){
    let c = new Contract(LogicProblems[i]);
    c.simplify();  
    console.log("Test "+i+": "+(c.isSatisfied ? "Succeed" : "Fail"));
    if(!c.isSatisfied) console.log(LogicProblems[i]);
}



//Evaluate to false
const FaultyLogicProblems = [
    "q |- p",
    "p -> r |- r",
    "q V p |- q",
    "!p |- p",
    "p |- !p",
    "(q ^ r) |- s", 
    "!p V q |- p ^ !q",
    "fo |- foo",
    "|- p v !q",
    "|- p v p",
    "p -> !p |- p",
    "p v q |- p ^ q",
    "p -> q |- p ^ q",
    "!(p ^ q) |- !p ^ !q",
];

//Assert Logic Problems False
console.log("__________False_Tests__________")
for(let i=0; i<FaultyLogicProblems.length; i++){
    let c = new Contract(FaultyLogicProblems[i]);
    c.simplify();  
    console.log("Test "+i+": "+(c.isSatisfied ? "Fail" : "Succeed"));
}



//Throws error
const FaultySyntax = [
    //No |- operator
    "p -> q",
    "p -> p",
    //Codex fault
    "p |- -> ^ q",
    "p |- -> ^",
    "p |- -> v",
    "s |-",
];

//Assert Error
console.log("__________Error_Tests__________")
for(let i=0; i<FaultySyntax.length; i++){
    try{
        let c = new Contract(FaultySyntax[i]);
        console.log("Test "+i+": Failed");
        console.log(c.premises);
        console.log(c.conclusions);
    }
    catch (err){
        console.log("Test "+i+": Succeed. "+err);
    }
}