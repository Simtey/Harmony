function ST_AddDrawExpo() {
	var ColumnsArray = [];
	var currentKf = frame.current();
	var nextDrawExpo;
	var nextKeyDrawExpoName;
	var nextKeyDrawExpoName2;
	var endKf = frame.numberOf();
	scene.beginUndoRedoAccum("ST_AddDrawExpo");
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
		if (nextKeyDrawExpoName !== nextKeyDrawExpoName2) {
			var d = new Dialog();
			d.title = "A drawing exposure will be deleted";
			d.okButtonText = "Continue";
			d.cancelButtonText = "Abort";
			var bodyText = new Label();
			bodyText.text = "The drawing substitution " + nextKeyDrawExpoName2 + " will be replaced with the previous one " + nextKeyDrawExpoName + "\nDo you still want to proceed ?";
			d.add(bodyText);
			if (!d.exec()) {
				return false;
			}
		}
		column.addKeyDrawingExposureAt(ColumnsArray[i], nextDrawExpo + 1);
		column.removeKeyDrawingExposureAt(ColumnsArray[i], nextDrawExpo);
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