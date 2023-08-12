/*====================================================================*\

Class: helical ramp

\*====================================================================*/

// ECMAScript 5 strict mode

"use strict";

//----------------------------------------------------------------------


// CLASS: SPRITE


////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function Sprite(pos, y, direction, colour)
{
	this.pos = pos;
	this.y = y;
	this.direction = direction;
	this.colour = colour;
}

//----------------------------------------------------------------------

//======================================================================


// CLASS: SPRITE POSITION


////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function SpritePosition(x, size)
{
	this.x = x;
	this.size = size;
}

//----------------------------------------------------------------------

//======================================================================


// CLASS: HELICAL RAMP


////////////////////////////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////////////////////////////

HelicalRamp.Kind    =
{
	UNIDIRECTIONAL : 0,
	BIDIRECTIONAL  : 1
};

HelicalRamp.Direction   =
{
	UP   : 0,
	DOWN : 1
};

HelicalRamp.ICON_WIDTH	= 34;
HelicalRamp.ICON_HEIGHT	= 32;

HelicalRamp.UPDATE_INTERVAL	= 100;

HelicalRamp.MIN_SPRITE_DELAY	= 6;
HelicalRamp.MAX_SPRITE_DELAY	= 18;

HelicalRamp.TWO_PI	= 2.0 * Math.PI;

HelicalRamp.SPRITE_POSITIONS	=
[
	new SpritePosition( 3, 6.0),
	new SpritePosition( 6, 5.5),
	new SpritePosition( 0, 0.0),
	new SpritePosition(28, 5.5),
	new SpritePosition(31, 6.0),
	new SpritePosition(28, 6.5),
	new SpritePosition(17, 7.0),
	new SpritePosition( 6, 6.5)
];
HelicalRamp.NUM_SPRITE_POSITIONS	= HelicalRamp.SPRITE_POSITIONS.length;
HelicalRamp.SPRITE_DELTA_Y			= HelicalRamp.ICON_HEIGHT / HelicalRamp.NUM_SPRITE_POSITIONS;
HelicalRamp.MIN_SPRITE_Y_SEPARATION	= HelicalRamp.MIN_SPRITE_DELAY * HelicalRamp.SPRITE_DELTA_Y;
HelicalRamp.MAX_SPRITE_SIZE			= 7;

// Sprite colours
HelicalRamp.SPRITE_COLOUR_MIN_DELTA_HUE	= 0.15;
HelicalRamp.SPRITE_COLOUR_MAX_DELTA_HUE	= 1.0 - HelicalRamp.SPRITE_COLOUR_MIN_DELTA_HUE;

HelicalRamp.SPRITE_COLOUR_MIN_SATURATION	= 0.7;
HelicalRamp.SPRITE_COLOUR_MAX_SATURATION	= 1.0;

HelicalRamp.SPRITE_COLOUR_MIN_BRIGHTNESS	= 0.75;
HelicalRamp.SPRITE_COLOUR_MAX_BRIGHTNESS	= 0.9;

HelicalRamp.SPRITE_COLOUR_GREEN_FACTOR	= 0.8;

HelicalRamp.SPRITE_COLOUR_MIN_EXCLUDE_HUE	= 50.0 / 360.0;
HelicalRamp.SPRITE_COLOUR_MAX_EXCLUDE_HUE	= 90.0 / 360.0;

