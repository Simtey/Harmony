/*
ST_CleanExposures() - Simon Thery - 2023 - Licence : Mozilla Public License Version 2.0
Known issue --> it is slow with big puppets, see the light version if you don't need the transformers keyframes to be seen.

clean the drawing expositions to make them match to the pegs (useful at the posing steps in puppet productions)
- if you chose a drawing in the camera view, it just clean this drawing considering the first keyframes (previous and next) found above (peg or deformer)
- If you chose an open peg in the timeline or a peg in the camera view (with "B" for example) it will clean the nearest drawing under this peg by checking all the pegs and deformers from this peg to the drawing to find the nearest keyframes (previous and next)
- If you chose a multiple selection in the camera view it will clean all the drawing selected by checking all the pegs and deformers just above each one of these drawings and chosing the nearest keyframes on those pegs / deformers (previous and next)
- if you chose closed peg (or group ) in the timeline it cleans everything (choosing the nearests previous and next keyframes on the pegs and deformers)
*/
function ST_CleanExposures() {
	//MessageLog.clearLog();
	scene.beginUndoRedoAccum("ST_CleanExposures");
	var currentKf = frame.current();
	var endKf = frame.numberOf() + 1;
	var beginKf = 0;
	var selPegArray = []; // list of the pegs where we have to look for keyframes.
	var drawingColumnArray = []; //list of the drawing columns to expose
	var keyNodesToProcess = ["PEG", "CurveModule", "OffsetModule", "BendyBoneModule", "FreeFormDeformation", "GameBoneModule"]

	if (selection.numberOfNodesSelected() === 1 && node.type(selection.selectedNode(0)) === "READ") { // if only a READ (a drawing) is selected in the timeline or the camera view
		var selNode = selection.selectedNode(0);
		drawingColumnArray.push(node.linkedColumn(selNode, "DRAWING.ELEMENT"));
		FindReadPeg();
	} else if (selection.numberOfNodesSelected() === 1 && Timeline.numLayerSel <= 8 && node.type(selection.selectedNode(0)) === "PEG") { // if only a PEG is selected in the timeline or camera view
		var selNode = selection.selectedNode(0);
		for (var j in keyNodesToProcess) {
			while (node.type(selNode) === keyNodesToProcess[j] && node.type(selNode) !== "READ" && node.type(selNode) !== "") { // we find its READ (drawing)
				selPegArray.push(selNode);
				var nodeUnder = node.dstNode(selNode, 0, 0); //we check each node une until it is a read
				selNode = nodeUnder;
			}
		}
		drawingColumnArray.push(node.linkedColumn(nodeUnder, "DRAWING.ELEMENT"));
	} else if (selection.numberOfNodesSelected() === 1 && Timeline.numLayerSel > 8) { // if multiple selection in the timeline (closed peg)
		SelectedNodesDispatch();
	} else if (selection.numberOfNodesSelected() > 1) { // if multiple selection in the camera view
		var selNodesArray = selection.selectedNodes();
		FindReadPeg();
		SelectedNodesDispatch();
	}
	findKeyframes() // we look for the keyframes
	modifyExposure(beginKf, endKf); // OPTION --> change beginKF by currentKf and it will just clean from the selected Kf to the next one.
	scene.endUndoRedoAccum("");

	function FindReadPeg() {
		var localSelNodeArray;
		if (selNode) {
			localSelNodeArray = [selNode];
		} else {
			localSelNodeArray = selNodesArray;
		}
		for (var i = 0; i < localSelNodeArray.length; i++) {
			var nodeToCheck = node.srcNode(localSelNodeArray[i], 0);
			for (var j in keyNodesToProcess) {
				while (node.type(nodeToCheck) !== keyNodesToProcess[j] && node.type(nodeToCheck !== "")) {
					nodeToCheck = node.srcNode(nodeToCheck, 0)
				}
			}
			selPegArray.push(nodeToCheck);
		}
	}

	function SelectedNodesDispatch() { // makes 2 arrays from the selected nodes in the timeline.
		var numSelLayers = Timeline.numLayerSel;
		var testNodeName;
		if (selNodesArray) { // si selNodesArray existe (multiple selection dans la camera view)
			for (var i = 0; i < selNodesArray.length; i++) {
				var currentNodeName = selNodesArray[i];
				drawingColumnArray.push(node.linkedColumn(currentNodeName, "DRAWING.ELEMENT"));
			}
		} else {
			for (var i = 0; i < numSelLayers; i++) {
				if (Timeline.selIsNode(i)) {
					var currentNodeName = Timeline.selToNode(i);
					if (currentNodeName !== testNodeName) {
						testNodeName = currentNodeName;
						for (var j in keyNodesToProcess) {
							if (node.type(currentNodeName) === keyNodesToProcess[j]) {
								selPegArray.push(currentNodeName);
							} else if (node.type(currentNodeName) === "READ") {
								drawingColumnArray.push(node.linkedColumn(currentNodeName, "DRAWING.ELEMENT"));
							}
						}
					}
				}
			}
		}
	}

	function findKeyframes() {
		var pegAttrs = ["POSITION.3DPATH", "POSITION.X", "POSITION.Y", "POSITION.Z", "SCALE.x", "SCALE.y", "ROTATION.ANGLEZ", "SKEW"];
		var deformersAttrs = ["length0", "orientation0", "offset.x", "offset.y", "length1", "orientation1"];
		var srcAttrs = [];
		for (var i = currentKf + 1; i <= frame.numberOf(); i++) { // Search next Kf
			for (var j in selPegArray) {
				if (node.type(selPegArray[j]) === "PEG") {
					srcAttrs = pegAttrs;
				} else {
					srcAttrs = deformersAttrs;
				}
				for (var k in srcAttrs) {
					var linkColOptions = node.linkedColumn(selPegArray[j], srcAttrs[k]);
					if (column.isKeyFrame(linkColOptions, 4, i) === true && endKf > i) {
						endKf = i;
					}
				}
			}
		}
		for (var j in selPegArray) {
			if (node.type(selPegArray[j]) === "PEG") {
				srcAttrs = pegAttrs;
			} else {
				srcAttrs = deformersAttrs;
			}
			for (var k in srcAttrs) {
				var linkColOptions = node.linkedColumn(selPegArray[j], srcAttrs[k]);
			}
		}
		if (column.isKeyFrame(linkColOptions, 4, currentKf) === true || currentKf === 1) { // we check if the current frame is a Keyframe
			beginKf = currentKf;
		} else { // Search the previous Kf
			for (var i = currentKf - 1; i >= 1; i--) {
				for (var j in selPegArray) {
					for (var k in srcAttrs) {
						var linkColOptions = node.linkedColumn(selPegArray[j], srcAttrs[k]);
						if (column.isKeyFrame(linkColOptions, 4, i) === true && beginKf < i) {
							beginKf = i;
						}
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