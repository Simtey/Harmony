/* Simon Thery - 2022 - ST_emptyDrawingPivotInPlace 1.0
create an empty drawing which keep the pivot in place and the deformer + select the pencil and the line art.

------CODE FOR SHORTCUTS.XML---------

	<shortcut checkable="false" id="emptyDrawingPivotInPlace"  itemParameter="emptyDrawingPivotInPlace in ST_emptyDrawingPivotInPlace.js"  responder="scriptResponder" slot="onActionExecuteScript(QString)" text="emptyDrawingPivotInPlace"  value=""/>
	
-------------------------------------
*/
function emptyDrawingPivotInPlace() {
	scene.beginUndoRedoAccum("Creates a new drawing while keeping the old pivot");
	var selectedNode = selection.selectedNode(0);
	var selectedFrame = Timeline.firstFrameSel;
	var drawingColumn = node.linkedColumn(selectedNode, "DRAWING.ELEMENT");
	column.duplicateDrawingAt(drawingColumn, selectedFrame);
	Action.perform("onActionChooseSelectTool()");
	var allLayerIsSelected = ToolProperties.getApplyToAllLayers();
	if (allLayerIsSelected === false) {
		ToolProperties.setApplyAllArts(true);
	}
	Action.perform("selectAll()", "cameraView");
	Action.perform("deleteSelection()", "cameraView");
	if (allLayerIsSelected === false) {
		ToolProperties.setApplyAllArts(false);
	}
	Action.perform("onActionChoosePencilTool()"); // choose the pencil
	//Action.perform("onActionChooseBrushTool()");  // choose the brush
	//Action.perform("onActionChooseSpTransformTool()"); // put back the transform tool
	DrawingTools.setCurrentArt(4); //Underlay(1), Colour Art(2), Line Art(4), Overlay(8)
	scene.endUndoRedoAccum();
}