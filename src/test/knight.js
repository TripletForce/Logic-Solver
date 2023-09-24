const Contract = require("../solver/contract.js");
let prompt;

//Knights always tell the truth
//Knaves always lie
//Spies tell either truth or lies
//From https://puzzlewocky.com/brain-teasers/knights-and-knaves/

function puzzle(){
    let prompt = arguments[0];
    for(let i=1; i<arguments.length; i++){
        let c = new Contract(prompt+"|-"+arguments[i]).simplify().isSatisfied;
        let ic = new Contract(prompt+"|-!"+arguments[i]).simplify().isSatisfied;

        if(c && ic) console.log("Logic Error with "+arguments[i]);
        else if(c && !ic) console.log(arguments[i]);
        else if(!c && ic) console.log("!"+arguments[i]);
        else if(!c && !ic) console.log("No conclusion with "+arguments[i]);
    }
}


/*
Two people, Red and Blue, stand before you. Red says, “We are both knaves.” What are they really?
Answer:

Red cannot be a knight, because then he would be lying by saying he is a knave. Therefore he is a knave, and his statement is a lie, meaning that Blue must be a knight.

!r and b
*/
console.log("\nPuzzle 1:")
prompt = `
r -> (!r ^ !b),
!r -> !(!r ^ !b)
`
puzzle(prompt, 'r', 'b');


/*
You have met a group of 2 islanders. Their names are Oberon and Ira.
Oberon says: Ira is a knight or I am a knave.

Answer: 
When Oberon said 'Ira is a knight or I am a knave,' we know Oberon must be making a true statement. 
(If it was false, this would make the speaker a knave, which would make the statment true, but knaves cannot make true statements.) 
So, Oberon is a knight and Ira is a knight.

o and i
*/
console.log("\nPuzzle 2:")
prompt = `
o -> i V !o,
!o -> !(i V !o)
`
puzzle(prompt, 'o', 'i');


/*
You have met a group of 2 islanders. Their names are Kevin and Carol.
Carol says: Kevin lies.
Kevin says: Carol is my type.

Answer:
A knight or a knave will say they are the same type as a knight. So when Kevin says they are the same type as Carol, we know that Carol is a knight.
All islanders will call a member of the opposite type a knave. So when Carol says that Kevin is a knave, we know that Kevin and Carol are opposite types. Since Carol is a knight, then Kevin is a knave.

c and !k
*/
console.log("\nPuzzle 3:")
prompt = `
c -> !k,
!c -> !!k,
k -> c,
!k -> c
`
puzzle(prompt, 'c', 'k');


/*
Alphred says: I'm a knight and knave 

Answer:
Alphred is a knave. He can not be both, so the statement is a lie.

!a
*/
console.log("\nPuzzle 4:")
prompt = `
a -> a ^ !a,
!a -> !(a ^ !a)
`
puzzle(prompt, 'a');



