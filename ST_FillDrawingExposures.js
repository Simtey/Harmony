// ST_FillDrawingExposures - Simon Thery 2024 - MPL-2.0 - Fill the empty drawing regarding the previous one
function ST_FillDrawingExposures() {
	var columnName = Timeline.selToColumn(0);
	var drawExpoName = column.getDrawingName(columnName, frame.current());
	if (column.type(columnName) === "DRAWING") {
		for (var i = frame.current(); i >= 1; i--) {
			if (column.getDrawingName(columnName, i) !== drawExpoName) {
				var previousDrawExpo = i;
				break;
			}
		}
		for (var j = frame.current(); j <= frame.numberOf(); j++) {
			if (column.getDrawingName(columnName, j) !== drawExpoName) {
				var nextDrawExpoName = column.getDrawingName(columnName, j);
				var nextDrawExpo = j;
				break;
			}
		}
		scene.beginUndoRedoAccum("ST_FillDrawingExposures");
		if (previousDrawExpo && nextDrawExpoName) { // if empty between two drawings
			column.fillEmptyCels(columnName, previousDrawExpo, nextDrawExpo);

		} else if (!nextDrawExpoName) { // if empty from a drawing to the end
			if (!drawExpoName) { // if current frames is an empty drawing
				var prevDrawExpoName = column.getDrawingName(columnName, previousDrawExpo);
			} else {
				var prevDrawExpoName = drawExpoName;
				previousDrawExpo += 1;
			}
			var layerName = column.getDisplayName(columnName) + "-";
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
			for (var i = previousDrawExpo; i <= frame.numberOf(); i++) {
				column.setEntry(columnName, 1, i, drawingSubName);
			}

		} else if (nextDrawExpo && !drawExpoName) { // if empty from the beginning to a drawing
			var layerName = column.getDisplayName(columnName) + "-";
			var drawingSubName = nextDrawExpoName.slice(layerName.length, -4)
			for (var i = 1; i < nextDrawExpo; i++) {
				column.setEntry(columnName, 1, i, drawingSubName);
			}
			column.removeDuplicateKeyDrawingExposureAt(columnName, nextDrawExpo);
		}
		scene.endUndoRedoAccum("");
	}
}