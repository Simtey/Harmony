// ST_FillDrawingExposures - Simon Thery 2024 - MPL-2.0 - Fill the empty drawing regarding the previous one

function ST_FillDrawingExposures() {
	var ColumnsArray = [];
	var previousDrawExpo = 1;
	CreateColumnArray();
	scene.beginUndoRedoAccum("ST_FillDrawingExposures");
	for (var i in ColumnsArray) {
		var previousDrawExpoName = column.getDrawingName(ColumnsArray[i], frame.current());
		if (previousDrawExpoName) { // if on a drawing
			for (var j = frame.current(); j <= frame.numberOf() + 1; j++) {
				if (!column.getDrawingName(ColumnsArray[i], j) || column.getDrawingName(ColumnsArray[i], j) !== previousDrawExpoName) {
					previousDrawExpo = j - 1;
					break;
				}
			}
		} else { // if on a non exposed frame
			for (var j = frame.current(); j >= 1; j--) {
				if (column.getDrawingName(ColumnsArray[i], j)) {
					previousDrawExpo = j;
					break;
				}
			}
			previousDrawExpoName = column.getDrawingName(ColumnsArray[i], previousDrawExpo);
		}
		for (var k = previousDrawExpo + 1; k <= frame.numberOf(); k++) {
			if (column.getDrawingName(ColumnsArray[i], k)) {
				var nextDrawExpoName = column.getDrawingName(ColumnsArray[i], k);
				var nextDrawExpo = k;
				break;
			}
		}
		if (!previousDrawExpoName && !nextDrawExpoName) { // if no drawing on the layer
			return;
		} else if (!previousDrawExpoName) { // if no drawing before
			previousDrawExpo = 1;
			previousDrawExpoName = nextDrawExpoName;
			nextDrawExpo += 1;

		} else if (!nextDrawExpoName) { // if no drawing after
			nextDrawExpo = frame.numberOf() + 1;
			var nextDrawExpoName = previousDrawExpoName;
		}
		var layerName = column.getDisplayName(ColumnsArray[i]) + "-";
		var prevDrawingName = previousDrawExpoName.slice(layerName.length, -4)
		if (nextDrawExpo === frame.numberOf() + 1) { // If fill to the end
			var skipDial = KeyModifiers.IsControlPressed();
			if (skipDial === false) {
				var d = new Dialog();
				d.title = "FIll empty cells to the end ?";
				d.okButtonText = "Continue";
				d.cancelButtonText = "Abort";
				var bodyText = new Label();
				bodyText.text = "The drawing substitution " + prevDrawingName + " will be extended to the end ! " + "\nDo you want to proceed ?" + "\n\n maintain the ctrl key to avoid this dialog box next time";
				d.add(bodyText);
				if (!d.exec()) {
					return;
				}
			}
		}
		var nextDrawExpoName2 = column.getDrawingName(ColumnsArray[i], previousDrawExpo + 1);
		if (!nextDrawExpoName2) {
			for (var m = previousDrawExpo; m < nextDrawExpo; m++) {
				column.setEntry(ColumnsArray[i], 1, m, prevDrawingName);
			}
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