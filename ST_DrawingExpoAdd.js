function ST_DrawingExpoAdd() {
	var ColumnsArray = [];
	var currentKf = frame.current();
	var nextDrawExpo;
	var nextKeyDrawExpoName;
	var nextKeyDrawExpoName2;
	var endKf = frame.numberOf() + 1;
	CreateColumnArray();
	for (var i in ColumnsArray) {
		var KeyDrawExpoPrevName = column.getDrawingName(ColumnsArray[i], currentKf);
		for (j = currentKf + 1; j < endKf; j++) {
			nextKeyDrawExpoName = column.getDrawingName(ColumnsArray[i], j);
			nextKeyDrawExpoName2 = column.getDrawingName(ColumnsArray[i], j + 1);
			if (nextKeyDrawExpoName !== KeyDrawExpoPrevName) {
				var nextDrawExpo = j;
				break;
			}
		}
		var layerName = column.getDisplayName(ColumnsArray[i]) + "-";
		var prevDrawingSubName = KeyDrawExpoPrevName.slice(layerName.length, -4)
		var nextDrawingSubName = nextKeyDrawExpoName.slice(layerName.length, -4)
		if (nextDrawExpo && nextKeyDrawExpoName && nextKeyDrawExpoName !== nextKeyDrawExpoName2 && nextDrawExpo !== endKf) {
			if (!nextKeyDrawExpoName2) {
				var deletionStatus = "deleted";
			} else {
				var deletionStatus = "replaced with the previous one " + prevDrawingSubName;
			}
			var d = new Dialog();
			d.title = "A drawing exposure will be deleted";
			d.okButtonText = "Continue";
			d.cancelButtonText = "Abort";
			var bodyText = new Label();
			bodyText.text = "The drawing exposure " + nextDrawingSubName + " will be " + deletionStatus + "\nDo you still want to proceed ?";
			d.add(bodyText);
			if (!d.exec()) {return;} // TO DISABLE THE DIALOG BOX --> add // before the beginning of this line (before the "if")
		}
		scene.beginUndoRedoAccum("ST_DrawingExpoAdd");
		if (!nextKeyDrawExpoName && KeyDrawExpoPrevName) { // if no exposure between two keys but current kf is exposed
			column.setEntry(ColumnsArray[i], 1, nextDrawExpo, prevDrawingSubName);
		} else if (nextKeyDrawExpoName && KeyDrawExpoPrevName) { // if exposure between two keys but current kf is exposed
			column.addKeyDrawingExposureAt(ColumnsArray[i], nextDrawExpo + 1);
			column.removeKeyDrawingExposureAt(ColumnsArray[i], nextDrawExpo);
		} else if (nextKeyDrawExpoName) { // if no exposure  between two keys and current kf is not exposed
			column.addKeyDrawingExposureAt(ColumnsArray[i], nextDrawExpo + 1);
			column.setEntry(ColumnsArray[i], 1, nextDrawExpo, "");
		}
		scene.endUndoRedoAccum("");
	}

	function CreateColumnArray() {
		var numSelLayers = Timeline.numLayerSel;
		for (var i = 0; i < numSelLayers; i++) {
			if (Timeline.selIsColumn(i)) {
				ColumnsArray.push(Timeline.selToColumn(i));
			}
		}
	}
}