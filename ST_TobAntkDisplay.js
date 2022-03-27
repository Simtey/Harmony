/* Simon Thery - 2022 - ST_TobAntkDisplay 1.0
Designed for Tobie Lolness production
Setup a more convenient animatic display
*/
function TobAntkDisplay() {
	// MessageLog.clearLog();
	// desactivate mini peg
	scene.beginUndoRedoAccum("Create Antk Display");
	if (node.getEnable("Top/ANIMATIC-activate_to_minimize"))
		node.setEnable("Top/ANIMATIC-activate_to_minimize", false);
	//add the display node
	node.add("Top/",
		"Antk",
		"DISPLAY",
		800,
		3850,
		0
	)
	//Link the display node to the animatic
	node.link("Top/Transparency",
		0,
		"Top/Antk",
		0
	)
	//Unlink the animatic from the main composite
	node.unlink("Top/Composite_SCENE",
		5
	)
	scene.endUndoRedoAccum();
}