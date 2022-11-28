function toggleLockSelectedNodes() {

    scene.beginUndoRedoAccum("toggleLockSelectedNodes");

    var selectednodes = selection.selectedNodes();
    var lockedCount = 0;
    var unlockedCount = 0;

    for (var i in selectednodes) {
        if (node.getLocked(selectednodes[i]) === true) {
            lockedCount++;
        } else {
            unlockedCount++;
        }
    }

    if (unlockedCount >= lockedCount) {
        for (var i in selectednodes) {
            node.setLocked(selectednodes[i], true);
        }
    } else {
        for (var i in selectednodes) {
            node.setLocked(selectednodes[i], false);
        }
    }

    scene.endUndoRedoAccum();
}