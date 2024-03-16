// Simon Thery - 2023 - ST_pegJump - Licence : Mozilla Public License Version 2.0

function ST_pegJump() {
    var selNode = selection.selectedNode(0);
    var bkpPeg = selNode; // at first bkpPeg is selNode but its value will change after the loops.
    var i = 0;
    if (node.type(selNode) === "READ"){ // if the selection is a drawing we jump over its peg (usefull when the drawings are set off on "Animate using animation tools")
    goToPeg(2); // the int inside the "()" actually gives a value to the variable "numberOfLoops" as registered in the function declaration
}else{
    goToPeg(1); //if the selection is something else we just go on the peg above the selection 
}
    var endSelNode = selection.selectedNode(0);
    if (bkpPeg !== "" && endSelNode === "") { // After the loop we check if something is selected 
        selection.clearSelection();
        selection.addNodeToSelection(bkpPeg); // if nothing is selected we select the last peg found by the loop.
    }

function goToPeg(numberOfLoops){
    while (i < numberOfLoops && selNode !== "") { //  Stop when we jump on the X peg above (according to the value to numberOfLoops) or when there is no (or no more) peg above 
        var nodeAbove = node.flatSrcNode(selNode, 0);
        selection.clearSelection();
        selection.addNodeToSelection(nodeAbove); // we jump to the node above
        selNode = nodeAbove; // it becomes the new selection reference for the next loop
        if (node.type(selNode) === "PEG") { // count to end the loop only if the node selected is a peg
            bkpPeg = selNode; // keep as a backup the last peg selected
            i++;
            }
        }
    }
}