// Icon RGB data
HelicalRamp.ICON_DATA	=
[
	0x00F6F6F2, 0x00C8C8B9, 0x00C6C6B6, 0x00C6C6B6,
	0x00C6C6B6, 0x00C6C6B6, 0x00F4F4F0, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F3F3EE,
	0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0,
	0x00D2D2C2, 0x00F6F6F2, 0x00F6F6F2, 0x00D3D3C6,
	0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6,
	0x00EAEAE4, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00ECECE4, 0x00D0D0C0, 0x00D0D0C0,
	0x00D0D0C0, 0x00D0D0C0, 0x00DADACE, 0x00F6F6F2,
	0x00F6F6F2, 0x00E9E9E2, 0x00C6C6B6, 0x00C6C6B6,
	0x00C6C6B6, 0x00C6C6B6, 0x00D7D7CA, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00DCDCD0,
	0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0,
	0x00EEEEE8, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00DBDBD1, 0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6,
	0x00C6C6B6, 0x00E7E7DF, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00E9E9E1, 0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0,
	0x00D0D0C0, 0x00E3E3D8, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00DCDCD2,
	0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6, 0x00C7C7B8,
	0x00E7E7DF, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00EAEAE2, 0x00D2D2C1, 0x00D0D0C0,
	0x00D0D0C0, 0x00D0D0C0, 0x00E3E3D9, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00E9E9E1, 0x00CDCDBF,
	0x00C6C6B6, 0x00C6C6B6, 0x00C7C7B7, 0x00DADAD0,
	0x00F3F3EE, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F4F4EF, 0x00E1E1D6, 0x00D0D0C0,
	0x00D0D0C0, 0x00D0D0C0, 0x00D6D6C7, 0x00EDEDE6,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F1, 0x00E6E6DD, 0x00D0D0C2,
	0x00D1D1C3, 0x00DEDED4, 0x00EEEEE8, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00EFEFE8, 0x00E1E1D6, 0x00D2D2C4,
	0x00D0D0C0, 0x00D0D0C0, 0x00D7D7CA, 0x00E8E8E0,
	0x00F5F5F1, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F1F1EC, 0x00ECECE4,
	0x00E7E7E0, 0x00E6E6DD, 0x00E4E4DB, 0x00E2E2D7,
	0x00DEDED4, 0x00DADACE, 0x00D2D2C3, 0x00D0D0C0,
	0x00D3D3C2, 0x00DADACD, 0x00E4E4DB, 0x00F0F0E9,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00EFEFE8, 0x00E4E4DA, 0x00D9D9CC, 0x00D2D2C2,
	0x00D0D0C0, 0x00D3D3C4, 0x00DADACE, 0x00DFDFD4,
	0x00E2E2D7, 0x00E4E4DB, 0x00E6E6DD, 0x00E8E8E0,
	0x00EBEBE5, 0x00F2F2EC, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F5F5F0,
	0x00E7E7E0, 0x00D7D7CA, 0x00D0D0C0, 0x00D0D0C0,
	0x00D3D3C4, 0x00E2E2D7, 0x00F0F0E9, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00EEEEE8, 0x00DEDED4, 0x00D1D1C3,
	0x00D0D0C2, 0x00E6E6DD, 0x00F6F6F1, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00ECECE5, 0x00D6D6C7, 0x00D0D0C0, 0x00D0D0C0,
	0x00D0D0C0, 0x00E2E2D7, 0x00F3F3F0, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F3F3EE,
	0x00DADACF, 0x00C7C7B7, 0x00C6C6B6, 0x00C6C6B6,
	0x00CDCDBF, 0x00E9E9E1, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00E2E2D8, 0x00D0D0C0, 0x00D0D0C0,
	0x00D0D0C0, 0x00D2D2C2, 0x00EBEBE3, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00E8E8E0,
	0x00C7C7B8, 0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6,
	0x00DCDCD2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00E2E2D7, 0x00D0D0C0,
	0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0, 0x00EAEAE2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00E7E7DF, 0x00C6C6B6,
	0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6, 0x00DBDBD1,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00EDEDE7,
	0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0,
	0x00DDDDD1, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00D7D7CB, 0x00C6C6B6, 0x00C6C6B6,
	0x00C6C6B6, 0x00C6C6B6, 0x00E9E9E2, 0x00F6F6F2,
	0x00F6F6F2, 0x00DBDBCD, 0x00D0D0C0, 0x00D0D0C0,
	0x00D0D0C0, 0x00D0D0C0, 0x00ECECE5, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00EAEAE3,
	0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6,
	0x00D3D3C7, 0x00F6F6F2, 0x00F6F6F2, 0x00D2D2C2,
	0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0,
	0x00F4F4EF, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F3F3F0, 0x00C6C6B6, 0x00C6C6B6,
	0x00C6C6B6, 0x00C6C6B6, 0x00C8C8B9, 0x00F6F6F2,
	0x00F6F6F2, 0x00D2D2C3, 0x00D0D0C0, 0x00D0D0C0,
	0x00D0D0C0, 0x00D0D0C0, 0x00F4F4F0, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F3F3EE,
	0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6,
	0x00C9C9B9, 0x00F6F6F2, 0x00F6F6F2, 0x00DADACE,
	0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0,
	0x00EDEDE6, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00E9E9E2, 0x00C6C6B6, 0x00C6C6B6,
	0x00C6C6B6, 0x00C6C6B6, 0x00D3D3C7, 0x00F6F6F2,
	0x00F6F6F2, 0x00EBEBE4, 0x00D0D0C0, 0x00D0D0C0,
	0x00D0D0C0, 0x00D0D0C0, 0x00DDDDD1, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00D5D5C9,
	0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6,
	0x00ECECE6, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00E1E1D6, 0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0,
	0x00D0D0C0, 0x00EAEAE2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00E6E6DD, 0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6,
	0x00C6C6B6, 0x00DDDDD3, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00E2E2D7,
	0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0, 0x00D1D1C1,
	0x00EAEAE2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00E7E7DF, 0x00C8C8B8, 0x00C6C6B6,
	0x00C6C6B6, 0x00C6C6B6, 0x00DEDED4, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00ECECE4, 0x00D6D6C7,
	0x00D0D0C0, 0x00D0D0C0, 0x00D1D1C1, 0x00E0E0D5,
	0x00F4F4EF, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F3F3EE, 0x00DBDBD1, 0x00C6C6B7,
	0x00C6C6B6, 0x00C6C6B6, 0x00CDCDBF, 0x00EAEAE3,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00E9E9E1, 0x00D8D8CA,
	0x00D9D9CB, 0x00E3E3D9, 0x00EFEFEA, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00EDEDE7, 0x00DCDCD1, 0x00C9C9BA,
	0x00C6C6B6, 0x00C6C6B6, 0x00CFCFC2, 0x00E4E4DD,
	0x00F5F5F0, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F0F0EB, 0x00E9E9E1,
	0x00E4E4DC, 0x00E2E2D8, 0x00DFDFD6, 0x00DCDCD2,
	0x00D8D8CE, 0x00D3D3C6, 0x00C9C9BA, 0x00C6C6B6,
	0x00C9C9B9, 0x00D3D3C6, 0x00E0E0D7, 0x00EEEEE8,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00EDEDE7, 0x00DFDFD6, 0x00D2D2C5, 0x00C9C9B8,
	0x00C6C6B6, 0x00CACABB, 0x00D3D3C7, 0x00D9D9CE,
	0x00DDDDD2, 0x00DFDFD6, 0x00E2E2D9, 0x00E4E4DC,
	0x00E8E8E2, 0x00F1F1EB, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F4F4F0,
	0x00E4E4DC, 0x00CFCFC2, 0x00C6C6B6, 0x00C6C6B6,
	0x00CACABB, 0x00DDDDD2, 0x00EEEEE7, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00EFEFEA, 0x00E3E3D9, 0x00D8D8CB,
	0x00D8D8CA, 0x00E9E9E1, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00E9E9E2, 0x00CDCDBE, 0x00C6C6B6, 0x00C6C6B6,
	0x00C6C6B7, 0x00DCDCD1, 0x00F3F3EF, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F4F4EF,
	0x00E0E0D5, 0x00D1D1C1, 0x00D0D0C0, 0x00D0D0C0,
	0x00D6D6C7, 0x00ECECE4, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00DDDDD3, 0x00C6C6B6, 0x00C6C6B6,
	0x00C6C6B6, 0x00C9C9B8, 0x00E8E8E1, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00EBEBE3,
	0x00D1D1C1, 0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0,
	0x00E2E2D7, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00DDDDD2, 0x00C6C6B6,
	0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6, 0x00E7E7DF,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00EAEAE2, 0x00D0D0C0,
	0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0, 0x00E1E1D6,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00EBEBE4,
	0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6,
	0x00D6D6CA, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00DEDED1, 0x00D0D0C0, 0x00D0D0C0,
	0x00D0D0C0, 0x00D0D0C0, 0x00ECECE4, 0x00F6F6F2,
	0x00F6F6F2, 0x00D3D3C6, 0x00C6C6B6, 0x00C6C6B6,
	0x00C6C6B6, 0x00C6C6B6, 0x00E9E9E2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00A0C0A0, 0x00A0C0A0, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00EDEDE6,
	0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0, 0x00D0D0C0,
	0x00DADACE, 0x00F6F6F2, 0x00F6F6F2, 0x00C9C9B8,
	0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6, 0x00C6C6B6,
	0x00F3F3EE, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00A0C0A0, 0x00A0C0A0,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2, 0x00F6F6F2,
	0x00F6F6F2, 0x00F4F4F0, 0x00D0D0C0, 0x00D0D0C0,
	0x00D0D0C0, 0x00D0D0C0, 0x00D2D2C3, 0x00F6F6F2
];

