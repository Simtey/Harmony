function toggleLockSelectedNodes()
{
scene.beginUndoRedoAccum("toggleLockSelectedNodes");
var selectednodes = selection.selectedNodes()
var isFirstNodeLocked = node.getLocked(selection.selectedNode(0));

if (isFirstNodeLocked === false ){
    for (var i in selectednodes){
    node.setLocked(selectednodes[i],true);
    }
}else if (isFirstNodeLocked === true){
    for (var i in selectednodes){
    node.setLocked(selectednodes[i],false);
    }
}
scene.endUndoRedoAccum();
}
