function ST_DrawingExpoRemove() {
	var ColumnsArray = [];
	var currentKf = frame.current();
	var nextDrawExpo;
	var nextKeyDrawExpoName;
	var endKf = frame.numberOf();
	scene.beginUndoRedoAccum("ST_DrawingExpoRemove");
	CreateColumnArray();
	for (var i in ColumnsArray) {
		var KeyDrawExpoPrevName = column.getDrawingName(ColumnsArray[i], currentKf);
		for (j = currentKf + 1; j < endKf; j++) {
			nextKeyDrawExpoName = column.getDrawingName(ColumnsArray[i], j);
			if (nextKeyDrawExpoName !== KeyDrawExpoPrevName) {
				var nextDrawExpo = j;
				break;
			}
		}
		var layerName = column.getDisplayName(ColumnsArray[i]) + "-";
		var drawingSubName = nextKeyDrawExpoName.slice(layerName.length, -4)
		column.setEntry(ColumnsArray[i], 1, nextDrawExpo - 1, drawingSubName);
		column.setEntry(ColumnsArray[i], 1, nextDrawExpo, drawingSubName);
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