////////////////////////////////////////////////////////////////////////
//  Class variables
////////////////////////////////////////////////////////////////////////

HelicalRamp.instances		= [];
HelicalRamp.timerId			= null;
HelicalRamp.spriteColours	= null;

////////////////////////////////////////////////////////////////////////
//  Constructor
////////////////////////////////////////////////////////////////////////

function HelicalRamp(canvas, kind, direction)
{
	// Validate arguments
	if (!Utils.contains(HelicalRamp.Kind, kind))
		throw new Error("Illegal argument: kind: " + kind);
	if (!Utils.contains(HelicalRamp.Direction, direction))
		throw new Error("Illegal argument: direction: " + direction);

	// Initialise instance variables
	this.kind = kind;
	this.rampDirection = direction;
	this.height = canvas.height;
	this.context = canvas.getContext("2d");
	this.imageBuffer = this.context.createImageData(HelicalRamp.ICON_WIDTH, HelicalRamp.ICON_HEIGHT);
	this.iconOffset = Utils.nextRandomInt(HelicalRamp.ICON_HEIGHT);
	this.sprites = [];
	this.spriteDirection = HelicalRamp.reverseDirection(direction);
	this.spriteDelay = 0;
	this.spriteHue = Math.random();

	// Initialise the colours of sprites on a bidirectional ramp
	if (kind == HelicalRamp.Kind.BIDIRECTIONAL)
	{
		while (!HelicalRamp.spriteColours)
		{
			var hue = 0.5 * Math.random();
			if ((hue < HelicalRamp.SPRITE_COLOUR_MIN_EXCLUDE_HUE) || (hue > HelicalRamp.SPRITE_COLOUR_MAX_EXCLUDE_HUE))
				HelicalRamp.spriteColours = [ HelicalRamp.hueToColour(hue), HelicalRamp.hueToColour(hue + 0.5) ];
		}
	}

	// Initialise the sprites
	var y = HelicalRamp.SPRITE_DELTA_Y - this.iconOffset % HelicalRamp.SPRITE_DELTA_Y;
	while (true)
	{
		y += HelicalRamp.MIN_SPRITE_Y_SEPARATION
							+ Utils.nextRandomInt(HelicalRamp.MAX_SPRITE_DELAY - HelicalRamp.MIN_SPRITE_DELAY + 1)
							* HelicalRamp.SPRITE_DELTA_Y;
		if (y >= canvas.height - HelicalRamp.MIN_SPRITE_Y_SEPARATION)
			break;
		switch (kind)
		{
			case HelicalRamp.Kind.UNIDIRECTIONAL:
				this.addSprite(y, null);
				break;

			case HelicalRamp.Kind.BIDIRECTIONAL:
				this.addSprite(y, (Utils.nextRandomInt(2) == 0) ? HelicalRamp.Direction.UP
																: HelicalRamp.Direction.DOWN);
				break;
		}
	}
}

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Class methods
////////////////////////////////////////////////////////////////////////

