/*====================================================================*\

Helical-ramp initialisation functions

\*====================================================================*/

// ECMAScript 5 strict mode

"use strict";

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////////////////////////////

const	HELICAL_RAMP_H_PADDING	= "0.5em";

const	DARK_THEME_MEDIA	= "(prefers-color-scheme: dark)"

////////////////////////////////////////////////////////////////////////
//  Functions
////////////////////////////////////////////////////////////////////////

function initHelicalRamps(ids)
{
	// Clear previous instances of helical ramp
	HelicalRamp.clearInstances();

	// Get random kind and direction of helical ramps
	var kind = (Utils.nextRandomInt(3) == 0) ? HelicalRamp.Kind.BIDIRECTIONAL : HelicalRamp.Kind.UNIDIRECTIONAL;
	var direction = (Utils.nextRandomInt(2) == 0) ? HelicalRamp.Direction.UP : HelicalRamp.Direction.DOWN;
	var theme = (window.matchMedia && window.matchMedia(DARK_THEME_MEDIA).matches)
					? HelicalRamp.Theme.DARK
					: HelicalRamp.Theme.LIGHT;

	// Create canvas for each helical ramp and add it to parent
	var canvasHeight = 0;
	for (var i = 0; i < ids.length; i++)
	{
		// Get parent of helical ramp
		var parent = document.getElementById(ids[i]);

		// If parent was found, create canvas for helical ramp
		if (parent)
		{
			// Set height of canvas to height of parent
			if (parent.clientHeight && !canvasHeight)
				canvasHeight = parent.clientHeight;

			// If height of canvas is known, create canvas for helical ramp
			if (canvasHeight)
			{
				// Ensure that height of helical ramp does not exceed height of project list
				var projectList = document.getElementById("projectList");
				if (projectList)
				{
					if (canvasHeight > projectList.scrollHeight)
						canvasHeight = projectList.scrollHeight;
				}

				// Create canvas for helical ramp
				var canvas = document.createElement("canvas");
				if (canvas && canvas.getContext)
				{
					// Set dimensions of canvas
					canvas.setAttribute("width", HelicalRamp.ICON_WIDTH);
					canvas.setAttribute("height", canvasHeight);

					// Set horizontal padding of canvas
					if (i == 0)
						canvas.style.paddingRight = HELICAL_RAMP_H_PADDING;
					else
						canvas.style.paddingLeft = HELICAL_RAMP_H_PADDING;

					// Remove any children from parent
					while (parent.hasChildNodes())
						parent.removeChild(parent.firstChild);

					// Add canvas to parent
					parent.appendChild(canvas);

					// Create helical ramp on canvas
					try
					{
						HelicalRamp.addInstance(canvas, kind, direction, theme);
						direction = HelicalRamp.reverseDirection(direction);
					}
					catch (e)
					{
						window.alert(e);
					}
				}
			}
		}
	}
}

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Event handlers
////////////////////////////////////////////////////////////////////////

window.onload = () =>
{
	// IDs of helical ramps
	const ids = ["helicalRamp1", "helicalRamp2"];

	// Update height of helical ramps when size of main element changes
	const resizeObserver = new ResizeObserver(() => initHelicalRamps(ids));
	resizeObserver.observe(document.getElementById("main"));

	// Restart helical ramps when theme changes
	window.matchMedia(DARK_THEME_MEDIA).addEventListener("change", () => initHelicalRamps(ids));

	// Initialise helical ramps
	initHelicalRamps(ids);
};

//----------------------------------------------------------------------
