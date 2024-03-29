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
	}
	scene.beginUndoRedoAccum("ST_FillDrawingExposures");
	if (previousDrawExpo) {
		column.fillEmptyCels(columnName, previousDrawExpo, nextDrawExpo);
	} else if (nextDrawExpoName && !drawExpoName) {
		var layerName = column.getDisplayName(columnName) + "-";
		var drawingSubName = nextDrawExpoName.slice(layerName.length, -4)
		for (var i = 1; i < nextDrawExpo; i++) {
			column.setEntry(columnName, 1, i, drawingSubName);
		}
		column.removeDuplicateKeyDrawingExposureAt(columnName, nextDrawExpo);
	}
	scene.endUndoRedoAccum("");
}