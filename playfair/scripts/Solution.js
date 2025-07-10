/*====================================================================*\

Class: Playfair solution

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


// CLASS: PLAYFAIR SOLUTION LIST


////////////////////////////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////////////////////////////

SolutionList.MAX_NUM_SOLUTIONS_STR	= "Maximum number of solutions : ";
SolutionList.NUM_SOLUTIONS_STR		= "Number of solutions found : ";

////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function SolutionList(characterMap, maxNumSolutions)
{
	this.characterMap = characterMap;
	this.maxNumSolutions = maxNumSolutions ? maxNumSolutions : Problem.MAX_NUM_SOLUTIONS;
	this.solutions = [];
};

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

SolutionList.prototype.isDone = function()
{
	return (this.solutions.length >= this.maxNumSolutions);
};

//----------------------------------------------------------------------

SolutionList.prototype.solutionFound = function(indices)
{
	var solution = new Solution(indices);
	var index = 0;
	while (index < this.solutions.length)
	{
		if (solution.compareTo(this.solutions[index]) < 0)
			break;
		++index;
	}
	this.solutions.splice(index, 0, solution);
};

//----------------------------------------------------------------------

SolutionList.prototype.toString = function()
{
	var str = "";
	str += SolutionList.MAX_NUM_SOLUTIONS_STR;
	str += this.maxNumSolutions;
	str += "\n";
	str += SolutionList.NUM_SOLUTIONS_STR;
	str += this.solutions.length;
	str += "\n";

	for (var i = 0; i < this.solutions.length; i++)
	{
		str += "\n";
		str += this.solutions[i].toString(this.characterMap);
	}

	return str;
};

//----------------------------------------------------------------------

//======================================================================


// CLASS: PLAYFAIR SOLUTION


////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function Solution(indices)
{
	this.indices = [].concat(indices);
	this.minLength = Solution.getMinLength(indices);
};

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Class methods
////////////////////////////////////////////////////////////////////////

Solution.getMinLength = function(indices)
{
	var index = indices.length - 1;
	var i = indices.length - 1;
	while (i > 0)
	{
		var si = indices[i];
		if (si > index)
			break;
		if (si >= 0)
			index = si;
		--i;
		if (--index < 0)
			break;
	}
	return (i + 1);
};

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

Solution.prototype.toString = function(characterMap)
{
	var str = "";
	for (var i = 0; i < this.indices.length; i++)
	{
		var index = this.indices[i];
		str += (index < 0) ? "." : characterMap.getOutChar(index);
	}
	str += "  (" + this.minLength + ")";
	return str;
};

//----------------------------------------------------------------------

Solution.prototype.compareTo = function(solution)
{
	return (this.minLength - solution.minLength);
};

//----------------------------------------------------------------------
