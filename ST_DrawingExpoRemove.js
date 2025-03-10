/*ST_DrawingExpoRemove - Simon Thery - 2024 - Licence : Mozilla Public License Version 2.0
To be used as a shorcut ('ctrl' + '-' for instance) - Delete an exposure to the current drawing only (don't pull the entire timeline)*/
function ST_DrawingExpoRemove() {
	var ColumnsArray = [];
	var currentKf = frame.current();
	var nextKeyDrawExpoName;
	var endKf = frame.numberOf() + 2;
	scene.beginUndoRedoAccum("ST_DrawingExpoRemove");
	CreateColumnArray();
	for (var i in ColumnsArray) {
		var KeyDrawExpoPrevName = column.getDrawingName(ColumnsArray[i], currentKf);
		for (j = currentKf + 1; j < endKf; j++) {
			nextKeyDrawExpoName = column.getDrawingName(ColumnsArray[i], j);
			var bkpExpo = j;
			if (nextKeyDrawExpoName !== KeyDrawExpoPrevName) {
				var nextDrawExpo = j;
				break;
			}
		}
		if (nextDrawExpo) {
			var layerName = column.getDisplayName(ColumnsArray[i]) + "-";
			var drawingSubName = nextKeyDrawExpoName.slice(layerName.length, -4)
			column.setEntry(ColumnsArray[i], 1, nextDrawExpo - 1, drawingSubName);
			column.setEntry(ColumnsArray[i], 1, nextDrawExpo, drawingSubName);
		} else {
			column.setEntry(ColumnsArray[i], 1, bkpExpo - 1, "");
		}
	}

	function CreateColumnArray() {
		var numSelLayers = Timeline.numLayerSel;
		for (var i = 0; i < numSelLayers; i++) {
			if (Timeline.selIsColumn(i)) {
				ColumnsArray.push(Timeline.selToColumn(i));
			}
		}
	}
	scene.endUndoRedoAccum("");
}