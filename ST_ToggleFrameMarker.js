/* Simon Thery - 2021 - ST_ToggleFrameMarker 1.0
A script to simply add or delete a frame marker
to be done --> add this line inside the shortcut XML to make it appear in the shortcuts
*/
scene.beginUndoRedoAccum("Create Frame markers");
//MessageLog.clearLog();
var selectedNode = selection.selectedNode(Timeline.firstFrameSel); //get the selectedNode
var selectedLayer = Timeline.selToLayer(selectedNode); // convert the node to layerIndex
var selectedFrame = Timeline.firstFrameSel;
var color;
var currentFrameMarker = Timeline.getFrameMarker(selectedLayer, selectedFrame);

function ToggleFrameMarker() {
	if (currentFrameMarker === undefined) { // if no marker --> place a red one
		color = "Red";
		placeFM();
	} else if (currentFrameMarker.type === "Red") { // if red --> make it blue
		color = "Blue";
		placeFM();
	} else if (currentFrameMarker.type === "Blue") { // if blue --> make it Orange
		color = "Orange";
		placeFM();
	} else {
		deleteFM();									// Delete the marker if not red or blue.
	}

	function placeFM() {
		Timeline.createFrameMarker(selectedLayer, color, selectedFrame); // place a marker on the current selected frame
	}

	function deleteFM() {
		
		var markerID = currentFrameMarker.id; // gets the marker ID
		var markerColor = currentFrameMarker.type; // gets the marker color
		
		Timeline.deleteFrameMarker(selectedLayer, markerID); // delete the marker on the current selected frame
	}
}
scene.endUndoRedoAccum();
