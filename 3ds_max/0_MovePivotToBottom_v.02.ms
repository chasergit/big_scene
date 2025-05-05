--- maxscript MovePivotToBottom -- (c)2005 - andrei kletskov (111)

--- this script moves pivot point to the bottom of an object (selection of objects)

--- v0.1 - 28 april 2005 - initial version
--- v0.2 - 25 may 2005 - added try-catch to allow grouped objects processing and probably other bugs


fn lowestZpoint a =
(
	try
	(
		obj = snapshotasmesh a
		min_vz = in coordsys world (getvert obj 1).z
		for v = 1 to getNumVerts obj do
		(
			vv = in coordsys world (getvert obj v).z
			if vv < min_vz then min_vz = vv
		)
		delete obj
		return min_vz
	)
	catch
	(
	)
)

undo on
(	
	for i in selection do
	(
		try
		(
			lp = lowestZpoint i
			x = i.pivot.x
			y = i.pivot.y
			i.pivot = [x, y, lp]
		)
		catch
		(
		)
	)
)