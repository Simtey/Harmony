/* Simon Thery - 2022 - ST_ResetEnveloppe 1.0
select just one point of a deformer to reset it.

When the script is added in Harmony --> to add it as a shortcut :
1. Edit to the files : C:\Program Files (x86)\Toon Boom Animation\Toon Boom Harmony 21 Premium\resources\shortcuts.xml
2. Go to the end of the file and on a line above the closing tag </shortcuts>
3. paste the following lines
<category condition="not scan and not paint and hasTagging" id="ST_scripts" text="Scripts" >
	<shortcut checkable="false" id="ResetEnveloppe"  itemParameter="ResetEnveloppe in ST_ResetEnveloppe.js"  responder="scriptResponder" slot="onActionExecuteScript(QString)" text="ResetEnveloppe"  value=""/>
</category>
4. save the sortcuts.xml file (You must have the administrator permission)
5. boot or reboot Harmony --> you can now find the script in Edit --> Keyboard shortcuts
*/

var selectedNode = selection.selectedNode(selectedNode);
var parent = node.parentNode(selectedNode);
var currentNode;

function ResetEnveloppe() {
	scene.beginUndoRedoAccum("ResetEnveloppe");
	// Select each point of the enveloppe in the group and reset the resting information.
	var i = 0;
	if (node.isGroup(parent)) {
		while (i < node.numberOfSubNodes(parent)) {
			currentNode = node.subNode(parent, i);
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
			i++;
		}
	}
	scene.endUndoRedoAccum();
}
