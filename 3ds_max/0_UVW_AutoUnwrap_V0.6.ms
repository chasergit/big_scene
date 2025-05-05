/*
========================
UV AutoUnwrap Tool V0.6
by Chris Jennings
www.chrisjennings.co.uk
========================
This script will apply a UVW unwrap modifier to (almost*) all suitable geometry, assign it to
a specified map channel, and flatten it (using a specified spacing value). Features still to be
added are:

	-- Auto detect UV channel (eg. Unwrapping on channel 2 for textured, UV'ed objects, and 
	   channel 1 when no UVs are present)
	  
	-- UV packing. This has been added but still has some issues to be figured out.

	-- Instance detection. If a lot of instances are selected, it will try and add a UVW 
	   Unwrap to each of them individually. I'll eventually stop this from happening, if I can 
	   figure out how...
	
	-- Allow a custom polygon angle when flattening. In theory, this should be really easy, but
	   whenever I attach this variable to a spinner, it gives me the very helpful error:
	   "-- Unknown system exception"... *shrugs*


* I say almost, because it still applies UVs to VRay Proxies, bone systems, and a couple of other
things that you probably don't want to unwrap. Until I fix this in the code, the best solution
would be to just not select this stuff. :)

All code here provided as is. If this breaks your file, don't blame me! SAVE FIRST!
*/


-- ====
--  UI
-- ====

rollout UVTool "UV AutoUnwrap V0.5"
(
	spinner mapChannelNo "Map Channel: " range:[0,100,1] type:#integer
--	spinner customFlattenAngle "Angle: " type:#float range:[0,1000,45.0] scale:5.0 
	spinner spacing "Spacing: " type:#float range:[0,100,0.04] scale:0.001
--	checkbox packed "Pack" checked:true
	button unwrap "Unwrap"	


	-- ==============
	-- MAIN SCRIPT
	-- ==============
	
	on unwrap pressed do
	(
		-- creates an array from suitable geometry in selection
		local geoToUV = (for o in selection where (isKindOf o GeometryClass and canConvertTo o Editable_Mesh) collect o)
		
		-- checks to see if anything will be unwrapped, and generates error popup if not
		if geoToUV.count == 0 then messagebox "No suitable geometry selected!"
		else
		(
			clearSelection()	-- clears selection once original selection has been saved as geoToUV array

			for i in 1 to geoToUV.count do	-- loops through array of suitable geometry
			(
				select geoToUV[i]	-- selects "i"th piece of geometry
					
				-- main UVW block
				modPanel.addModToSelection (Unwrap_UVW ()) ui:on
				geoToUV[i].modifiers[#Unwrap_UVW].unwrap.setMapChannel mapChannelNo.value
				geoToUV[i].modifiers[#Unwrap_UVW].unwrap.move ()
				geoToUV[i].modifiers[#Unwrap_UVW].texMapList.count = 0
				geoToUV[i].modifiers[#Unwrap_UVW].texMapIDList.count = 0
				geoToUV[i].modifiers[#Unwrap_UVW].baseMaterial_list.count = 1
				geoToUV[i].modifiers[#Unwrap_UVW].baseMaterial_list[1] = undefined
				geoToUV[i].modifiers[#Unwrap_UVW].texMapList.count = 0
				geoToUV[i].modifiers[#Unwrap_UVW].texMapIDList.count = 0
				geoToUV[i].modifiers[#Unwrap_UVW].texMapList.count = 1
				geoToUV[i].modifiers[#Unwrap_UVW].texMapIDList.count = 1
				geoToUV[i].modifiers[#Unwrap_UVW].texMapList[1] = Checker ()
				geoToUV[i].modifiers[#Unwrap_UVW].texMapIDList[1] = -1
				subobjectLevel = 3
				actionMan.executeAction 0 "40021"
				max select all
-- 161124  true 0 true false. Here false maybe is fill holes 
				geoToUV[i].modifiers[#Unwrap_UVW].flattenMap 45.0 #([1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1]) (spacing.value/4) true 0 true false
				subobjectLevel = 0
				
				
				-- packed section - still issues with packing code. Also, no longer works within UI
				--	if packed == true do
				--		(
				-- 		selection[i].modifiers[#unwrap_uvw].unwrap.move ()
				-- 		subobjectLevel = 3
				-- 		max select all
				-- 		selection[i].modifiers[#unwrap_uvw].pack 1 0.007 true true true
				-- 		subobjectLevel = 0
				--		modPanel.addModToSelection (TurboSmooth ()) ui:on	-- Tests to see if this block works
				--		)
				
				
				clearSelection()
			)
			select geoToUV#() -- selects geometry which has been modified
		)

	)
)
	
createDialog UVTool width:200
