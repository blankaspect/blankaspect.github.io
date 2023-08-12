/*====================================================================*\

Class: Playfair view

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


// CLASS: PLAYFAIR VIEW EXCEPTION


////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function ViewException(message)
{
	this.message = message;
}

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

ViewException.prototype.toString = function()
{
	return this.message;
};

//----------------------------------------------------------------------

//======================================================================


// CLASS: PLAYFAIR VIEW


////////////////////////////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////////////////////////////

View.NONE_STR	= "None";

View.ElementName	=
{
	DIV    : "div",
	OPTION : "option"
};

View.AttrName	=
{
	DISABLED : "disabled",
	VALUE    : "value"
};

View.Id =
{
	CIPHERTEXT_FIELD        : "ciphertextField",
	CODE_SQUARE             : "codeSquare",
	DECRYPT_BUTTON          : "decryptButton",
	ENCRYPT_BUTTON          : "encryptButton",
	KEYWORD_FIELD           : "keywordField",
	MAPPINGS_TEXT_AREA      : "mappingsTextArea",
	MAX_NUM_SOLUTIONS_FIELD : "maxNumSolutionsField",
	PADDING_CHAR_LIST       : "paddingCharList",
	PLAINTEXT_FIELD         : "plaintextField",
	SET_KEY_BUTTON          : "setKeyButton",
	SOLUTIONS_TEXT_AREA     : "solutionsTextArea",
	SOLVE_BUTTON            : "solveButton"
};

View.EventName	=
{
	KEYPRESS : "keypress"
};

////////////////////////////////////////////////////////////////////////
//  Error messages
////////////////////////////////////////////////////////////////////////

View.ErrorMsg	=
{
	INVALID_MAX_NUM_SOLUTIONS :
	"The maximum number of solutions is invalid.",

	MAX_NUM_SOLUTIONS_OUT_OF_BOUNDS :
	"The maximum number of solutions must be between 1 and " + Problem.MAX_NUM_SOLUTIONS + "."
};

////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function View()
{
	// Set instance of view
	View.instance = this;

	// Initialise instance variables
	this.characterMap = new CharacterMap();
	this.square = new PlayfairSquare(this.characterMap);

	// Drop-down list: padding characters
	var paddingCharList = document.getElementById(View.Id.PADDING_CHAR_LIST);
	while (paddingCharList.hasChildNodes())
		paddingCharList.removeChild(paddingCharList.firstChild);
	var optionElement = document.createElement(View.ElementName.OPTION);
	optionElement.appendChild(document.createTextNode(View.NONE_STR));
	paddingCharList.appendChild(optionElement);
	for (var i = 0; i < CharacterMap.IN_CHARS.length; i++)
	{
		optionElement = document.createElement(View.ElementName.OPTION);
		optionElement.appendChild(document.createTextNode(CharacterMap.IN_CHARS.charAt(i)));
		paddingCharList.appendChild(optionElement);
	}
	paddingCharList.selectedIndex = 0;

	// Field: keyword
	var keywordField = document.getElementById(View.Id.KEYWORD_FIELD);
	keywordField.value = "";
	keywordField.oninput = function() { View.updateSetKey(); };
	keywordField.onkeydown = function(event) { if (event.keyCode == 13) View.instance.onSetKey(); };
	keywordField.addEventListener(View.EventName.KEYPRESS, View.inputCharFilter, false);

	// Button: set key
	var setKeyButton = document.getElementById(View.Id.SET_KEY_BUTTON);
	setKeyButton.onclick = function() { View.instance.onSetKey(); };

	// Field: plaintext
	var plaintextField = document.getElementById(View.Id.PLAINTEXT_FIELD);
	plaintextField.value = "";
	plaintextField.onkeydown = function(event) { if (event.keyCode == 13) View.instance.onEncrypt(); };
	plaintextField.addEventListener(View.EventName.KEYPRESS, View.inputCharFilter, false);

	// Button: encrypt
	var encryptButton = document.getElementById(View.Id.ENCRYPT_BUTTON);
	encryptButton.onclick = function() { View.instance.onEncrypt(); };

	// Field: ciphertext
	var ciphertextField = document.getElementById(View.Id.CIPHERTEXT_FIELD);
	ciphertextField.value = "";
	ciphertextField.onkeydown = function(event) { if (event.keyCode == 13) View.instance.onDecrypt(); };
	ciphertextField.addEventListener(View.EventName.KEYPRESS, View.inputCharFilter, false);

	// Button: decrypt
	var decryptButton = document.getElementById(View.Id.DECRYPT_BUTTON);
	decryptButton.onclick = function() { View.instance.onDecrypt(); };

	// Text area: mappings
	var mappingsTextArea = document.getElementById(View.Id.MAPPINGS_TEXT_AREA);
	mappingsTextArea.value = "";

	// Text area: solutions
	var solutionsTextArea = document.getElementById(View.Id.SOLUTIONS_TEXT_AREA);
	solutionsTextArea.value = "";

	// Field: maximum number of solutions
	var maxNumSolutionsField = document.getElementById(View.Id.MAX_NUM_SOLUTIONS_FIELD);
	maxNumSolutionsField.value = String(Problem.MAX_NUM_SOLUTIONS);
	maxNumSolutionsField.addEventListener(View.EventName.KEYPRESS, View.inputCharFilter, false);

	// Button: solve
	var solveButton = document.getElementById(View.Id.SOLVE_BUTTON);
	View.setEnabled(solveButton, true);
	solveButton.onclick = function() { View.instance.onSolve(); };

	// Update controls
	this.updateControls();
	View.updateSetKey();
};

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Class variables
////////////////////////////////////////////////////////////////////////

View.instance   = null;

////////////////////////////////////////////////////////////////////////
//  Class methods
////////////////////////////////////////////////////////////////////////

View.setEnabled = function(element, enabled)
{
	if (enabled)
		element.removeAttribute(View.AttrName.DISABLED);
	else
		element.setAttribute(View.AttrName.DISABLED, View.AttrName.DISABLED);
};

//----------------------------------------------------------------------

View.updateSetKey = function()
{
	View.setEnabled(document.getElementById(View.Id.SET_KEY_BUTTON),
					document.getElementById(View.Id.KEYWORD_FIELD).value);
};

//----------------------------------------------------------------------

View.inputCharFilter = function(event)
{
	var code = event.charCode;
	if (code && !event.altKey && !event.ctrlKey)
	{
		var ch = String.fromCharCode(code);
		var valid = (event.target.id == View.Id.MAX_NUM_SOLUTIONS_FIELD)
												? (ch >= "0") && (ch <= "9")
												: (CharacterMap.IN_CHARS.indexOf(ch.toUpperCase()) >= 0);
		if (!valid)
		{
			if (event.preventDefault)
				event.preventDefault();
			return false;
		}
	}
	return true;
};

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

View.prototype.setKey = function(key)
{
	this.square.setKey(key);
	this.updateControls();
};

//----------------------------------------------------------------------

View.prototype.updateSquarePanel = function()
{
	// Remove rows and cells
	var table = document.getElementById(View.Id.CODE_SQUARE);
	while (table.hasChildNodes())
		table.removeChild(table.firstChild);

	// Add new rows and cells
	var key = this.square.getKey();
	var index = 0;
	for (var i = 0; i < PlayfairSquare.NUM_ROWS; i++)
	{
		var row = document.createElement(View.ElementName.DIV);
		table.appendChild(row);
		for (var j = 0; j < PlayfairSquare.NUM_COLUMNS; j++)
		{
			var cell = document.createElement(View.ElementName.DIV);
			row.appendChild(cell);
			cell.appendChild(document.createTextNode(key ? key[index] : "-"));
			++index;
		}
	}
};

//----------------------------------------------------------------------

View.prototype.updateControls = function()
{
	this.updateSquarePanel();

	var isCipher = this.square.isValid();

	var plaintextField = document.getElementById(View.Id.PLAINTEXT_FIELD);
	View.setEnabled(plaintextField, isCipher);

	var encryptButton = document.getElementById(View.Id.ENCRYPT_BUTTON);
	View.setEnabled(encryptButton, isCipher);

	var ciphertextField = document.getElementById(View.Id.CIPHERTEXT_FIELD);
	View.setEnabled(ciphertextField, isCipher);
	if (!isCipher)
		ciphertextField.value = "";

	var decryptButton = document.getElementById(View.Id.DECRYPT_BUTTON);
	View.setEnabled(decryptButton, isCipher);
};

//----------------------------------------------------------------------

View.prototype.onSetKey = function()
{
	try
	{
		var keyField = document.getElementById(View.Id.KEYWORD_FIELD);
		var str = keyField.value.toUpperCase();
		if (str)
		{
			keyField.value = str;
			this.square.setKey(str);
			this.updateControls();
		}
	}
	catch (e)
	{
		alert((e instanceof Error) ? e.name + ": " + e.message : e.toString());
	}
};

//----------------------------------------------------------------------

View.prototype.onEncrypt = function()
{
	try
	{
		// Get plaintext from field
		var plaintextField = document.getElementById(View.Id.PLAINTEXT_FIELD);
		var str = plaintextField.value.toUpperCase();
		plaintextField.value = str;

		// Add padding if necessary
		if (str.length % 2 != 0)
		{
			var index = document.getElementById(View.Id.PADDING_CHAR_LIST).selectedIndex;
			if (index > 0)
				str += CharacterMap.IN_CHARS.charAt(index - 1);
		}

		// Encrypt plaintext and set ciphertext in its field
		document.getElementById(View.Id.CIPHERTEXT_FIELD).value = this.square.encrypt(str);
	}
	catch (e)
	{
		alert((e instanceof Error) ? e.name + ": " + e.message : e.toString());
	}
};

//----------------------------------------------------------------------

View.prototype.onDecrypt = function()
{
	try
	{
		// Get ciphertext from field
		var ciphertextField = document.getElementById(View.Id.CIPHERTEXT_FIELD);
		var str = ciphertextField.value.toUpperCase();
		ciphertextField.value = str;

		// Decrypt ciphertext and set plaintext in its field
		document.getElementById(View.Id.PLAINTEXT_FIELD).value = this.square.decrypt(str);
	}
	catch (e)
	{
		alert((e instanceof Error) ? e.name + ": " + e.message : e.toString());
	}
};

//----------------------------------------------------------------------

View.prototype.onSolve = function()
{
	var solutionsTextArea = document.getElementById(View.Id.SOLUTIONS_TEXT_AREA);
	var solutionsStr = null;
	try
	{
		// Parse maximum number of solutions
		var maxNumSolutionsField = document.getElementById(View.Id.MAX_NUM_SOLUTIONS_FIELD);
		if (!maxNumSolutionsField.value)
			maxNumSolutionsField.value = Problem.MAX_NUM_SOLUTIONS;
		var maxNumSolutions = 0;
		try
		{
			maxNumSolutions = parseInt(maxNumSolutionsField.value);
		}
		catch (e)
		{
			throw new ViewException(View.ErrorMsg.INVALID_MAX_NUM_SOLUTIONS);
		}
		if ((maxNumSolutions < 1) || (maxNumSolutions > Problem.MAX_NUM_SOLUTIONS))
			throw new ViewException(View.ErrorMsg.MAX_NUM_SOLUTIONS_OUT_OF_BOUNDS);

		// Create problem object and set its map
		solutionsStr = "";
		var problem = new Problem(this.characterMap);
		problem.setMap(document.getElementById(View.Id.MAPPINGS_TEXT_AREA).value);

		// Solve problem
		solutionsTextArea.value = "";
		var solutionList = new SolutionList(this.characterMap, maxNumSolutions);
		problem.solve(solutionList);

		// Get list of solutions as string
		solutionsStr = solutionList.toString();
	}
	catch (e)
	{
		alert((e instanceof Error) ? e.name + ": " + e.message : e.toString());
	}

	// Set solutions in text area
	if (solutionsStr !== null)
		solutionsTextArea.value = solutionsStr;
};

//----------------------------------------------------------------------
