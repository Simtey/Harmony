/* Simon Thery - 2022 - goToNextPegKeyframe v1.3 - Licence : Mozilla Public License Version 2.0
Select the first peg above the selected drawing and goes to the next keyframe

version 1.1 : now also works with the deformers and if you directly select an attribute in the timemline.
version 1.2 : if several pegs and/or deformers OR if several attributes are selected it goes to the nearest next keyframe of theses selected items.
version 1.3 : fix the selection issue when the keyframe is at the last frame of the timeline
*/

function goToNextPegKeyframe() {
    var selNodes = selection.selectedNodes();
    var bkpFrame = frame.numberOf() +1;
    var bkpattribute = "";

    if (selNodes[0] === undefined) { // if the selection is not a node but an attribute in the timeline 
        var selectedAttributes = [];
        var numLaySel = Timeline.numLayerSel;
        for (var i = 0; i < numLaySel; i++) { // for all the layers selected in the timeline
            selectedAttributes.push(Timeline.selToColumn(i)); //we get the column name and add it to an array
        }
        for (var i = frame.current() + 1; i <= frame.numberOf(); i++) {
            for (var j in selectedAttributes) {
                if (column.isKeyFrame(selectedAttributes[j], 4, i) === true && bkpFrame > i) {
                    bkpattribute = selectedAttributes[j];
                    bkpFrame = i; // in case of multiple selection we want to get the 1st keyframe found
                }
            }
        }
        if (bkpattribute !== "") { // avoid to go to the last frame if there is no more keyframe
            frame.setCurrent(bkpFrame);
            Timeline.centerOnFrame(bkpFrame);
        }

    } else if (selNodes[0] !== undefined) { // if several nodes are selected we make an array of them if they are peg deformer or the peg above a drawing.
        var selNodesArray = [];
        for (var n in selNodes) {
            if (node.type(selNodes[n]) === "PEG") { // if one of the selected node is a peg
                selNodesArray.push(selNodes[n]); // we put this node in the array
            } else if (node.type(selNodes[n]) === "READ") { // if one of the selected node is a drawing
                //selection.removeNodeFromSelection(selNodes[n]); // remove the drawing from the selection to replace it with its peg later (dispensable)
                var i = 0;
                while (i < 1 && selNodes[n] !== "") {
                    var nodeAbove = node.flatSrcNode(selNodes[n], 0); //we check each node above until it is a peg
                    selNodes[n] = nodeAbove;
                    if (node.type(selNodes[n]) === "PEG") {
                        selNodesArray.push(selNodes[n]); // then we add this peg to the array
                        //selection.addNodeToSelection(selNodes[n]); // select the peg (dispensable)
                        i++;
                    }
                }
            } else { // if not a peg nor a drawing we check if it is a deformer node to put it in the array
                var deformerTypes = ["CurveModule", "OffsetModule", "BendyBoneModule", "FreeFormDeformation", "GameBoneModule"];
                for (var i in deformerTypes) {
                    if (node.type(selNodes[n]) === deformerTypes[i]) {
                        selNodesArray.push(selNodes[n]);
                    }
                }
            }
        }
        var srcAttrs = [];
        var bkpLinkColOptions = "";
        for (var i = frame.current() + 1; i <= frame.numberOf(); i++) { //we check each frame after the current selection
            for (var j in selNodesArray) { // for each node listed in the array
                if (node.type(selNodesArray[j]) === "PEG") { // if the node is a peg we check these attributes
                    srcAttrs = ["POSITION.3DPATH", "POSITION.X", "POSITION.Y", "POSITION.Z", "SCALE.x", "SCALE.y", "ROTATION.ANGLEZ", "SKEW"];
                } else { // if the node is a deformer we check these attributes
                    srcAttrs = ["length0", "orientation0", "offset.x", "offset.y", "length1", "orientation1"];
                }
                for (var k in srcAttrs) { // for each attribute listed in the array
                    var linkColOptions = node.linkedColumn(selNodesArray[j], srcAttrs[k]);
                    if (column.isKeyFrame(linkColOptions, 4, i) === true && bkpFrame > i) { // we find the next keyframe
                        bkpLinkColOptions = linkColOptions;
                        bkpFrame = i; // in case of multiple selection we only keep the 1st keyframe found
                    }
                }
            }
        }
        if (bkpLinkColOptions !== "") { // avoid to go to the last frame if there is no more keyframe
            frame.setCurrent(bkpFrame);
            Timeline.centerOnFrame(bkpFrame);
        }
    }
}
