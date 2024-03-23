/* ST_TplSave - Simon Thery - 2024 - MPL 2.0
Save a tpl from your selection in a specific folder
*/
function ST_TplSave() {
	var FolderName = "TplSave"; // He you can change the name of the folder where the script saves the tpl files
	var selNodes = selection.selectedNodes();
	var localPath = scene.currentProjectPath() + "/" + FolderName;
	var dir = new Dir;
	dir.path = localPath;
	var tplVersion = 1;
	nodesArray = [];
	if (selNodes) {
		var nodeName = node.getName(selNodes[0]);
		addNodesFromTimeline();
		getVersionNumber();
		copyPaste.createTemplateFromSelection(nodeName + "-v" + tplVersion.toString(), localPath);
	}

	function addNodesFromTimeline() {
		var numSelLayers = Timeline.numLayerSel;
		for (var i = 0; i < numSelLayers; i++) {
			if (Timeline.selIsNode(i)) {
				nodesArray.push(Timeline.selToNode(i));
			}
		}
		selection.addNodesToSelection(nodesArray);
	}

	function getVersionNumber() {
		var allTpl = dir.entryList("*.tpl");
		var myCharacTpl = [];
		for (var i in allTpl) {
			var existTplName = getFirstPart(allTpl[i])
			if (existTplName === nodeName) {
				myCharacTpl.push(allTpl[i]);
			}
		}
		if (myCharacTpl.length >= 1) {
			for (var j in myCharacTpl) {
				if (Number(getSecondPart(myCharacTpl[j]).slice(0, -4)) > tplVersion) {
					tplVersion = Number(getSecondPart(myCharacTpl[j]).slice(0, -4));
				}
			}
			tplVersion++
		}
	}

	function getFirstPart(str) {
		return str.split('-v')[0];
	}

	function getSecondPart(str) {
		return str.split('-v')[1];
	}
}