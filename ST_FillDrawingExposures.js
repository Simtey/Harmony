// ST_FillDrawingExposures - Simon Thery 2024 - MPL-2.0 - Fill the empty drawing regarding the previous one
function ST_FillDrawingExposures() {
	var ColumnsArray = [];
	CreateColumnArray();
	var drawExpoName = column.getDrawingName(ColumnsArray[i], frame.current());
	scene.beginUndoRedoAccum("ST_FillDrawingExposures");
	for (var i in ColumnsArray) {
		for (var j = frame.current(); j >= 1; j--) {
			if (column.getDrawingName(ColumnsArray[i], j) !== drawExpoName) {
				var previousDrawExpo = j;
				break;
			}
		}
		for (var k = frame.current(); k <= frame.numberOf(); k++) {
			if (column.getDrawingName(ColumnsArray[i], k) !== drawExpoName) {
				var nextDrawExpoName = column.getDrawingName(ColumnsArray[i], k);
				var nextDrawExpo = k;
				break;
			}
		}
		if (previousDrawExpo && nextDrawExpoName) { // if empty between two drawings
			column.fillEmptyCels(ColumnsArray[i], previousDrawExpo, nextDrawExpo);

		} else if (!nextDrawExpoName) { // if empty from a drawing to the end
			if (!drawExpoName) { // if current frames is an empty drawing
				var prevDrawExpoName = column.getDrawingName(ColumnsArray[i], previousDrawExpo);
			} else {
				var prevDrawExpoName = drawExpoName;
				previousDrawExpo += 1;
			}
			var layerName = column.getDisplayName(ColumnsArray[i]) + "-";
			var drawingSubName = prevDrawExpoName.slice(layerName.length, -4)
			var skipDial = KeyModifiers.IsControlPressed();
			if (skipDial === false) {

				var d = new Dialog();
				d.title = "FIll empty cells to the end ?";
				d.okButtonText = "Continue";
				d.cancelButtonText = "Abort";
				var bodyText = new Label();
				bodyText.text = "The drawing substitution " + drawingSubName + " will be extended to the end ! " + "\nDo you want to proceed ?" + "\n\n maintain the ctrl key to avoid this dialog box next time";
				d.add(bodyText);
				if (!d.exec()) {
					return;
				}
			}
			for (var l = previousDrawExpo; l <= frame.numberOf(); l++) {
				column.setEntry(ColumnsArray[i], 1, l, drawingSubName);
			}

		} else if (nextDrawExpo && !drawExpoName) { // if empty from the beginning to a drawing
			layerName = column.getDisplayName(ColumnsArray[i]) + "-";
			drawingSubName = nextDrawExpoName.slice(layerName.length, -4)
			for (var m = 1; m < nextDrawExpo; m++) {
				column.setEntry(ColumnsArray[i], 1, m, drawingSubName);
			}
			column.removeDuplicateKeyDrawingExposureAt(ColumnsArray[i], nextDrawExpo);
		}
	}

	function CreateColumnArray() {
		var numSelLayers = Timeline.numLayerSel;
		for (var i = 0; i < numSelLayers; i++) {
			if (Timeline.selIsColumn(i) && column.type(Timeline.selToColumn(i)) === "DRAWING") {
				ColumnsArray.push(Timeline.selToColumn(i));
			}
		}
	}
	scene.endUndoRedoAccum("");
}