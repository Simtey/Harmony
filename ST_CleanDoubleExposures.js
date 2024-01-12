/*
ST_CleanDoubleExposures - Simon Thery - 2024 - Licence : Mozilla Public License Version 2.0
*/
function ST_CleanDoubleExposures() {
	//MessageLog.clearLog();
	scene.beginUndoRedoAccum("ST_CleanDoubleExposures");
	var drawingColumnArray = []; //list of the drawing columns to expose
	SelectedNodesDispatch();
	modifyExposure();
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

	function modifyExposure() {
		for (var j in drawingColumnArray) {
			for (var i = 0; i <= frame.numberOf(); i++) {
				column.fillEmptyCels(drawingColumnArray[j], i, i + 1)
				column.removeDuplicateKeyDrawingExposureAt(drawingColumnArray[j], i)
			}
		}
	}
}