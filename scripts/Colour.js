/*====================================================================*\

Class: colour

\*====================================================================*/

// ECMAScript 5 strict mode

"use strict";

//----------------------------------------------------------------------


// CLASS: COLOUR


////////////////////////////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////////////////////////////

Colour.HEX_DIGITS   = "0123456789ABCDEF";
Colour.RGB_PREFIX   = "#";

Colour.NUM_RGB_COMPONENTS       = 3;
Colour.NUM_RGB_COMPONENT_DIGITS = 2;
Colour.RGB_STRING_LENGTH        = Colour.NUM_RGB_COMPONENTS * Colour.NUM_RGB_COMPONENT_DIGITS;

////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function Colour(red, green, blue)
{
	this.red = red;
	this.green = green;
	this.blue = blue;
	this.alpha = 255;
}

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Class methods
////////////////////////////////////////////////////////////////////////

Colour.parseColour = function(str)
{
	if ((str.length != Colour.RGB_PREFIX.length + Colour.RGB_STRING_LENGTH) || (str.charAt(0) != Colour.RGB_PREFIX))
		throw new Error("Illegal argument: " + str);

	var rgb = new Array(Colour.NUM_RGB_COMPONENTS);
	var offset = Colour.RGB_PREFIX.length;
	for (var i = 0; i < Colour.NUM_RGB_COMPONENTS; i++)
	{
		var value = 0;
		for (var j = 0; j < Colour.NUM_RGB_COMPONENT_DIGITS; j++)
		{
			var digitValue = Colour.HEX_DIGITS.indexOf(str.charAt(offset++).toUpperCase());
			if (digitValue < 0)
				throw new Error("Illegal argument: " + str);
			value <<= 4;
			value |= digitValue;
		}
		rgb[i] = value;
	}
	return rgb;
};

//----------------------------------------------------------------------

Colour.rgbToHsb = function(red, green, blue)
{
	var cMin = (red < green) ? red : green;
	if (cMin > blue)
		cMin = blue;

	var cMax = (red > green) ? red : green;
	if (cMax < blue)
		cMax = blue;

	var brightness = cMax / 255.0;

	var saturation = 0.0;
	if (cMax > 0.0)
		saturation = (cMax - cMin) / cMax;

	var hue = 0.0;
	if (saturation > 0.0)
	{
		var factor = 1.0 / (cMax - cMin);
		var redComp = (cMax - red) * factor;
		var greenComp = (cMax - green) * factor;
		var blueComp = (cMax - blue) * factor;
		if (cMax == red)
			hue = blueComp - greenComp;
		else if (cMax == green)
			hue = 2.0 + redComp - blueComp;
		else
			hue = 4.0 + greenComp - redComp;
		hue /= 6.0;
		if (hue < 0.0)
			hue += 1.0;
	}
	return [ hue, saturation, brightness ];
};

//----------------------------------------------------------------------

Colour.hsbToRgb = function(hue, saturation, brightness)
{
	var red = 0.0;
	var green = 0.0;
	var blue = 0.0;
	if (saturation == 0.0)
	{
		red = brightness;
		green = brightness;
		blue = brightness;
	}
	else
	{
		var h = (hue - Math.floor(hue)) * 6.0;
		var f = h - Math.floor(h);
		var a = brightness * (1.0 - saturation);
		var b = brightness * (1.0 - saturation * f);
		var c = brightness * (1.0 - (saturation * (1.0 - f)));
		switch (Math.floor(h))
		{
			case 0:
				red = brightness;
				green = c;
				blue = a;
				break;

			case 1:
				red = b;
				green = brightness;
				blue = a;
				break;

			case 2:
				red = a;
				green = brightness;
				blue = c;
				break;

			case 3:
				red = a;
				green = b;
				blue = brightness;
				break;

			case 4:
				red = c;
				green = a;
				blue = brightness;
				break;

			case 5:
				red = brightness;
				green = a;
				blue = b;
				break;
		}
	}
	return [ Math.round(255.0 * red), Math.round(255.0 * green), Math.round(255.0 * blue) ];
};

//----------------------------------------------------------------------

Colour.createFromRgbString = function(str)
{
	var rgb = Colour.parseColour(str);
	return new Colour(rgb[0], rgb[1], rgb[2]);
};

//----------------------------------------------------------------------

Colour.createFromHsb = function(hue, saturation, brightness)
{
	var rgb = Colour.hsbToRgb(hue, saturation, brightness);
	return new Colour(rgb[0], rgb[1], rgb[2]);
};

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

Colour.prototype.toRgbString = function()
{
	return Colour.RGB_PREFIX
			+ Colour.HEX_DIGITS.charAt(this.red >>> 4)   + Colour.HEX_DIGITS.charAt(this.red & 0x0F)
			+ Colour.HEX_DIGITS.charAt(this.green >>> 4) + Colour.HEX_DIGITS.charAt(this.green & 0x0F)
			+ Colour.HEX_DIGITS.charAt(this.blue >>> 4)  + Colour.HEX_DIGITS.charAt(this.blue & 0x0F);
};

//----------------------------------------------------------------------

Colour.prototype.getHsb = function()
{
	return Colour.rgbToHsb(this.red, this.green, this.blue);
};

//----------------------------------------------------------------------
