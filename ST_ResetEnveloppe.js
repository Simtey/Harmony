scene.beginUndoRedoAccum("Create Frame markers");
MessageLog.clearLog();

var selectedNode = selection.selectedNode(selectedNode);
var parent = node.parentNode(selectedNode);
var currentNode ;

function ResetEnveloppe() {
var i = 0;
  if (node.isGroup(parent))
  {
    while(i < node.numberOfSubNodes(parent))
    {
      currentNode = node.subNode(parent, i);
	  MessageLog.trace(currentNode.deformer);
	  
//j'insère le reset ici --> function si besoin
      i++;
    }
  }
} 
scene.endUndoRedoAccum();

/* -->pas bon --> remet les curves à 0 mais pas le deformer
node.setTextAttr( currentNode, "restingoffset.x", frame.current(), 0 );
			node.setTextAttr( currentNode, "restingoffset.y", frame.current(), 0 );
			node.setTextAttr( currentNode, "restlength0", frame.current(), 0 );
			node.setTextAttr( currentNode, "restingorientation0", frame.current(), 0 );
			node.setTextAttr( currentNode, "restlength1", frame.current(), 0 );
			node.setTextAttr( currentNode, "restingorientation1", frame.current(), 0 );
*/
