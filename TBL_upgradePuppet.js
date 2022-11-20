/* v1.1 by Simon Thery (designed for the series "Tobie Lolness")
Select an element of a puppet, the script will replace the entire puppet with its new version if there is an accurate TPL in the puppets folder"

version 1.1 : Warning added if the dir.path is inaccurate + Put the old puppet inside a group to save it for later + function restoreAnimationKeys (save and paste timeline) is now separated.
*/
MessageLog.clearLog();
include("openHarmony.js");

function TOB_upgradePuppet() {
    scene.beginUndoRedoAccum("TOB_upgradePuppet");
    var dir = new Dir;
    //--- EDITABLE = Puppets folder path ----------------------
    dir.path = "C:/Users/SimTey/Desktop/TBL_Script/TBL_Script/"; // "//dionysos/Sync/04_BANK_TPL/"; just copy the link from MS windows and change the "\" by "/") "C:/Users/SimTey/Desktop/TBL_Script/TBL_Script/"
    //---------------------------------------------------------
    var doc = $.scn;
    var selectNode = selection.selectedNode(0);
    var characNodePath = node.parentNode(selectNode);
    var characNodePathTMP = doc.$node(characNodePath);
    var topBackdrops = Backdrop.backdrops(node.root()); // backup of the "Top/" backdrops
    var characName;
    var tplPath;
    var oldBackdrop;
    var nodesPositionToRestore = [];
    var oldBackdropNodes;
    var oldBackdropTitle;
    var oldBackDropVersionNumber;
    var masterPeg;
    var masterPegPos;
    var masterPegSavePos;
    var tplVersionNumber;
    var newCharaCompNode;
    var allCharaCompNodeInfo;
    var newBackdropDescription;
    var firstFrame = scene.getStartFrame();
    var numberOfFrames = scene.getStopFrame();
    var tlCopy;
    var oldNodesGroup;
    var newcharacNodePathTMP;

    if (dir.exists === false) {
        MessageBox.information("Chemin vers le dossier contenant les puppets introuvable !\n Renseignez le bon chemin dans le script (balise 'EDITABLE').");
        return;
    }
    if (!selectNode) {
        MessageBox.information("Sélectionner un élément de la puppet qui doit être remplacée");
        return;
    }
    if (selection.selectedNode(1) !== "") {
        MessageBox.information("Un seul élément doit être selectionné");
        return;
    }

    if (!checkFile()) {
        MessageBox.information("Il n'y a pas de template disponible pour" + characName);
        return;
    }
    if (!checkVersion()) {
        return;
    }
    oldPuppet();
    newPuppet();
    restoreNodesPositions();
    restoreBackdrops();
    restoreAnimationKeys();
    MessageLog.trace(characName + " v0" + oldBackDropVersionNumber + " a été remplacé.e par " + characName + " v0" + tplVersionNumber); // At the end confirmation in the MessageLog

    function checkFile() {
        characName = node.getName(characNodePath);
        var allTpl = dir.entryList("*.tpl"); // retrieve every tpl
        var myCharacTpl = [];
        for (var i in allTpl) {
            var tplCharaName = (allTpl[i].slice(0, -8));
            if (tplCharaName.toUpperCase() === characName.toUpperCase()) {
                myCharacTpl.push(allTpl[i]); // retrieves only the tpl with the name corresponding to the selected character
            }
        }
        if (myCharacTpl.length >= 1) { // If one or many tpl of the same character in different versions
            tplVersionNumber = 0;
            for (var j in myCharacTpl) {
                if (parseInt(myCharacTpl[j].slice(-6, -4)) > tplVersionNumber) { // compare the versions
                    tplVersionNumber = (parseInt(myCharacTpl[j].slice(-6, -4)));
                    tplPath = dir.path + "/" + myCharacTpl[j] //get only the path of the higher version
                }
            }
            return true;
        } else if (myCharacTpl.length = 0) { // if no tpl of the character
            return false;
        }
    }

    function checkVersion() {
        var oldBackdrops = characNodePathTMP.containingBackdrops; //oH A DEPLIER
        oldBackdrop = oldBackdrops[0];
        oldBackdropTitle = oldBackdrop.title;
        oldBackDropVersionNumber = parseInt(oldBackdropTitle.slice(-2)); // get the old character's version from its backdrop
        if (tplVersionNumber <= oldBackDropVersionNumber) { // if new version <= the older one we ask if we still want to replace it
            var d = new Dialog();
            d.title = "Conflit de versions";
            d.okButtonText = "Continuer";
            d.cancelButtonText = "Annuler";
            var bodyText = new Label();
            bodyText.text = "Êtes-vous sûr.e de vouloir remplacer la v" + oldBackDropVersionNumber + " par la v" + tplVersionNumber;
            d.add(bodyText);
            if (!d.exec()) {
                return false;
            }
        }
        return true;
    }

    function oldPuppet() {
        var getPeg = node.srcNode(characNodePath, 0); // old puppet's master peg
        masterPeg = doc.getNodeByPath(getPeg);
        masterPegPos = masterPeg.nodePosition; // save its position in the nodeview
        masterPegSavePos = masterPeg.y;
        newCharaCompNode = "Top/Comp_" + characName; // POSSIBLE EVITER LA STRING ?
        var numOutputPorts = node.numberOfOutputPorts(newCharaCompNode); // loop to retrieve the destination composite + port to reconnect it later.
        for (var i = 0; i < numOutputPorts; i++) { // ATTENTION SI UN AUTRE COMPOSITE CONNECTE (ex suite ajout d'un display pour plusieurs persos ajouter une condition ?)
            var portIdx = i;
            var numLinks = node.numberOfOutputLinks(newCharaCompNode, portIdx);
            for (var j = 0; j < numLinks; j++) {
                var linkIdx = j;
                allCharaCompNodeInfo = node.dstNodeInfo(newCharaCompNode, portIdx, linkIdx)
                if (node.type(allCharaCompNodeInfo) === "COMPOSITE") {
                    break;
                }
            }
        }
        node.unlink(characNodePath, 0); // unlink the master peg
        masterPeg.y = masterPegPos.y - 1000; // moves the Master peg outside the backdrop not to delete it.
        oldBackdropPos = oldBackdrop.position;
        oldBackdropNodes = oldBackdrop.nodes;

        for (var n in oldBackdropNodes) {
            nodesPosition = oldBackdropNodes[n].nodePosition;
            nodesPositionToRestore.push(nodesPosition); // save the old puppet's nodes positions
        }

        var nodesToGroup = oldBackdropNodes.join();
        oldNodesGroup = node.createGroup(nodesToGroup, characName + "_v0" + oldBackDropVersionNumber + "_BKP"); //  save the old puppet's nodes inside a group    
        var oldNodesGroupSub = node.subNodes(oldNodesGroup);

        for (var o in oldNodesGroupSub) {
            if (node.type(oldNodesGroupSub[o]) === "DISPLAY") {
                node.deleteNode(oldNodesGroupSub[o], true, true); // bug fix delete the old display not to have a +1.
            }
        }
        node.setCoord(oldNodesGroup, masterPegPos.x, masterPegPos.y - 150); // move the group outside the backdrop
        node.unlink(allCharaCompNodeInfo.node, allCharaCompNodeInfo.port); // unlink this group from the charac composite
    }

    function newPuppet() {
        copyPaste.pasteTemplateIntoGroup(tplPath, "Top/", 1) // import the tpl
        var tplNodes = selection.selectedNodes();
        for (var i = 0; i < tplNodes.length; i++) {
            if (node.type(tplNodes[i]) === "COMPOSITE") { // in the array we get the composite we want to delete
                node.deleteNode(tplNodes[i]);
            } else if (node.type(tplNodes[i]) === "GROUP") { // and we get the group path
                var newCharaGroupNode = tplNodes[i];
            }
        }
        var subNodes = node.subNodes(newCharaGroupNode);
        for (var i = 0; i < subNodes.length; i++) {
            if (node.type(subNodes[i]) === "PEG") {
                node.deleteNode(subNodes[i]); // delete the useless master peg inside the new puppet's group //ATTENTION SI PLUSIEURS PEGS
            }
        }
        node.explodeGroup(newCharaGroupNode); //ungroup
        masterPeg.y = masterPegSavePos; // put the master Peg in place.
        node.link(masterPeg, 0, characNodePath, 0); // and relink it
        node.link(newCharaCompNode, 0, allCharaCompNodeInfo.node, allCharaCompNodeInfo.port); // link the new puppet to it's original composite / port.
    }

    function restoreNodesPositions() {
        newcharacNodePathTMP = doc.getNodeByPath("Top/" + characName); //oH A DEPLIER
        var newBackdrops = newcharacNodePathTMP.containingBackdrops;
        var newBackdrop = newBackdrops[0];
        newBackdropDescription = newBackdrop.description;
        var newBackdropNodes = newBackdrop.nodes;
        for (var n in newBackdropNodes) { // for each new node
            for (var o in oldBackdropNodes) { // for each old node
                if (newBackdropNodes[n].name === oldBackdropNodes[o].name) { // if same name
                    newBackdropNodes[n].nodePosition = nodesPositionToRestore[o]; // reset the accurate node's position
                }
            }
        }
    }

    function restoreBackdrops() {
        Backdrop.setBackdrops(node.root(), topBackdrops); // Reset the old backdrops (to delete the new one)
        if (tplVersionNumber <= 9) {
            var newTitle = oldBackdropTitle.slice(0, -2) + "0" + tplVersionNumber;
        } else {
            var newTitle = oldBackdropTitle.slice(0, -2) + tplVersionNumber;
        }
        oldBackdrop.title = newTitle; // Set the new version in the backdrop title
        oldBackdrop.description = newBackdropDescription; // just in case set the descriptions from tpl backdrop
    }

    function restoreAnimationKeys() {
        var tlCopied = [oldNodesGroup + "/" + characName]; // we copy the animation keys from the old character
        var myCopyOptions = copyPaste.getCurrentCreateOptions();
        tlCopy = copyPaste.copy(tlCopied, firstFrame, numberOfFrames, myCopyOptions); //dragObjet copy
        var tlPasted = [newcharacNodePathTMP];
        //copyPaste.usePasteSpecial(true); // Tentative pour conserver les drawings qui sautent
        //copyPaste.setPasteSpecialDrawingAction("ADD_OR_REMOVE_EXPOSURE");
        //copyPaste.setPasteSpecialDrawingFileMode("ONLY_CREATE_IF_DOES_NOT_EXIST");
        //copyPaste.setPasteSpecialMatchNodeName(true);
        var myPasteOptions = copyPaste.getCurrentPasteOptions();
        copyPaste.paste(tlCopy, tlPasted, firstFrame, numberOfFrames, myPasteOptions); // and we paste the keys to retrieve the posing / animations
    }
    scene.endUndoRedoAccum();
}
