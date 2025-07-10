/*====================================================================*\

Class: Playfair problem

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


// CLASS: CODE-MAP ENTRY


////////////////////////////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////////////////////////////

CodeMapEntry.UNKNOWN_INDEX	= 64;

////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function CodeMapEntry(characterMap, p1, p2, c1, c2)
{
	this.p1 = characterMap.getInIndex(p1);
	this.p2 = characterMap.getInIndex(p2);
	this.c1 = (c1 == Problem.UNKNOWN_CHAR) ? CodeMapEntry.UNKNOWN_INDEX : characterMap.getInIndex(c1);
	this.c2 = (c2 == Problem.UNKNOWN_CHAR) ? CodeMapEntry.UNKNOWN_INDEX : characterMap.getInIndex(c2);
}

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

CodeMapEntry.prototype.isC1Unknown = function()
{
	return (this.c1 == CodeMapEntry.UNKNOWN_INDEX);
};

//----------------------------------------------------------------------

CodeMapEntry.prototype.isC2Unknown = function()
{
	return (this.c2 == CodeMapEntry.UNKNOWN_INDEX);
};

//----------------------------------------------------------------------

CodeMapEntry.prototype.isIncomplete = function()
{
	return (this.c1 == CodeMapEntry.UNKNOWN_INDEX) || (this.c2 == CodeMapEntry.UNKNOWN_INDEX);
};

//----------------------------------------------------------------------

CodeMapEntry.prototype.isPlaintextEqual = function(entry)
{
	return (this.p1 == entry.p1) && (this.p2 == entry.p2);
};

//----------------------------------------------------------------------

CodeMapEntry.prototype.equals = function(obj)
{
	return (obj instanceof CodeMapEntry) && (this.p1 == obj.p1) && (this.p2 == obj.p2)
			&& (this.c1 == obj.c1) && (this.c2 == obj.c2);
};

//----------------------------------------------------------------------

CodeMapEntry.prototype.compareTo = function(entry)
{
	var result = 0;
	var incomplete1 = this.isIncomplete();
	var incomplete2 = entry.isIncomplete();
	if (!incomplete1 && incomplete2)
		result = -1;
	else if (incomplete1 && !incomplete2)
		result = 1;
	else
	{
		result = this.p1 - entry.p1;
		if (result == 0)
			result = this.p2 - entry.p2;
	}
	return result;
};

//----------------------------------------------------------------------

CodeMapEntry.prototype.toString = function(characterMap)
{
	var str = "";
	str += characterMap.getOutChar(this.p1);
	str += characterMap.getOutChar(this.p2);
	str += " -> ";
	str += (this.c1 == CodeMapEntry.UNKNOWN_INDEX) ? Problem.UNKNOWN_CHAR : characterMap.getOutChar(this.c1);
	str += (this.c2 == CodeMapEntry.UNKNOWN_INDEX) ? Problem.UNKNOWN_CHAR : characterMap.getOutChar(this.c2);
	return str;
};

//----------------------------------------------------------------------

CodeMapEntry.prototype.update = function(entry)
{
	// Compare plaintext indices
	if (!this.isPlaintextEqual(entry))
		return false;

	// Update first ciphertext index
	if (this.c1 == CodeMapEntry.UNKNOWN_INDEX)
		this.c1 = entry.c1;
	else if ((entry.c1 != CodeMapEntry.UNKNOWN_INDEX) && (this.c1 != entry.c1))
		return false;

	// Update second ciphertext index
	if (this.c2 == CodeMapEntry.UNKNOWN_INDEX)
		this.c2 = entry.c2;
	else if ((entry.c2 != CodeMapEntry.UNKNOWN_INDEX) && (this.c2 != entry.c2))
		return false;

	return true;
};

//----------------------------------------------------------------------

//======================================================================


// CLASS: PROBLEM EXCEPTION


////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function ProblemException(message, lineIndex, charIndex, substitutionStrs)
{
	this.message = message;
	this.lineIndex = lineIndex;
	this.charIndex = charIndex;
	this.substitutionStrs = [];
	for (var i = 3; i < arguments.length; i++)
		this.substitutionStrs.push(arguments[i]);
}

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

ProblemException.prototype.toString = function()
{
	var str = Utils.substitute(this.message, this.substitutionStrs);
	if (this.lineIndex >= 0)
	{
		var prefix = "Line " + (this.lineIndex + 1);
		if (this.charIndex >= 0)
			prefix += ", index " + this.charIndex;
		str = prefix + ":\n" + str;
	}
	return str;
};

//----------------------------------------------------------------------

//======================================================================


// CLASS: 'SEARCH TERMINATED' EXCEPTION


////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function SearchTerminatedException()
{
	// do nothing
}

//----------------------------------------------------------------------

//======================================================================


// CLASS: PROBLEM


////////////////////////////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////////////////////////////

Problem.MAX_NUM_SOLUTIONS	= 500;

Problem.NUM_CELLS	= PlayfairSquare.NUM_CODE_CHARS;

Problem.COMMENT_PREFIX_CHAR	= "#";
Problem.UNKNOWN_CHAR		= "?";

Problem.PLAINTEXT_STR	= "plaintext";
Problem.CIPHERTEXT_STR	= "ciphertext";

////////////////////////////////////////////////////////////////////////
//  Error messages
////////////////////////////////////////////////////////////////////////

Problem.ErrorMsg	=
{
	NO_COMPLETE_MAPPING :
	"No complete mapping from a plaintext pair to a ciphertext pair was specified.",

	MALFORMED_LINE :
	"The line is malformed.",

	DIFFERENT_LENGTHS :
	"The plaintext and ciphertext are of different lengths.",

	LENGTH_IS_ODD :
	"The length of the plaintext and ciphertext is odd.",

	ILLEGAL_CHARACTER :
	"The %1 contains an illegal character, \"%2\".",

	IDENTICAL_PAIR :
	"The %1 contains a pair of identical letters, \"%2%2\".",

	LETTER_MAPS_TO_ITSELF :
	"The letter \"%1\" maps to itself.",

	INVALID_PAIR_MAPPING :
	"The mapping from \"%1\" to \"%2\" is invalid.",

	INCONSISTENT_CIPHERTEXT :
	"The ciphertext \"%1\" for the plaintext \"%2\" is not consistent\n" +
		"with the ciphertext for the same plaintext in an earlier mapping."
};

////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function Problem(characterMap)
{
	this.characterMap = characterMap;
	this.entries = [];
};

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

Problem.prototype.getMapAsString = function()
{
	var str = "";
	for (var i = 0; i < this.entries.length; i++)
	{
		str += this.entries[i].toString(this.characterMap);
		str += "\n";
	}
	return str;
};

//----------------------------------------------------------------------

Problem.prototype.setMap = function(str)
{
	// Clear entries
	this.entries = [];

	// Split input string into lines
	var lines = str.split(/\n/);

	// Process lines
	for (var lineIndex = 0; lineIndex < lines.length; lineIndex++)
	{
		// Strip comment
		var line = lines[lineIndex];
		var index = line.indexOf(Problem.COMMENT_PREFIX_CHAR);
		if (index >= 0)
			line = line.substring(0, index);

		// Process line
		if (line)
		{
			// Split line into plaintext and ciphertext
			var strs = line.toUpperCase().split(/\s+/);
			var tokens = [];
			for (var i = 0; i < strs.length; i++)
			{
				if (strs[i])
					tokens.push(strs[i]);
			}

			if (tokens)
			{
				if (tokens.length != 2)
					throw new ProblemException(Problem.ErrorMsg.MALFORMED_LINE, lineIndex, -1);
				var plaintext = tokens[0];
				var ciphertext = tokens[1];

				// Test lengths of plaintext and ciphertext
				if (plaintext.length != ciphertext.length)
					throw new ProblemException(Problem.ErrorMsg.DIFFERENT_LENGTHS, lineIndex, -1);
				var length = plaintext.length;
				if (length % 2 != 0)
					throw new ProblemException(Problem.ErrorMsg.LENGTH_IS_ODD, lineIndex, -1);

				// Process pair of characters
				for (var i = 0; i < length; i += 2)
				{
					// Validate pair of plaintext characters
					var p1 = plaintext.charAt(i);
					var p2 = plaintext.charAt(i + 1);
					if ((p1 < "A") || (p1 > "Z"))
					{
						throw new ProblemException(Problem.ErrorMsg.ILLEGAL_CHARACTER, lineIndex, i,
												   Problem.PLAINTEXT_STR, p1);
					}
					if ((p2 < "A") || (p2 > "Z"))
					{
						throw new ProblemException(Problem.ErrorMsg.ILLEGAL_CHARACTER, lineIndex, i + 1,
												   Problem.PLAINTEXT_STR, p2);
					}
					if (p1 == p2)
					{
						throw new ProblemException(Problem.ErrorMsg.IDENTICAL_PAIR, lineIndex, i,
												   Problem.PLAINTEXT_STR, p1);
					}

					// Validate pair of ciphertext characters
					var c1 = ciphertext.charAt(i);
					var c2 = ciphertext.charAt(i + 1);
					if ((c1 != Problem.UNKNOWN_CHAR) && ((c1 < "A") || (c1 > "Z")))
					{
						throw new ProblemException(Problem.ErrorMsg.ILLEGAL_CHARACTER, lineIndex, i,
												   Problem.CIPHERTEXT_STR, c1);
					}
					if ((c2 != Problem.UNKNOWN_CHAR) && ((c2 < "A") || (c2 > "Z")))
					{
						throw new ProblemException(Problem.ErrorMsg.ILLEGAL_CHARACTER, lineIndex, i + 1,
												   Problem.CIPHERTEXT_STR, c2);
					}
					if ((c1 != Problem.UNKNOWN_CHAR) && (c1 == c2))
					{
						throw new ProblemException(Problem.ErrorMsg.IDENTICAL_PAIR, lineIndex, i,
												   Problem.CIPHERTEXT_STR, c1);
					}

					// Validate plaintext against ciphertext
					if (p1 == c1)
						throw new ProblemException(Problem.ErrorMsg.LETTER_MAPS_TO_ITSELF, lineIndex, i, p1);
					if (p2 == c2)
						throw new ProblemException(Problem.ErrorMsg.LETTER_MAPS_TO_ITSELF, lineIndex, i + 1, p2);
					if ((p1 == c2) && (p2 == c1))
					{
						throw new ProblemException(Problem.ErrorMsg.INVALID_PAIR_MAPPING, lineIndex, i, p1 + p2,
												   c1 + c2);
					}

					// Add entry
					if ((c1 != Problem.UNKNOWN_CHAR) || (c2 != Problem.UNKNOWN_CHAR))
					{
						var entry = new CodeMapEntry(this.characterMap, p1, p2, c1, c2);
						for (var j = 0; j < this.entries.length; j++)
						{
							if (this.entries[j].isPlaintextEqual(entry))
							{
								if (!this.entries[j].update(entry))
								{
									throw new ProblemException(Problem.ErrorMsg.INCONSISTENT_CIPHERTEXT, lineIndex, i,
															   c1 + c2, p1 + p2);
								}
								entry = null;
								break;
							}
						}
						if (entry)
							this.entries.push(entry);
					}
				}
			}
		}
	}

	// Test for complete entries
	var numCompleteEntries = 0;
	for (var i = 0; i < this.entries.length; i++)
	{
		if (!this.entries[i].isIncomplete())
			++numCompleteEntries;
	}
	if (numCompleteEntries < 1)
		throw new ProblemException(Problem.ErrorMsg.NO_COMPLETE_MAPPING, -1, -1);

	// Sort entries
	this.entries.sort(function(entry1, entry2) { return entry1.compareTo(entry2); });
};

//----------------------------------------------------------------------

Problem.prototype.solve = function(solutionHandler)
{
	// Initialise array of indices of characters
	var indices = [];
	for (var i = 0; i < Problem.NUM_CELLS; i++)
		indices.push(-1);

	// Initialise array of cells
	var cells = [];
	for (var i = 0; i < Problem.NUM_CELLS; i++)
		cells.push(-1);

	// Search for solution using backtracking
	try
	{
		this.findSolution(0, indices, cells, solutionHandler);
	}
	catch (e)
	{
		// ignore
	}
};

//----------------------------------------------------------------------

Problem.prototype.findSolution = function(entryIndex, indices, cells, solutionHandler)
{
	// Test for the end of the search
	if (solutionHandler.isDone())
		throw new SearchTerminatedException();

	// Get the current code-map entry
	var entry = this.entries[entryIndex];

	// Get the indices of the plaintext characters of the current code-map entry
	var ip1 = indices[entry.p1];
	var ip2 = indices[entry.p2];

	// If the location of the first plaintext character is unresolved, try all its possible locations
	if (ip1 < 0)
	{
		for (ip1 = 0; ip1 < Problem.NUM_CELLS; ip1++)
		{
			if (cells[ip1] < 0)
			{
				// Set the location of the first plaintext character
				indices[entry.p1] = ip1;
				cells[ip1] = entry.p1;

				// Try the second plaintext character of the current code-map entry
				this.findSolution(entryIndex, indices, cells, solutionHandler);

				// Clear the location of the first plaintext character
				indices[entry.p1] = -1;
				cells[ip1] = -1;
			}
		}
	}

	// If the location of the second plaintext character is unresolved, try all its possible locations
	else if (ip2 < 0)
	{
		for (ip2 = 0; ip2 < Problem.NUM_CELLS; ip2++)
		{
			if (cells[ip2] < 0)
			{
				// Set the location of the second plaintext character
				indices[entry.p2] = ip2;
				cells[ip2] = entry.p2;

				// Try ciphertext characters of current code-map entry
				this.findSolution(entryIndex, indices, cells, solutionHandler);

				// Clear the location of the second plaintext character
				indices[entry.p2] = -1;
				cells[ip2] = -1;
			}
		}
	}

	// If the locations of both plaintext characters are resolved, try to resolve the locations of the
	// ciphertext characters
	else
	{
		// Get the expected locations (cell indices) of the ciphertext pair from the cell indices of the
		// plaintext
		var outIndices = PlayfairSquare.getEncryptionIndices(ip1, ip2, null);

		// Try to resolve the location of the first ciphertext character
		var ic1 = outIndices[0];
		var c1 = cells[ic1];
		var c1Unknown = entry.isC1Unknown();
		var oldIc1 = c1Unknown ? -1 : indices[entry.c1];

		// If the first ciphertext character is unknown or its location is unresolved or its location is
		// correct for the plaintext pair ...
		if (c1Unknown || ((c1 < 0) && (oldIc1 < 0)) || ((c1 == entry.c1) && (oldIc1 == ic1)))
		{
			// Set the location of the first ciphertext character
			if (!c1Unknown)
			{
				indices[entry.c1] = ic1;
				cells[ic1] = entry.c1;
			}

			// Try to resolve the location of the second ciphertext character
			var ic2 = outIndices[1];
			var c2 = cells[ic2];
			var c2Unknown = entry.isC2Unknown();
			var oldIc2 = c2Unknown ? -1 : indices[entry.c2];

			// If the second ciphertext character is unknown or its location is unresolved or its location
			// is correct the plaintext pair ...
			if (c2Unknown || ((c2 < 0) && (oldIc2 < 0)) || ((c2 == entry.c2) && (oldIc2 == ic2)))
			{
				// Set the location of the second ciphertext character
				if (!c2Unknown)
				{
					indices[entry.c2] = ic2;
					cells[ic2] = entry.c2;
				}

				// If more code-map entries remain, try them ...
				if (++entryIndex < this.entries.length)
					this.findSolution(entryIndex, indices, cells, solutionHandler);

				// ... otherwise, offer the solution to the handler
				else
					solutionHandler.solutionFound(cells);

				// Restore the location of the second ciphertext character
				if (!c2Unknown)
				{
					indices[entry.c2] = oldIc2;
					cells[ic2] = c2;
				}
			}

			// Restore the location of the first ciphertext character
			if (!c1Unknown)
			{
				indices[entry.c1] = oldIc1;
				cells[ic1] = c1;
			}
		}
	}
};

//----------------------------------------------------------------------
