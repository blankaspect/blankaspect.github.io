/*====================================================================*\

Class: Playfair square

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


// CLASS: PLAYFAIR SQUARE EXCEPTION


////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function PlayfairSquareException(message, substitutionStrs)
{
	this.message = message;
	this.substitutionStrs = [];
	for (var i = 1; i < arguments.length; i++)
		this.substitutionStrs.push(arguments[i]);
}

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

PlayfairSquareException.prototype.toString = function()
{
	return Utils.substitute(this.message, this.substitutionStrs);
};

//----------------------------------------------------------------------

//======================================================================


// CLASS: PLAYFAIR SQUARE


////////////////////////////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////////////////////////////

PlayfairSquare.NUM_COLUMNS		= 5;
PlayfairSquare.NUM_ROWS			= 5;
PlayfairSquare.NUM_CODE_CHARS	= PlayfairSquare.NUM_COLUMNS * PlayfairSquare.NUM_ROWS;

PlayfairSquare.KEY_STR			= "key";
PlayfairSquare.PLAINTEXT_STR	= "plaintext";
PlayfairSquare.CIPHERTEXT_STR	= "ciphertext";

////////////////////////////////////////////////////////////////////////
//  Error messages
////////////////////////////////////////////////////////////////////////

PlayfairSquare.ErrorId =
{
	NO_KEY :
	"No key has been set.",

	LENGTH_IS_ODD :
	"The length of the %1 must be even.",

	INVALID_CHARACTER :
	"The %1 contains an invalid character: \"%2\".",

	IDENTICAL_PAIR :
	"The %1 contains a pair of identical letters, \"%2%2\"."
};

////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function PlayfairSquare(characterMap)
{
	this.characterMap = characterMap;
	this.key = new Array(PlayfairSquare.NUM_CODE_CHARS);
	this.inverseKey = new Array(PlayfairSquare.NUM_CODE_CHARS);
	this.valid = false;
};

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Class methods
////////////////////////////////////////////////////////////////////////

PlayfairSquare.getEncryptionIndices = function(index1, index2, outIndices)
{
	// Get row and column indices of input characters
	var in1Row = Math.floor(index1 / PlayfairSquare.NUM_COLUMNS);
	var in1Col = index1 % PlayfairSquare.NUM_COLUMNS;
	var in2Row = Math.floor(index2 / PlayfairSquare.NUM_COLUMNS);
	var in2Col = index2 % PlayfairSquare.NUM_COLUMNS;

	// Initialise row and column indices of output characters
	var out1Row = 0;
	var out1Col = 0;
	var out2Row = 0;
	var out2Col = 0;

	// Encrypt plaintext pair: characters are from the same row
	if (in1Row == in2Row)
	{
		out1Row = in1Row;
		out1Col = in1Col + 1;
		if (out1Col >= PlayfairSquare.NUM_COLUMNS)
			out1Col -= PlayfairSquare.NUM_COLUMNS;
		out2Row = in1Row;
		out2Col = in2Col + 1;
		if (out2Col >= PlayfairSquare.NUM_COLUMNS)
			out2Col -= PlayfairSquare.NUM_COLUMNS;
	}

	// Encrypt plaintext pair: characters are from the same row
	else if (in1Col == in2Col)
	{
		out1Row = in1Row + 1;
		if (out1Row >= PlayfairSquare.NUM_ROWS)
			out1Row -= PlayfairSquare.NUM_ROWS;
		out1Col = in1Col;
		out2Row = in2Row + 1;
		if (out2Row >= PlayfairSquare.NUM_ROWS)
			out2Row -= PlayfairSquare.NUM_ROWS;
		out2Col = in1Col;
	}

	// Encrypt plaintext pair: characters are from different rows and columns
	else
	{
		out1Row = in1Row;
		out1Col = in2Col;
		out2Row = in2Row;
		out2Col = in1Col;
	}

	// Set indices of output characters
	if (!outIndices)
		outIndices = new Array(2);
	outIndices[0] = out1Row * PlayfairSquare.NUM_COLUMNS + out1Col;
	outIndices[1] = out2Row * PlayfairSquare.NUM_COLUMNS + out2Col;
	return outIndices;
};

//----------------------------------------------------------------------

PlayfairSquare.getDecryptionIndices = function(index1, index2, outIndices)
{
	// Get row and column indices of input characters
	var in1Row = Math.floor(index1 / PlayfairSquare.NUM_COLUMNS);
	var in1Col = index1 % PlayfairSquare.NUM_COLUMNS;
	var in2Row = Math.floor(index2 / PlayfairSquare.NUM_COLUMNS);
	var in2Col = index2 % PlayfairSquare.NUM_COLUMNS;

	// Initialise row and column indices of output characters
	var out1Row = 0;
	var out1Col = 0;
	var out2Row = 0;
	var out2Col = 0;

	// Decrypt ciphertext pair: characters are from the same row
	if (in1Row == in2Row)
	{
		out1Row = in1Row;
		out1Col = in1Col - 1;
		if (out1Col < 0)
			out1Col += PlayfairSquare.NUM_COLUMNS;
		out2Row = in1Row;
		out2Col = in2Col - 1;
		if (out2Col < 0)
			out2Col += PlayfairSquare.NUM_COLUMNS;
	}

	// Decrypt ciphertext pair: characters are from the same column
	else if (in1Col == in2Col)
	{
		out1Row = in1Row - 1;
		if (out1Row < 0)
			out1Row += PlayfairSquare.NUM_ROWS;
		out1Col = in1Col;
		out2Row = in2Row - 1;
		if (out2Row < 0)
			out2Row += PlayfairSquare.NUM_ROWS;
		out2Col = in1Col;
	}

	// Decrypt ciphertext pair: characters are from different rows and columns
	else
	{
		out1Row = in1Row;
		out1Col = in2Col;
		out2Row = in2Row;
		out2Col = in1Col;
	}

	// Set indices of output characters
	if (!outIndices)
		outIndices = new Array(2);
	outIndices[0] = out1Row * PlayfairSquare.NUM_COLUMNS + out1Col;
	outIndices[1] = out2Row * PlayfairSquare.NUM_COLUMNS + out2Col;
	return outIndices;
};

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

PlayfairSquare.prototype.isValid = function()
{
	return this.valid;
};

//----------------------------------------------------------------------

PlayfairSquare.prototype.getKey = function()
{
	// Test for valid key
	if (!this.valid)
		return null;

	// Return key as array of characters
	var keyChars = [];
	for (var i = 0; i < PlayfairSquare.NUM_CODE_CHARS; i++)
		keyChars.push(this.characterMap.getOutChar(this.key[i]));
	return keyChars;
};

//----------------------------------------------------------------------

PlayfairSquare.prototype.setKey = function(keyStr)
{
	// Invalidate key
	this.valid = false;

	// Process key string
	var used = [];
	for (var i = 0; i < PlayfairSquare.NUM_CODE_CHARS; i++)
		used.push(false);

	var j = 0;
	for (var i = 0; i < keyStr.length; i++)
	{
		var ch = keyStr.charAt(i);
		var index = this.characterMap.getInIndex(ch.toUpperCase());
		if (index < 0)
			throw new PlayfairSquareException(PlayfairSquare.ErrorId.INVALID_CHARACTER,
											  PlayfairSquare.KEY_STR, ch);
		if (!used[index])
		{
			this.key[j++] = index;
			used[index] = true;
		}
	}

	// Fill the remaining part of the key with the unused characters
	for (var i = 0; i < PlayfairSquare.NUM_CODE_CHARS; i++)
	{
		if (!used[i])
			this.key[j++] = i;
	}

	// Set inverse key
	for (var i = 0; i < PlayfairSquare.NUM_CODE_CHARS; i++)
		this.inverseKey[this.key[i]] = i;

	// Set flag to indicate that key is valid
	this.valid = true;
};

//----------------------------------------------------------------------

PlayfairSquare.prototype.encrypt = function(str)
{
	// Test for valid key
	if (!this.valid)
		throw new PlayfairSquareException(PlayfairSquare.ErrorId.NO_KEY);

	// Test for odd-length string
	if (str.length % 2 != 0)
		throw new PlayfairSquareException(PlayfairSquare.ErrorId.LENGTH_IS_ODD,
										  PlayfairSquare.PLAINTEXT_STR);

	// Encrypt string
	var ciphertext = "";
	var i = 0;
	while (i < str.length)
	{
		// Validate first character of pair
		var ch1 = str.charAt(i++);
		var index1 = this.characterMap.getInIndex(ch1.toUpperCase());
		if (index1 < 0)
			throw new PlayfairSquareException(PlayfairSquare.ErrorId.INVALID_CHARACTER,
											  PlayfairSquare.PLAINTEXT_STR, ch1);

		// Validate second character of pair
		var ch2 = str.charAt(i++);
		var index2 = this.characterMap.getInIndex(ch2.toUpperCase());
		if (index2 < 0)
			throw new PlayfairSquareException(PlayfairSquare.ErrorId.INVALID_CHARACTER,
											  PlayfairSquare.PLAINTEXT_STR, ch2);

		// Test for identical pair
		if (ch1 == ch2)
			throw new PlayfairSquareException(PlayfairSquare.ErrorId.IDENTICAL_PAIR,
											  PlayfairSquare.PLAINTEXT_STR, ch1);

		// Get indices of ciphertext pair
		var indices = PlayfairSquare.getEncryptionIndices(this.inverseKey[index1], this.inverseKey[index2],
														  null);

		// Append to ciphertext
		ciphertext += this.characterMap.getOutChar(this.key[indices[0]]);
		ciphertext += this.characterMap.getOutChar(this.key[indices[1]]);
	}

	return ciphertext;
};

//----------------------------------------------------------------------

PlayfairSquare.prototype.decrypt = function(str)
{
	// Test for valid key
	if (!this.valid)
		throw new PlayfairSquareException(PlayfairSquare.ErrorId.NO_KEY);

	// Test for odd-length string
	if (str.length % 2 != 0)
		throw new PlayfairSquareException(PlayfairSquare.ErrorId.LENGTH_IS_ODD,
										  PlayfairSquare.CIPHERTEXT_STR);

	// Decrypt string
	var plaintext = "";
	var i = 0;
	while (i < str.length)
	{
		// Validate first character of pair
		var ch1 = str.charAt(i++);
		var index1 = this.characterMap.getOutIndex(ch1.toUpperCase());
		if (index1 < 0)
			throw new PlayfairSquareException(PlayfairSquare.ErrorId.INVALID_CHARACTER,
											  PlayfairSquare.CIPHERTEXT_STR, ch1);

		// Validate second character of pair
		var ch2 = str.charAt(i++);
		var index2 = this.characterMap.getOutIndex(ch2.toUpperCase());
		if (index2 < 0)
			throw new PlayfairSquareException(PlayfairSquare.ErrorId.INVALID_CHARACTER,
											  PlayfairSquare.CIPHERTEXT_STR, ch2);

		// Test for identical pair
		if (ch1 == ch2)
			throw new PlayfairSquareException(PlayfairSquare.ErrorId.IDENTICAL_PAIR,
											  PlayfairSquare.CIPHERTEXT_STR, ch1);

		// Get indices of plaintext pair
		var indices = PlayfairSquare.getDecryptionIndices(this.inverseKey[index1], this.inverseKey[index2],
														  null);

		// Append to plaintext
		plaintext += this.characterMap.getOutChar(this.key[indices[0]]);
		plaintext += this.characterMap.getOutChar(this.key[indices[1]]);
	}

	return plaintext;
};

//----------------------------------------------------------------------
