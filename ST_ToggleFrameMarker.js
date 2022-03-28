/* Simon Thery - 2022 - ST_ToggleFrameMarker 1.0
A script to simply add or delete a frame marker
--> select a frame on the timeline then run the script :
- One time = Red (or delete all frame marker non red/blue)
- Two time = Blue
- Three time = Orange
- The fourth delete the frame marker

------CODE FOR SHORTCUTS.XML---------

<category condition="not scan and not paint and hasTagging" id="ST_scripts" text="Scripts" >
	<shortcut checkable="false" id="ToggleFrameMarker"  itemParameter="ToggleFrameMarker in ST_ToggleFrameMarker.js"  responder="scriptResponder" slot="onActionExecuteScript(QString)" text="ToggleFrameMarker"  value=""/>

--------------------------------------
*/
scene.beginUndoRedoAccum("Create Frame markers");
//MessageLog.clearLog();
var selectedNode = selection.selectedNode(Timeline.firstFrameSel); //get the selectedNode
var selectedLayer = Timeline.selToLayer(selectedNode); // convert the node to layerIndex
var selectedFrame = Timeline.firstFrameSel;
var color;
var currentFrameMarker = Timeline.getFrameMarker(selectedLayer, selectedFrame);

function ToggleFrameMarker() {		// colors can be changed --> list = Red, Orange, Yellow, Green, Cyan, Blue, Purple, Pink, White, Black
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
		Timeline.deleteFrameMarker(selectedLayer, markerID); // delete the marker on the current selected frame
	}
}
scene.endUndoRedoAccum();