HelicalRamp.clearInstances = function()
{
	HelicalRamp.instances = [];
	if (HelicalRamp.timerId != null)
	{
		window.clearInterval(HelicalRamp.timerId);
		HelicalRamp.timerId = null;
	}
	HelicalRamp.spriteColours = null;
};

//----------------------------------------------------------------------

HelicalRamp.addInstance = function(canvas, kind, direction, colours)
{
	HelicalRamp.instances.push(new HelicalRamp(canvas, kind, direction, colours));
	if (HelicalRamp.timerId == null)
		HelicalRamp.timerId = window.setInterval(HelicalRamp.onTimer, HelicalRamp.UPDATE_INTERVAL);
};

//----------------------------------------------------------------------

HelicalRamp.reverseDirection = function(direction)
{
	return (direction == HelicalRamp.Direction.UP) ? HelicalRamp.Direction.DOWN : HelicalRamp.Direction.UP;
};

//----------------------------------------------------------------------

HelicalRamp.hueToColour = function(hue)
{
	var s = HelicalRamp.SPRITE_COLOUR_MIN_SATURATION + Math.random()
								* (HelicalRamp.SPRITE_COLOUR_MAX_SATURATION - HelicalRamp.SPRITE_COLOUR_MIN_SATURATION);
	var b = HelicalRamp.SPRITE_COLOUR_MIN_BRIGHTNESS + Math.random()
								* (HelicalRamp.SPRITE_COLOUR_MAX_BRIGHTNESS - HelicalRamp.SPRITE_COLOUR_MIN_BRIGHTNESS);
	var rgb = Colour.hsbToRgb(hue, s, b);
	return new Colour(rgb[0], Math.round(rgb[1] * HelicalRamp.SPRITE_COLOUR_GREEN_FACTOR), rgb[2]);
};

