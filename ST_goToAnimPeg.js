/*
Designed for the Tobie Lolness production
Make it easier to find the animation peg.
Select any part of the character then run the script.
version 1.0
Author : Simon Thery - 2022
*/
function TobGoToAnimPeg() {
	scene.beginUndoRedoAccum("Find the accurate layer to animate on");
	Action.perform("onActionCollapseAll()", "timelineView");
	var selectedNode = selection.selectedNode(0);
	var parentNode = node.parentNode(selectedNode);
	selection.clearSelection();
	selection.addNodeToSelection(parentNode);
	Action.perform("onActionNaviSelectChild()", "Node View");
	var selectedNode2 = selection.selectedNode(0);
	skipLocked();
	LayerColour();
	Action.perform("onActionCenterOnSelection()", "timelineView");

	function skipLocked() {
		if (node.getLocked(selectedNode2) === true) {
			Action.perform("onActionNaviSelectChild()", "Node View");
			selectedNode2 = selection.selectedNode(0);
		}
	}

	function LayerColour() {
		var selectedNode = selection.selectedNode(0);
		var myColor = new ColorRGBA(175, 255, 35, 255); // chose your favorite RGB + Alpha colour.
		var curLayColor = node.getColor(selectedNode);
		if (curLayColor.r === 0 && curLayColor.g === 0 && curLayColor.b === 0 && curLayColor.a === 255) {
			node.setColor(selectedNode, myColor);
		}
	}
	scene.endUndoRedoAccum();
}