/* Simon Thery - 2022 - ST_ToggleFrameMarker 1.0
A script to simply add or delete a frame marker

When the script is added in Harmony --> to add it as a shortcut :
1. Edit to the files : C:\Program Files (x86)\Toon Boom Animation\Toon Boom Harmony 21 Premium\resources\shortcuts.xml
2. Go to the end of the file and on a line above the closing tag </shortcuts>
3. paste the following lines
<category condition="not scan and not paint and hasTagging" id="ST_scripts" text="Scripts" >
	<shortcut checkable="false" id="ToggleFrameMarker"  itemParameter="ToggleFrameMarker in ST_ToggleFrameMarker.js"  responder="scriptResponder" slot="onActionExecuteScript(QString)" text="ToggleFrameMarker"  value=""/>
</category>
4. save the sortcuts.xml file (You must have the administrator permission)
5. boot or reboot Harmony --> you can now find the script in Edit --> Keyboard shortcuts
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
		var markerColor = currentFrameMarker.type; // gets the marker color
		
		Timeline.deleteFrameMarker(selectedLayer, markerID); // delete the marker on the current selected frame
	}
}
scene.endUndoRedoAccum();