//----------------------------------------------------------------------

HelicalRamp.onTimer = function()
{
	for (var i = 0; i < HelicalRamp.instances.length; i++)
		HelicalRamp.instances[i].update();
};

//----------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////
//  Instance methods
////////////////////////////////////////////////////////////////////////

HelicalRamp.prototype.getSpritePosition = function(y, alternateRamp)
{
	var pos = Math.floor((y + this.iconOffset) % HelicalRamp.ICON_HEIGHT / HelicalRamp.SPRITE_DELTA_Y);
	if (alternateRamp)
	{
		pos -= HelicalRamp.NUM_SPRITE_POSITIONS >> 1;
		if (pos < 0)
			pos += HelicalRamp.NUM_SPRITE_POSITIONS;
	}
	return pos;
};

//----------------------------------------------------------------------

HelicalRamp.prototype.addSprite = function(y, direction)
{
	// Unidirectional
	if (direction == null)
	{
		// Add a random increment to the sprite hue
		this.spriteHue += HelicalRamp.SPRITE_COLOUR_MIN_DELTA_HUE + Math.random()
								* (HelicalRamp.SPRITE_COLOUR_MAX_DELTA_HUE - HelicalRamp.SPRITE_COLOUR_MIN_DELTA_HUE);
		if (this.spriteHue >= 1.0)
			this.spriteHue -= 1.0;

		// Get the sprite position index: on half the occasions, put the sprite on the 'other' ramp
		var pos = this.getSpritePosition(y, Utils.nextRandomInt(2) == 0);

		// Add a new sprite to the list
		this.sprites.push(new Sprite(pos, y, this.spriteDirection, HelicalRamp.hueToColour(this.spriteHue)));
	}

	// Bidirectional
	else
	{
		// Get the sprite position index: if the sprite's direction is down, put it on the 'other' ramp
		var pos = this.getSpritePosition(y, direction == HelicalRamp.Direction.DOWN);

		// Add a new sprite to the list
		var index = (direction == HelicalRamp.Direction.UP) ? 0 : 1;
		this.sprites.push(new Sprite(pos, y, direction, HelicalRamp.spriteColours[index]));
	}
};

//----------------------------------------------------------------------

