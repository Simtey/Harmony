// ST_KeyDrawingJumpers - Simon Thery 2024 - MPL-2.0
// each functions permit to navigate from one drawing to the other (key to key, or breakdown to breakdown)

function ST_PreviousKeyDrawing() {
	var prevKeyExpo = frame.current();
	var columnName = Timeline.selToColumn(0);
	var drawExpoName = column.getDrawingName(columnName, frame.current());
	if (column.type(columnName) === "DRAWING") {
		for (var i = frame.current(); i >= 1; i--) {
			var drawCurrentType = column.getDrawingType(columnName, i);
			if (drawCurrentType === "K" && column.getDrawingName(columnName, i) !== drawExpoName) {
				var drawExpoName2 = column.getDrawingName(columnName, i);
				if (column.getDrawingName(columnName, i - 1) !== drawExpoName2) {
					prevKeyExpo = i;
					break;
				}
			}
		}
		frame.setCurrent(prevKeyExpo);
		Timeline.centerOnFrame(prevKeyExpo);
	}
}

function ST_NextKeyDrawing() {
	var endKf = frame.numberOf();
	var nextKeyDrawExpo = frame.current();
	var columnName = Timeline.selToColumn(0);
	var drawExpoName = column.getDrawingName(columnName, frame.current());
	if (column.type(columnName) === "DRAWING") {
		for (var i = frame.current(); i <= endKf; i++) {
			var drawCurrentType = column.getDrawingType(columnName, i);
			if (drawCurrentType === "K" && column.getDrawingName(columnName, i) !== drawExpoName) {
				nextKeyDrawExpo = i;
				break;
			}
		}
		frame.setCurrent(nextKeyDrawExpo);
		Timeline.centerOnFrame(nextKeyDrawExpo);
	}
}

function ST_PreviousBreakdownDrawing() {
	var prevBdExpo = frame.current();
	var columnName = Timeline.selToColumn(0);
	var drawExpoName = column.getDrawingName(columnName, frame.current());
	if (column.type(columnName) === "DRAWING") {
		for (var i = frame.current(); i >= 1; i--) {
			var drawCurrentType = column.getDrawingType(columnName, i);
			if (drawCurrentType === "B" && column.getDrawingName(columnName, i) !== drawExpoName) {
				var drawExpoName2 = column.getDrawingName(columnName, i);
				if (column.getDrawingName(columnName, i - 1) !== drawExpoName2) {
					prevBdExpo = i;
					break;
				}
			}
		}
		frame.setCurrent(prevBdExpo);
		Timeline.centerOnFrame(prevBdExpo);
	}
}

function ST_NextBreakdownDrawing() {
	var endKf = frame.numberOf();
	var nextBdExpo = frame.current();
	var columnName = Timeline.selToColumn(0);
	var drawExpoName = column.getDrawingName(columnName, frame.current());
	if (column.type(columnName) === "DRAWING") {
		for (var i = frame.current(); i <= endKf; i++) {
			var drawCurrentType = column.getDrawingType(columnName, i);
			if (drawCurrentType === "B" && column.getDrawingName(columnName, i) !== drawExpoName) {
				nextBdExpo = i;
				break;
			}
		}
		frame.setCurrent(nextBdExpo);
		Timeline.centerOnFrame(nextBdExpo);
	}
}