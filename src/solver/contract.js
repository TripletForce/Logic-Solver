const Codex = require('./codex');
const Simplify = require('./simplify.js');


/*
The Contract class takes a boolean algebra logic statement
and solves for semantic entailment. 

Note: This class was designed around chained functions.
*/
class Contract {
    /*
    Every tree in premises has been proven.
    */
    premises = [];
    /*
    Every tree and contract in the conclusions must be removed to satisfy the contract.
    */
    conclusions = [];

    debug = false;

    /*
    Takes a statement in the form:
        premises |- conclusions
    Builds the contract by a tree, either in string format or with the binary tree
    */
    constructor(sentence){
        if(sentence == undefined) return;

        let tree = Array.isArray(sentence) ? sentence : Codex.format(sentence);

        if(tree[1] == "|-"){
            this.registerPremise(tree[0]);
            this.registerConclusion(tree[2]);
        }
        else{
            throw new Error("A contract must require a |- operator.");
        }
    }

    /*
    Adds arguments to list of premises
    */
    registerPremise(){
        Array.from(arguments).forEach(tree=>{
            if(tree[1] == ",") 
                this.registerPremise(tree[0], tree[2]);
            else this.premises.push(tree);
        })
        return this;
    }

    /*
    Removes premise from list
    */
    removePremise(premise){
        this.premises = this.premises.filter(tree => !Codex.isEqual(tree, premise));
        return this;
    }

    /*
    Adds arguments to list of conclusions
    */
    registerConclusion(){
        Array.from(arguments).forEach(tree=>{
            if(tree[1] == ",") this.registerConclusions(tree[0], tree[2]);
            else this.conclusions.push(tree);
        })
        return this;
    }

    /*
    Removes conclusion from list
    */
    removeConclusion(conclusion){
        let index = this.conclusions.indexOf(conclusion)
        if(index>=0) this.conclusions.splice(index, 1);
        return this;
    }

    /*
    Uses the premises to prove the conclusions. The list of premises
    and conclusions will morph until the conclusions are proven and
    removed.

    Algorithm: Move through each premise and conclusion simplify each.
    Once none of the function can be simplified, the process ends.
    The conclusions that are left cannot be proven by the premises.
    */
    simplify(){
        let mutated = true;
        while(mutated){
            //Conclusions
            let index = 0;
            while(index < this.conclusions.length){
                if(this.conclusions[index] instanceof Contract && this.conclusions[index].isSatisfied){
                    this.conclusions.splice(index, 1);
                    mutated = true;
                }
                else if(Simplify.conclusion(this.conclusions[index], this)){
                    this.conclusions.splice(index, 1);
                    mutated = true;
                }
                else{
                    index++;
                }
            }

            //If nothing changes beyond this point, nothing more can be done. 
            mutated = false;

            //Premises
            index = 0;
            while(index < this.premises.length){
                if(Simplify.premise(this.premises[index], this)){
                    this.premises.splice(index, 1);
                    mutated = true;
                }
                else{
                    index++;
                }
            }
            
        }

        return this;
    }

    /*
    Searches for a specific premise, and returns wether it is found.
    */
    has(tree){
        //Skim to see if it has the tree
        for(let premise of this.premises)
            if(Codex.isEqual(premise, tree)) return true;
        return false;
    }

    /*
    The premises and conclusions are copied to another instance of
    a contract, and returned.
    */
    fork(){
        let clone = new Contract();
        this.premises.forEach(tree => 
            clone.registerPremise(Codex.copy(tree))
        )
        this.conclusions.forEach(tree => 
            clone.registerConclusion(Codex.copy(tree))
        )
        Array.from(arguments).forEach(tree=>{
            clone.registerPremise(tree);
        })
        return clone;
    }

    /*
    Prints the premises and conclusions in a readable way.
    */
    toString(tab=0){
        return ""+
        
            "\t".repeat(tab) +
            "Contract: \n"+
                
                "\t".repeat(tab+1) +
                "Premises:" + 
                    this.premises.map(v => "\n" + (v instanceof Contract ? 
                        v.toString(tab+2) 
                        : 
                        "\t".repeat(tab+2)+Codex.stringify(v)
                    )) + 
                
                "\n"+"\t".repeat(tab+1) +
                "Conclusions:" + 
                this.conclusions.map(v => "\n" + (v instanceof Contract ? 
                    v.toString(tab+2) 
                    : 
                    "\t".repeat(tab+2)+Codex.stringify(v)
                ));
    }

    /*
    Returns wether the conclusions in the contract have been proven.
    Note: simplify must be called first.
    */
    get isSatisfied(){
        return this.conclusions.length == 0;
    }

    /*
    The function signals if the all conclusions can be proven,
    for a specified reason.
    */
    resolve(reason){
        this.conclusions = [];
        return this;
    }
}

module.exports = Contract;