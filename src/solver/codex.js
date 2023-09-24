module.exports = {
    format,
    stringify,
    variables,
    copy,
    isEqual
};

/*
Operands in order of priority. Assumes left to right priority.
*/
const OPERANDS = [
    "|-",
    ",",
    ":",
    "->",
    "v",
    "^",
    "!",
]

/*
Splits the statement into the character when the character
is not nested.
*/
function splitAtChar(statement, char){
    let nest = 0;
    for(let i=0; i<statement.length; i++){
        let c = statement[i];
        if(c == "(") nest++;
        if(c == ")") nest--;
        if(!nest) if(statement.startsWith(char, i)){
            return [statement.slice(0, i), char, statement.slice(i+char.length)];
        }
    }
    return false;
}

/*
Verifies that a tree has a proper structure. Throws errors if 
something is at fault.
*/
function verify(tree){
    //Right number of args for tree
    switch(tree[1]){
        //Requires right side
        case "|-":
            if(tree[2] == "")
                throw new Error("The |- must have conclusions.")
            break;
        //Requires only right side
        case "!":
            if(tree[0] != "" || tree[2] == "")
                throw new Error("The ! operand must only be followed by a statment.");
            break;
        //Requires both sides
        case ",":
        case "->":
        case "v":
        case "^":
            if(tree[0] == "" || tree[2] == "")
                throw new Error("The operand "+tree[1]+" must have statements on both sides.");
            break;
        default:
            break;
    }
    return tree;
}

/*
Splits the statement into a ternary tree, where either side is the 
element separated by the logical operand in the center.
*/
function treeify(statement){
    //Seperate top level operand
    for(let operand of OPERANDS){
        let structure = splitAtChar(statement, operand);
        if(structure)
            return verify([treeify(structure[0]), structure[1], treeify(structure[2])]);
    }

    //Get rid of parenthisis
    if( statement.startsWith("(") && statement.endsWith(")") )
        return treeify(statement.slice(1, -1));

    //Return the statement. No futher treeification.
    return statement;
}

/*
Turns a string expression into a ternary tree of 
the logical statement.
*/
function format(statement){
    statement = statement
        .toLowerCase()
        .replaceAll(" ", "")
        .replace(/\n|\r/g, "");
    return treeify(statement);
}

/*
Turns the ternary string back into a string.
Used mainly for debugging.
*/
function stringify(tree, trim=true){
    if(Array.isArray(tree)){
        let result = stringify(tree[0], false) +" "+ tree[1] +" "+ stringify(tree[2], false);
        return trim ? result : "("+result+")";
    }
    return tree;
}

/*
Returns all of the variables in a tree.
*/
function variables(tree){
    if(tree == '') return [];
    if(!Array.isArray(tree)) return [tree];

    let vars = new Set(
        variables(tree[0]).concat(variables(tree[2])) 
    )

    return Array.from(vars)
}

/*
Deep copies a tree.
*/
function copy(tree){
    if(Array.isArray(tree)) return [copy(tree[0]), tree[1], copy(tree[2])];
    return tree;
}

/*
Go through both trees and compare.
*/
function isEqual(tree1, tree2){
    if(Array.isArray(tree1) != Array.isArray(tree2)) return false;

    if(Array.isArray(tree1)) 
        return tree1[1] == tree2[1] && 
               isEqual(tree1[0], tree2[0]) && 
               isEqual(tree1[2], tree2[2]);

    else return tree1 == tree2;
}