function toggleLockSelectedNodes() // fonction parce qu'Harmony fonctionne comme ça
{
scene.beginUndoRedoAccum("toggleLockSelectedNodes"); // le undo (ctrl+z) termine là
var selectednodes = selection.selectedNodes() // crée une array (un tableau) de tous les nodes selectionnés
var isFirstNodeLocked = node.getLocked(selection.selectedNode(0)); // on prend le 1er node selectionné et on vérifie s'il est locké ou non

if (isFirstNodeLocked === false ){ // si ce premier node n'est pas locké
    for (var i in selectednodes){ // on selectionne chaque node du tableau 1 par 1
    node.setLocked(selectednodes[i],true); // et on le locke 
    } // la boucle se termine quand tous les nodes du tableau var selectednodes a été traité
}else if (isFirstNodeLocked === true){ // sinon si le premier node est locké on les délocke tous un par un
    for (var i in selectednodes){
    node.setLocked(selectednodes[i],false);
    }
}
scene.endUndoRedoAccum(); // le ctrl+z commence ici
}