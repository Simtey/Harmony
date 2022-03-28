/* Simon Thery - 2022 - ST_TobAntkSwitch 1.0
Designed for Tobie Lolness production

A toogle to make the animatic more convenient to animate
mode 1 = the original display (animatic in small on the scene)
mode 2 = animatic full screen over the scene
mode 3 = new Antk display

------CODE FOR SHORTCUTS.XML---------

<shortcut checkable="false" id="TobAntkSwitch"  itemParameter="TobAntkSwitch in ST_TobAntkSwitch.js"  responder="scriptResponder" slot="onActionExecuteScript(QString)" text="TobAntkSwitch"  value=""/>

--------------------------------------
*/
function TobAntkSwitch() {
	MessageLog.clearLog();
	var AntkNode = "Top/Display_ANIMATIC";
	var nodeExist = node.isLinked(AntkNode,
		0
	)
	// Put the animatic full screen
	scene.beginUndoRedoAccum("Animatic switch display");
	if (node.getEnable("Top/ANIMATIC-activate_to_minimize")) {
		node.setEnable("Top/ANIMATIC-activate_to_minimize", false);
	// If already full screen we setup the new display
	} else {
		if (nodeExist === false) { // check if the node exists for the toggle
			//add the display node
			node.add("Top/",
				"Display_ANIMATIC",
				"DISPLAY",
				800,
				3850,
				0
			)
			//Link the display node to the animatic
			node.link("Top/ANIMATIC_CLEAN",
				0,
				AntkNode,
				0
			)
			//Unlink the animatic from the main composite
			node.unlink("Top/Composite_SCENE",
				5
			)
		} else {
	// Reset to the original setup
			// Delete the display node
			if (node.getEnable("Top/ANIMATIC-activate_to_minimize") === false)
				node.setEnable("Top/ANIMATIC-activate_to_minimize", true);
			node.deleteNode(AntkNode);
			//Link the animatic to the main composite
			node.link("Top/Transparency",
				0,
				"Top/Composite_SCENE",
				5
			)
		}
	}
	scene.endUndoRedoAccum();
}