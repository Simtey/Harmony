### Animation tools for Toon Boom Harmony ###

**ST_CleanDoubleExposures** : parse all the selected drawings and delete the double exposures (timeline length).

**ST_CleanExposuresLight** / **ST_CleanExposure** : clean the drawing exposures to make them match to the pegs (useful at the posing steps in puppet productions).

**ST_DrawingExpoAdd** / **ST_DrawingExpoRemove** : Extend / reduce a drawing substitution exposure from 1 without moving the other ones.

**ST_emptyDrawingPivotInPlace** : Create an empty drawing and keep the drawing pivot in place
- improvement to be done (next version) --> if deformer : reset the deformer.

**ST_FillDrawingExposures** : fill the empty cells between two drawing substitutions (no need to select a range in the timeline).

**goToPreviousPegKeyframe** / **ST_goToNextPegKeyframe** : Go to the previous / next keyframe without the need of selected the peg with "b". Very usefull for the puppet animation (as a shortcut)

**ST_KeyDrawingJumpers** : Goes directly to the previous / next Key drawing or Breakdown (usefull as shortcuts).

**ST_pegJump.js** : Jumps to the peg above (imporved "B")shorctut (usefull as a shortcut)

**ST_PosingsMarkers** : Add a red keyframe marker on every keyframes in the selected timeline layer.

**ST_ResetDeformers** : simplify the way to reset a deformer.
* select just one point of deformers to reset them.

**ST_setStartStop** : sets the playback starts and stops (the same than the buttons in the playback toolbar) --> Usefull to set them as a shortcut

**ST_ToggleFrameMarkers** : Add / delete a frame marker on the selected frame. 
* Change the color by clicking again on it (Red, Blue, Orange, none)
* More efficient when configured as a shortcut.

**ST_TplSave** : Save the selection as a template (timeline length) in the library (creates a folder named TplSave next to the .xstage of the scene)

site : http://www.simonthery.fr 
