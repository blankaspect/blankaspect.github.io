/*====================================================================*\

Class: character map

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


// CLASS: CHARACTER MAP ENTRY


////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function CharacterMapEntry(outChar, inChars)
{
	this.outChar = outChar;
	this.inChars = inChars;
}

//----------------------------------------------------------------------

//======================================================================


// CLASS: CHARACTER MAP


////////////////////////////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////////////////////////////

CharacterMap.IN_CHARS			= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
CharacterMap.DEFAULT_OUT_CHARS	= "ABCDEFGHIIKLMNOPQRSTUVWXYZ";
//CharacterMap.IN_CHARS			= "ABCDEFGHIJKLMNOPRSTUVWXYZ";
//CharacterMap.DEFAULT_OUT_CHARS	= "ABCDEFGHIJKLMNOPRSTUVWXYZ";

////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function CharacterMap(outChars)
{
	outChars = outChars ? outChars.toUpperCase() : CharacterMap.DEFAULT_OUT_CHARS;
	if (outChars.length != CharacterMap.IN_CHARS.length)
		throw new Error("Length of outChars argument must be " + CharacterMap.IN_CHARS.length  + ".");

	this.entries = [];
	for (var i = 0; i < CharacterMap.IN_CHARS.length; i++)
	{
		var inChar = CharacterMap.IN_CHARS[i];
		var outChar = outChars.charAt(i);
		var entry = null;
		for (var j = this.entries.length - 1; j >= 0; j--)
		{
			if (this.entries[j].outChar == outChar)
			{
				entry = this.entries[j];
				break;
			}
		}
		if (entry)
			entry.inChars += inChar;
		else
		{
			entry = new CharacterMapEntry(outChar, inChar);
			this.entries.push(entry);
		}
	}
}

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

CharacterMap.prototype.getOutChar = function(index)
{
	return this.entries[index].outChar;
};

//----------------------------------------------------------------------

CharacterMap.prototype.getInIndex = function(ch)
{
	for (var i = 0; i < this.entries.length; i++)
	{
		if (this.entries[i].inChars.indexOf(ch) >= 0)
			return i;
	}
	return -1;
};

//----------------------------------------------------------------------

CharacterMap.prototype.getOutIndex = function(ch)
{
	for (var i = 0; i < this.entries.length; i++)
	{
		if (this.entries[i].outChar == ch)
			return i;
	}
	return -1;
};

//----------------------------------------------------------------------
