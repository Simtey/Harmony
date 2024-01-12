/* Simon Thery - 2022 - ST_ResetEnveloppeMulti 1.0
select just one point of deformers to reset the entire shapes */

MessageLog.clearLog();

function ResetEnveloppeMulti() {
scene.beginUndoRedoAccum("ResetEnveloppeMulti");
var myNodes = selection.selectedNodes();
var currentNode;
var parents;
for (var i in myNodes) {
    parents = node.parentNode(myNodes[i]);
    var j = 0;
	if (node.isGroup(parents)) {
		while (j < node.numberOfSubNodes(parents)) {
			currentNode = node.subNode(parents, j);
			var offsetX = node.getTextAttr(currentNode, frame.current(), "restingoffset.x");
			var offsetY = node.getTextAttr(currentNode, frame.current(), "restingoffset.y");
			var orientation0 = node.getTextAttr(currentNode, frame.current(), "restingorientation0");
			var length0 = node.getTextAttr(currentNode, frame.current(), "restlength0")
			var orientation1 = node.getTextAttr(currentNode, frame.current(), "restingorientation1");
			var length1 = node.getTextAttr(currentNode, frame.current(), "restlength1");
			node.setTextAttr(currentNode, "offset.x", frame.current(), offsetX);
			node.setTextAttr(currentNode, "offset.y", frame.current(), offsetY);
			node.setTextAttr(currentNode, "length0", frame.current(), length0);
			node.setTextAttr(currentNode, "orientation0", frame.current(), orientation0);
			node.setTextAttr(currentNode, "length1", frame.current(), length1);
			node.setTextAttr(currentNode, "orientation1", frame.current(), orientation1);
			j++;
		}
	}
}
scene.endUndoRedoAccum();
}