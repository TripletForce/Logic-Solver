/*
Takes a statement in the conclusion and divides it up
to a more solvable contract.
*/
function conclusion(tree, contract){
    let c;
    
    if(!Array.isArray(tree)) {
        //Check for _|_
        return contract.has(tree);
    }

    switch(tree[1]){
        case "v":  //OR
            //Search quick
            if(contract.has(tree[0])) return true;
            if(contract.has(tree[2])) return true;
            //Contract subproof:
            //If not side a proves side b, the or is satisfied.
            c = contract.fork().registerPremise(["","!",tree[0]]);
            c.conclusions = [tree[2]];
            c.simplify();
            if(c.isSatisfied) contract.resolve("v conclusion");
            return false;

        case "^":  //AND
            //Quick proof
            //Prove both sides.
            contract.registerConclusion(tree[0], tree[2]); 
            return true;

        case "!":  //NOT
            //Contract subproof:
            //If can prove the complementary forms a contradiction, then conclusion is satisfied.
            c = contract.fork().registerPremise(tree[2]);
            c.conclusions = ["_|_"];  //Will resolve itself if contradiction.
            c.simplify();
            if(c.isSatisfied) return true;
            return false;

        case "->": //IMPLIES
            //Contract subproof:
            //Given left side, prove the right.
            contract.removeConclusion(tree);
            contract.conclusions.push(
                contract.fork()
                .registerPremise(tree[0])
                .registerConclusion(tree[2])
                .simplify()
            )
            return true;
    }
}

/*
Takes a statement in the premise and divides it up
to a more solvable contract.
*/
function premise(tree, contract){
    let c;

    if(!Array.isArray(tree)) {
        //Check for _|_
        if(contract.has(["","!",tree])) contract.resolve("Contradiction in premise variables.");
        return false;
    }

    switch(tree[1]){
        case "v":  //OR
            //Contract subproof:
            //If both sides can be used to prove conclusions, the contract can be resolved.
            contract.removePremise(tree);
            contract.conclusions = [
                contract.fork(tree[0]).simplify(),
                contract.fork(tree[2]).simplify()
            ]
            return true;

        case "^":  //AND
            contract.registerPremise(tree[0], tree[2]);
            return true;

        case "!":  //NOT
            //Search quick
            if(Array.isArray(tree[2]) && tree[2][1] === "!"){
                contract.registerPremise(tree[2][2]);
                return true;
            }
            //Demorgan's law: !(a v b) is !a ^ !b
            if(tree[2][1] === "v"){
                contract.registerPremise(["","!",tree[2][0]], ["","!",tree[2][2]]);
                return true;
            }
            //Contract subproof:
            //If the complementary tree can be found, resolve bc _|_
            c = contract.fork().removePremise(tree);
            c.conclusions = [ tree[2] ];
            c.simplify();
            if(c.simplify().isSatisfied) contract.resolve("! premise");
            //Demogan's law !(a ^ b) is !a v !b
            if(tree[2][1] === "^"){
                contract.registerPremise([["","!",tree[2][0]], "v", ["","!",tree[2][2]]]);
                return true;
            }
            return false;

        case "->": //IMPLIES
            //Search quick
            if(contract.has(tree[0])) {
                contract.registerPremise(tree[2]);
                return true;
            }
            //Contract subproof:
            //If left side can be proven, just add the right.
            c = contract.fork().removePremise(tree);
            c.conclusions = [tree[0]];
            c.simplify();
            if(c.isSatisfied){
                contract.registerPremise(tree[2]);
                return true;
            }
            //Contract subproof:
            //If left side introduces _|_, it is not the left side
            c = contract.fork().registerPremise(tree[0]);
            c.conclusion = ["_|_"];
            c.simplify();
            if(c.isSatisfied){
                contract.registerPremise(["","!",tree[0]]);
                return true;
            }
            return false;
    }
}

module.exports = {
    conclusion,
    premise
}