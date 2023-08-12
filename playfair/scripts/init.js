/*====================================================================*\

Playfair initialisation

\*====================================================================*/

// ECMAScript 5 strict mode

"use strict";

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Event handlers
////////////////////////////////////////////////////////////////////////

window.onload = function()
{
	try
	{
		var element = document.getElementById("jsRequired");
		element.parentElement.removeChild(element);

		new View();
	}
	catch (e)
	{
		alert((e instanceof Error) ? e.name + ": " + e.message : e.toString());
	}
};

//----------------------------------------------------------------------
