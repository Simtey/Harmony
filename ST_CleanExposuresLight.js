/*
ST_CleanExposuresLight - Simon Thery - 2023 - Licence : Mozilla Public License Version 2.0
The fastest version of ST_CleanExposures --> just look at the layer selected to find the keyframes

clean the drawing expositions to make them match to the pegs (useful at the posing steps in puppet productions)
- if you chose a drawing in the camera view, it just clean this drawing considering the first keyframes (previous and next) found above (peg or deformer)
- If you chose an open peg in the timeline or a peg in the camera view (with "B" for example) it will clean the nearest drawing under this peg between the nearest keyframes (previous and next) on this peg (or deformer).
- if you chose closed peg (or group) in the timeline it cleans everything (choosing the nearests previous and next keyframes).
*/
function ST_CleanExposuresLight() {
	//MessageLog.clearLog();
	scene.beginUndoRedoAccum("ST_CleanExposuresLight");
	var currentKf = frame.current();
	var endKf = frame.numberOf() + 1;
	var beginKf = 0;
	var drawingColumnArray = []; //list of the drawing columns to expose
	var selNode = selection.selectedNode(0);
	var keyNodesToProcess = ["PEG", "CurveModule", "OffsetModule", "BendyBoneModule", "FreeFormDeformation", "GameBoneModule"]

	if (selection.numberOfNodesSelected() === 1 && node.type(selection.selectedNode(0)) === "READ") { // if only a READ (a drawing) is selected
		drawingColumnArray.push(node.linkedColumn(selNode, "DRAWING.ELEMENT"));
		for (var j in keyNodesToProcess) {
			while (node.type(selNode) !== keyNodesToProcess[j] && node.type(selNode) !== "") { // we find its peg or deformer
				var nodeAbove = node.srcNode(selNode, 0); //we check each node above until it is a peg or a deformer
				selNode = nodeAbove;
			}
		}
	} else if (selection.numberOfNodesSelected() === 1 && Timeline.numLayerSel <= 8 && node.type(selection.selectedNode(0)) === "PEG") { // if only a PEG is selected)
		var selNode = selection.selectedNode(0);
		var testNodeName = selNode;
		while (node.type(testNodeName) !== "READ" && node.type(testNodeName) !== "") { // we find its READ (drawing)
			var nodeUnder = node.dstNode(selNode, 0, 0); //we check each node une until it is a read
			if (nodeUnder !== testNodeName) {
				testNodeName = nodeUnder;
			} else {
				return;
			}
		}
		drawingColumnArray.push(node.linkedColumn(nodeUnder, "DRAWING.ELEMENT"));
	} else { // if peg closed selected in the timeline or mutliple selection in the camera view (in this last case issue = random peg selected for the keyframes)
		SelectedNodesDispatch();
	}
	findKeyframes() // we look for the keyframes
	modifyExposure(beginKf, endKf); // OPTION --> change beginKF by currentKf and it will just clean from the selected Kf to the next one.
	scene.endUndoRedoAccum("");

	function SelectedNodesDispatch() { // get all the drawing elements in an array
		var numSelLayers = Timeline.numLayerSel;
		var testNodeName;
		for (var i = 0; i < numSelLayers; i++) {
			if (Timeline.selIsNode(i)) {
				var currentNodeName = Timeline.selToNode(i);
				if (currentNodeName !== testNodeName) {
					testNodeName = currentNodeName;
					if (node.type(currentNodeName) === "READ") {
						drawingColumnArray.push(node.linkedColumn(currentNodeName, "DRAWING.ELEMENT"));
					}
				}
			}
		}
	}

	function findKeyframes() {
		var srcAttrs = ["POSITION.3DPATH", "POSITION.X", "POSITION.Y", "POSITION.Z", "SCALE.x", "SCALE.y", "ROTATION.ANGLEZ", "SKEW"];
		for (var i = currentKf + 1; i <= frame.numberOf(); i++) { // search next kf
			for (var k in srcAttrs) {
				var linkColOptions = node.linkedColumn(selNode, srcAttrs[k]);
				if (column.isKeyFrame(linkColOptions, 4, i) === true && endKf > i) {
					endKf = i;
				}
			}
		}
		for (var k in srcAttrs) {
			var linkColOptions = node.linkedColumn(selNode, srcAttrs[k]);
		}
		if (column.isKeyFrame(linkColOptions, 4, currentKf) === true || currentKf === 1) { // we check if the current frame is a Keyframe
			beginKf = currentKf;
		} else { // search previous Kf
			for (var i = currentKf - 1; i >= 1; i--) {
				for (var k in srcAttrs) {
					var linkColOptions = node.linkedColumn(selNode, srcAttrs[k]);
					if (column.isKeyFrame(linkColOptions, 4, i) === true && beginKf < i) {
						beginKf = i;
					}
				}
			}
		}
	}

	function modifyExposure(frameToExposeFirst, frameToExposeLast) {
		for (var j in drawingColumnArray) {
			column.addKeyDrawingExposureAt(drawingColumnArray[j], frameToExposeFirst);
			if (endKf !== frame.numberOf()) {
				column.addKeyDrawingExposureAt(drawingColumnArray[j], frameToExposeLast);
			}
			column.fillEmptyCels(drawingColumnArray[j], frameToExposeFirst, frameToExposeLast)
			for (var i = beginKf + 1; i < endKf; i++) {
				column.removeKeyDrawingExposureAt(drawingColumnArray[j], i);
			}
		}
	}
}
