/*
Report the information from one peg to another one
a résoudre : 
- problèmes d'arrondis en cas de transfos compliquées)
v2 --> vérifier que les peg ne sont pas en quinconce. frame selectionnée + frame d'avant en origine + destination si Kf entre (origine ou destination) on met une kf (destination ou origine).
Author : Simon Thery - 2022 - License MPL 2.0
ui file created in Qt designer)
The ui part of the script is based on CF_CopyPastePivots v.1.0.1 by www.cartoonflow.com
*/
MessageLog.clearLog();
CopyPasteKeyframesInfo();

function execDialog(uiPath) {
	var positionAttributeName = "POSITION";
	var OrigPegPosition;
	var OrigPegScaleX;
	var OrigPegScaleY;
	var OrigPegRotationZ;
	var OrigPegSkew;
	var OrigineIsSeparate;
	var OriginNode;
	var OriginFrame;
	var OriginFirstKf;
	this.CopyPegInfo = function() {
		scene.beginUndoRedoAccum("");
		OriginNode = selection.selectedNode(0);
		var OriginNodeName = node.getName(OriginNode)
		OriginFrame = frame.current();
		// on récupère les infos de la Kf d'origine Tl origine	
		OrigPegPosition = node.getAttr(OriginNode, OriginFrame, positionAttributeName).pos3dValue();
		OrigPegScaleX = node.getAttr(OriginNode, OriginFrame, "SCALE.X").doubleValue();
		OrigPegScaleY = node.getAttr(OriginNode, OriginFrame, "SCALE.Y").doubleValue();
		OrigPegRotationZ = node.getAttr(OriginNode, OriginFrame, "rotation.anglez").doubleValue();
		OrigPegSkew = node.getAttr(OriginNode, OriginFrame, "SKEW").doubleValue();
		OrigineIsSeparate = node.getAttr(OriginNode, OriginFrame, positionAttributeName + ".SEPARATE").boolValue();
		this.ui.OriginNodeName_Label.text = "Copied: " + OriginNodeName;
		this.ui.copiedNodeFrame.text = "At frame: " + OriginFrame;
		if (OriginFrame !== 1) {
			Action.perform("onActionGoToPrevKeyFrame()", "timelineView");
			OriginFirstKf = frame.current();
			Action.perform("onActionGoToNextKeyFrame()", "timelineView");
		}
		scene.endUndoRedoAccum();
	}
	this.PastePegInfo = function() {
		scene.beginUndoRedoAccum("");
		var DestNode = selection.selectedNode(0);
		var destFrame = frame.current();
		// on récupère les infos de la Kf de destination Tl destination	
		var DestPegPosition = node.getAttr(DestNode, OriginFrame, positionAttributeName).pos3dValue();
		var DestPegScaleX = node.getAttr(DestNode, OriginFrame, "SCALE.X").doubleValue();
		var DestPegScaleY = node.getAttr(DestNode, OriginFrame, "SCALE.Y").doubleValue();
		var DestPegRotationZ = node.getAttr(DestNode, OriginFrame, "rotation.anglez").doubleValue();
		var DestPegSkew = node.getAttr(DestNode, OriginFrame, "SKEW").doubleValue();
		var DestinationIsSeparate = node.getAttr(DestNode, OriginFrame, positionAttributeName + ".SEPARATE").boolValue();
		if (OriginFrame === 1) {
			setDestinationPegInfo();
		} else {
			// prend les valeurs de la clé de la première Kf Tl Origine
			var OrigPegPositionFirstKf = node.getAttr(OriginNode, OriginFirstKf, positionAttributeName).pos3dValue();
			var OrigPegScaleXFirstKf = node.getAttr(OriginNode, OriginFirstKf, "SCALE.X").doubleValue();
			var OrigPegScaleYFirstKf = node.getAttr(OriginNode, OriginFirstKf, "SCALE.Y").doubleValue();
			var OrigPegRotationZFirstKf = node.getAttr(OriginNode, OriginFirstKf, "rotation.anglez").doubleValue();
			var OrigPegSkewFirstKf = node.getAttr(OriginNode, OriginFirstKf, "SKEW").doubleValue();
			// on ENLEVE les valeurs de cette First KF (peg de position de personnage par exemple) parce que du coup la valeur de ce peg va s'appliquer sur toute la timeline.
			DestPegPosition.x -= OrigPegPositionFirstKf.x;
			DestPegPosition.y -= OrigPegPositionFirstKf.y;
			DestPegPosition.z -= OrigPegPositionFirstKf.z;
			OrigPegScaleX /= OrigPegScaleXFirstKf;
			OrigPegScaleY /= OrigPegScaleYFirstKf;
			OrigPegRotationZ -= OrigPegRotationZFirstKf;
			OrigPegSkew -= OrigPegSkewFirstKf;
			setDestinationPegInfo();
			if (this.ui.deleteKfCheckBox.checked) { /// pas certain de la syntaxe
				selection.clearSelection();
				selection.addNodeToSelection(OriginNode);
				frame.setCurrent(OriginFrame);
				Action.perform("onActionClearKeyFrames()", "timelineView");
				selection.clearSelection();
				selection.addNodeToSelection(DestNode);
				frame.setCurrent(destFrame);
			}
		}

		function setDestinationPegInfo() { /// On écrit les valeurs récoltées sur la clé de destination --> comment nester dans un objet ????
			DestPegPosition.x += OrigPegPosition.x; // on additione les postions destination + origine
			DestPegPosition.y += OrigPegPosition.y;
			DestPegPosition.z += OrigPegPosition.z;
			if (!DestinationIsSeparate) { // écriture si position en 3DPATH
				positionAttributeName += ".3DPATH";
			}
			node.setTextAttr(DestNode, positionAttributeName + ".X", frame.current();, DestPegPosition.x);
			node.setTextAttr(DestNode, positionAttributeName + ".Y", frame.current();, DestPegPosition.y);
			node.setTextAttr(DestNode, positionAttributeName + ".Z", frame.current();, DestPegPosition.z);
			node.setTextAttr(DestNode, "SCALE.X", frame.current();, OrigPegScaleX * DestPegScaleX); // on aditionne les scales
			node.setTextAttr(DestNode, "SCALE.Y", frame.current();, OrigPegScaleY * DestPegScaleY);
			node.setTextAttr(DestNode, "rotation.anglez", frame.current();, DestPegRotationZ + OrigPegRotationZ); // on additionne les rotations
			node.setTextAttr(DestNode, "SKEW", frame.current();, DestPegSkew + OrigPegSkew);
		}
	}
	this.ui = UiLoader.load(uiPath);
	this.ui.copyButton.released.connect(this, this.CopyPegInfo);
	this.ui.pasteButton.released.connect(this, this.PastePegInfo);
	scene.endUndoRedoAccum();
}

function CopyPasteKeyframesInfo() {
	// based William Saito's script 'Selection Sets 2.0 + CF_CopyPastePivots v.1.0.1 by www.cartoonflow.com
	if (specialFolders.userConfig.indexOf("USA_DB") != -1) {
		localPath = fileMapper.toNativePath(specialFolders.userConfig);
		var idxOf = localPath.indexOf("users");
		localPath_ui = localPath.slice(0, idxOf) + "scripts";
	} else {
		localPath = specialFolders.userConfig;
		var idxOf_full = localPath.indexOf("full-");
		var version = localPath.slice(idxOf_full + 5, -5);
		localPath_ui = localPath.replace("/full-" + version + "-pref", "/" + version + "-scripts");
	}
	localResourcePath_ui = localPath_ui;
	var uiFile = 'ST_CopyPasteKeyframesInfo.ui';
	var uiPath = localResourcePath_ui + "/" + uiFile;
	var uif = new File(uiPath);
	if (!uif.exists) {
		MessageBox.information('"' + uiFile + '"' + ' file not found.' + '\n' + '\n' + 'Please paste the file into the following directory:' + '\n' + '\n' + localResourcePath_ui + '/');
		return;
	}
	var f = new execDialog(uiPath);
	f.ui.show();
}