HelicalRamp.prototype.update = function()
{
	// Decrement ramp offset
	var rampIncrement = (this.rampDirection == HelicalRamp.Direction.UP) ? 1 : -1;
	this.iconOffset += rampIncrement;
	if (this.iconOffset < 0)
		this.iconOffset += HelicalRamp.ICON_HEIGHT;
	if (this.iconOffset >= HelicalRamp.ICON_HEIGHT)
		this.iconOffset -= HelicalRamp.ICON_HEIGHT;

	// Move sprites on ramp
	var newSprites = [];
	for (var i = 0; i < this.sprites.length; i++)
	{
		var sprite = this.sprites[i];
		switch (sprite.direction)
		{
			case HelicalRamp.Direction.UP:
			{
				// Decrement the y coordinate of the sprite
				sprite.y -= HelicalRamp.SPRITE_DELTA_Y;
				sprite.y -= rampIncrement;

				// If the sprite hasn't reached the top of the ramp, decrement its position
				if (sprite.y >= -(HelicalRamp.MAX_SPRITE_SIZE >> 1))
				{
					if (--sprite.pos < 0)
						sprite.pos += HelicalRamp.NUM_SPRITE_POSITIONS;
					newSprites.push(sprite);
				}
				break;
			}

			case HelicalRamp.Direction.DOWN:
			{
				// Increment the y coordinate of the sprite
				sprite.y += HelicalRamp.SPRITE_DELTA_Y;
				sprite.y -= rampIncrement;

				// If the sprite hasn't reached the bottom of the ramp, increment its position
				if (sprite.y < this.height + (HelicalRamp.MAX_SPRITE_SIZE >> 1))
				{
					if (++sprite.pos >= HelicalRamp.NUM_SPRITE_POSITIONS)
						sprite.pos -= HelicalRamp.NUM_SPRITE_POSITIONS;
					newSprites.push(sprite);
				}
				break;
			}
		}
	}

	// Update list of sprites
	this.sprites = newSprites;

	// If the delay since creating the previous sprite has elapsed, create a new sprite
	if (--this.spriteDelay < 0)
	{
		// Add a new sprite to the list
		var y = (this.spriteDirection == HelicalRamp.Direction.DOWN)
										? HelicalRamp.SPRITE_DELTA_Y - this.iconOffset % HelicalRamp.SPRITE_DELTA_Y
										: this.height - (this.height + this.iconOffset) % HelicalRamp.SPRITE_DELTA_Y;
		switch (this.kind)
		{
			case HelicalRamp.Kind.UNIDIRECTIONAL:
				this.addSprite(y, null);
				break;

			case HelicalRamp.Kind.BIDIRECTIONAL:
				this.addSprite(y, this.spriteDirection);
				this.spriteDirection = HelicalRamp.reverseDirection(this.spriteDirection);
				break;
		}

		// Set the delay until the next sprite is created
		this.spriteDelay = HelicalRamp.MIN_SPRITE_DELAY
								+ Utils.nextRandomInt(HelicalRamp.MAX_SPRITE_DELAY - HelicalRamp.MIN_SPRITE_DELAY + 1);
	}

	// Set the ramp icon data in the image buffer
	var iconDataWidth = Math.min(this.imageBuffer.width, HelicalRamp.ICON_WIDTH);
	var offset = this.iconOffset;
	var i1 = 0;
	for (var i = 0; i < this.imageBuffer.height; i++)
	{
		var i0 = offset * HelicalRamp.ICON_WIDTH;
		for (var j = 0; j < iconDataWidth; j++)
		{
			var rgb = HelicalRamp.ICON_DATA[i0++];
			this.imageBuffer.data[i1++] = rgb >>> 16;
			this.imageBuffer.data[i1++] = (rgb >> 8) & 0xFF;
			this.imageBuffer.data[i1++] = rgb & 0xFF;
			this.imageBuffer.data[i1++] = 255;
		}
		if (++offset >= HelicalRamp.ICON_HEIGHT)
			offset = 0;
	}

	// Set the image data in the canvas
	for (var y = 0; y < this.height; y += this.imageBuffer.height)
		this.context.putImageData(this.imageBuffer, 0, y);

	// Draw the sprites
	for (var i = 0; i < this.sprites.length; i++)
	{
		var sprite = this.sprites[i];
		var size = HelicalRamp.SPRITE_POSITIONS[sprite.pos].size;
		if (size > 0.0)
		{
			this.context.fillStyle = sprite.colour.toRgbString();
			this.context.beginPath();
			this.context.arc(HelicalRamp.SPRITE_POSITIONS[sprite.pos].x, sprite.y, 0.5 * size, 0, HelicalRamp.TWO_PI,
							 false);
			this.context.fill();
		}
	}
};

//----------------------------------------------------------------------
