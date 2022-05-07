/*
Add a red marker on all the keys of the current layer.
version 1.0
Author : Simon Thery - 2022
*/
function TobPosingsMarkers() {
	scene.beginUndoRedoAccum("Posing markers");
	var OriginFrame = Timeline.firstFrameSel;
	var selectedNode = selection.selectedNode(0);
	var selectedLayer = Timeline.selToLayer(selectedNode);
	var currentKeyframe = -1;
	var nextKeyframe;
	frame.setCurrent(1);
	Action.perform("onActionGoToNextKeyFrame()", "timelineView")
	Action.perform("onActionGoToPrevKeyFrame()", "timelineView") // hack not to mark the first frame if no kf on it
	while (nextKeyframe !== currentKeyframe) {
		currentKeyframe = Timeline.firstFrameSel;
		Timeline.createFrameMarker(selectedLayer, "Red", currentKeyframe); // color may be --> Red, Orange, Yellow, Green, Cyan, Blue, Purple, Pink, White, Black
		Action.perform("onActionGoToNextKeyFrame()", "timelineView")
		nextKeyframe = Timeline.firstFrameSel;
	}
	frame.setCurrent(OriginFrame);
	scene.endUndoRedoAccum("");
}