/*
create an empty drawing which keep the pivot in place and the deformer + select the pencil and the line art.
version 1.0
Author : Simon Thery - 2022
*/
function emptyDrawingPivotInPlace() {
	scene.beginUndoRedoAccum("Creates a new drawing while keeping the old pivot");
	var selectedNode = selection.selectedNode(0);
	var selectedFrame = Timeline.firstFrameSel;
	var drawingColumn = node.linkedColumn(selectedNode, "DRAWING.ELEMENT");
	var allLayerIsSelected = ToolProperties.getApplyToAllLayers();
	column.duplicateDrawingAt(drawingColumn, selectedFrame); // duplicate the selected drawing
	Action.perform("onActionChooseSelectTool()"); // Select the selection tool
		ToolProperties.setApplyAllArts(true); // turns on "apply to Line and Colour Art" tool property
	Action.perform("selectAll()", "cameraView"); // select all the arts
	Action.perform("deleteSelection()", "cameraView"); // and delete them
	if (allLayerIsSelected === false) {
		ToolProperties.setApplyAllArts(false); // put back the "apply to..." to its original setup.
	}
	Action.perform("onActionChoosePencilTool()"); // choose the pencil
	//Action.perform("onActionChooseBrushTool()");  // choose the brush
	//Action.perform("onActionChooseSpTransformTool()"); // put back the transform tool
	DrawingTools.setCurrentArt(4); //Underlay(1), Colour Art(2), Line Art(4), Overlay(8)
	scene.endUndoRedoAccum();
}