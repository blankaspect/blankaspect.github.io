/*====================================================================*\

Class: utility methods

------------------------------------------------------------------------

This file is part of a JavaScript application relating to Playfair
ciphers.
Copyright 2013 Andy Morgan-Richards.

This script is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation, either version 3 of the License, or (at your
option) any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public License for more details: <http://www.gnu.org/licenses/>

\*====================================================================*/

// ECMAScript 5 strict mode

"use strict";

//----------------------------------------------------------------------


// CLASS: UTILITY METHODS


////////////////////////////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////////////////////////////

Utils.SUBSTITUTION_PLACEHOLDER_PREFIX	= "%";
Utils.MIN_SUBSTITUTION_INDEX			= 1;

////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function Utils()
{
	throw new Error("Cannot instantiate");
}

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Class methods
////////////////////////////////////////////////////////////////////////

Utils.substitute = function(str, substitutionStrs)
{
	var outStr = "";
	var index = 0;
	while (index < str.length)
	{
		var startIndex = index;
		index = str.indexOf(Utils.SUBSTITUTION_PLACEHOLDER_PREFIX, index);
		if (index < 0)
			index = str.length;
		if (index > startIndex)
			outStr += str.substring(startIndex, index);
		++index;

		if ((index < str.length) && (str.charAt(index) == Utils.SUBSTITUTION_PLACEHOLDER_PREFIX))
		{
			outStr += Utils.SUBSTITUTION_PLACEHOLDER_PREFIX;
			++index;
		}
		else
		{
			startIndex = index;
			while (index < str.length)
			{
				var ch = str.charAt(index);
				if ((ch < "0") || (ch > "9"))
					break;
				++index;
			}
			if (index > startIndex)
			{
				var substIndex = parseInt(str.substring(startIndex, index)) - Utils.MIN_SUBSTITUTION_INDEX;
				if ((substIndex >= 0) && (substIndex < substitutionStrs.length))
				{
					var substStr = substitutionStrs[substIndex];
					if (substStr)
						outStr += substStr;
				}
			}
		}
	}
	return outStr;
};

//----------------------------------------------------------------------
