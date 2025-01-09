---@meta
-- Stormground API global table
---@alias keys
---| "lshift"
---| "rshift"
---| "lcontrol"
---| "lalt"
---| "ralt"
---| "lbracket"
---| "rbracket"
---| "space"
---| "backspace"
---| "tab"
---| "enter"
---| "minus"
---| "equal"
---| "up"
---| "down"
---| "left"
---| "right"
---| "comma"
---| "period"
---| "escape"
---| "slash"
---| "backslash"
---| "semicolon"
---| "delete"
---| "page up"
---| "page down"
---| "home"
---| "end"
---| "insert

---@alias buttons
---| "left"
---| "right"
---| "middle"
---| "button1"
---| "button2"
---| "button3"
---| "button4"
---| "button5"
---| "button6"
---| "button7"
---| "button8"

stormground = {
	-- Returns the number of milliseconds spent on the last frame. This number will typically be around 16.7 milliseconds.
	---@return number delta
	getDelta = function()
		return 0.0
	end,
	-- Returns the number of seconds since the start of the program. Yes it is a float.
	---@return number time
	getTime = function()
		return 0.0
	end,
	-- Returns the X and Y (two return values) of the cursor relative to the top left of the virtual display.
	---@return integer X
	---@return integer Y
	getCursor = function()
		return 0, 0
	end,
	-- Returns the X and Y (two return values) of the system cursor relative to the top left of the window.
	---@return integer X
	---@return integer Y
	getRealCursor = function()
		return 0, 0
	end,
	-- Returns the change in the Y scroll axis since the last frame.
	getScroll = function()
		return 0
	end,
	-- Returns the width and height (two return values) of the virtual display.
	---@return integer width
	---@return integer height
	getScreen = function()
		return 0, 0
	end,
	
	-- Returns a string of the press state of the `name` key. State can be `pressed`, `released`, `held`, `not pressed`, `repeated`. If input name is invalid, or something went wrong internally, this function will return `nil`.
	---@param name keys Name of key
	---@return string|nil state
	getKey = function(name)
		return ""
	end,
	-- Returns a boolean that is true if the state of the `name` key is `pressed` or `repeated`. If the input name is invalid, or something went wrong internally, this function will return `nil`.
	---@param name keys Name of key
	---@return boolean|nil state
	keyIsTyped = function(name)
		return false
	end,
	-- Returns a boolean that is true if the state of the `name` key is `pressed`, `repeated` or `held`. If the input name is invalid, or something went wrong internally, this function will return `nil`.
	---@param name keys Name of key
	---@return boolean|nil state
	keyIsDown = function(name)
		return false
	end,
	-- Returns a string of the press state of the `name` mouse button. State can be `pressed`, `released`, `held`, `not pressed`. If input name is invalid, or something went wrong internally, this function will return `nil`.
	---@param name buttons Name of button
	---@return string|nil state
	getButton = function(name)
		return ""
	end,
	-- Returns a gamepad state table for the gamepad specified by `id`. Passing a value of `1` for `id` returns the state table for the last detected gamepad. If `id` is invalid for some reason, this function will still return the full state table, but `.name` will be `nil`.
	---@param id integer Gamepad ID
	---@return table state
	getGamepad = function(id)
		return {
			-- Name of the gamepad (will be `nil` if error occurs)
			---@type string|nil
			name = "",
			-- Table with the accessable axes
			axes = {
				-- Right trigger axis
				---@type number
				rightTrigger = 0,
				-- Left trigger axis
				---@type number
				leftTrigger = 0,
				-- Left joystick X axis
				---@type number
				leftX = 0,
				-- Left joystick Y axis
				---@type number
				leftY = 0,
				-- Right joystick X axis
				---@type number
				rightX = 0,
				-- Right joystick Y axis
				---@type number
				rightY = 0,
			},
			-- Table with the accessable buttons.
			-- Button fields hold `pressed`, `released`, `held` or `not pressed`, just like return values of the `getButton` function.
			buttons = {
				-- A/Cross button
				---@type string 
				a = "",
				-- B/Circle button
				---@type string 
				b = "",
				-- X/Square button
				---@type string 
				x = "",
				-- Y/Triangle button
				---@type string 
				y = "",
				-- Left bumper button
				---@type string 
				leftBumber = "",
				-- Right bumper button
				---@type string 
				rightBumper = "",
				-- Back/Share button
				---@type string 
				back = "",
				-- Start/Options button
				---@type string 
				start = "",
				--Guide/PS button
				---@type string 
				guide = "",
				-- Left Joystick/Thumbstick button
				---@type string 
				leftThumb = "",
				-- Right Joystick/Thumbstick button
				---@type string 
				rightThumb = "",
				-- DPAD up button
				---@type string 
				dpadUp = "",
				-- DPAD right button
				---@type string 
				dpadRight = "",
				-- DPAD down button
				---@type string 
				dpadDown = "",
				-- DPAD left button
				---@type string 
				dpadLeft = ""
			}
			
		}
	end,
	-- Returns a string of the last active imput method. `m&k` for mouse and keyboard, or `gamepad` if gamepad. If an error happens internally, this result will be `nil`.
	---@return string|nil method
	getInputMethod = function ()
		return ""
	end,
	-- Calling this function will tell Stormground to stop runtime. Stormground will close on its own time, but usually on the start of processing the next frame.
	close = function()
	end,

	-- Sets a new size of the virtual display. `w` will be clamped to between `6` and `960`. `h` will be clamped to be between `6` and `540`. The change in display size will take place the same frame that this function was called. `stormground.getScreen` will return the new virtual display size.
	---@param w integer New width
	---@param h integer New height
	setScreen = function(w, h)
	end,

	-- Sets the position of the virtual cursor, relative to the top left of the window. `x` and `y` represents physical pixel coordinates instead of virtual display coordinates.
	---@param x integer New X
	---@param y integer New Y
	setCursor = function(x, y)
	end,

	-- Draws `text` at (`x`, `y`), with `size` being the size scaling of the text. Default letter size is 3 by 5 pixels.
	---@param x number Text X
	---@param y number Text Y
	---@param size any Text size
	---@param text any Text
	drawText = function (x, y, size, text)
	end,

	-- Draws 1 pixel wide line from (`x1`, `y1`) to (`x2`, `y2`)
	---@param x1 number Point 1 x
	---@param y1 number Point 1 y
	---@param x2 number Point 2 x
	---@param y2 number Point 2 y
	drawLine = function(x1, y1, x2, y2)
	end,

	-- Draws a circle centered around (`x`, `y`), with an outer diameter of `outerDiam`, and an inner diameter of `innerDiam`. `innerDiam` can be undefined or `nil`, and will be determined to be `0`.
	---@param x number Circle X
	---@param y number Circle Y
	---@param outerDiam number Circle outer diameter
	---@param innerDiam number|nil Circle inner diameter
	drawCircle = function(x, y, outerDiam, innerDiam)
	end,

	-- Draws a filled rectangle, with the top left of the box at (`x`, `y`), and extending for `width` and `height`. If `isHollow` is true, the rectangle will be drawn as hollow with a `1` pixel wide shell. `isHollow` can be undefined or `nil`, and will be determined to be `false`.
	---@param x number Rectangle X
	---@param y number Rectangle Y
	---@param width number Rectangle width
	---@param height number Rectangle height
	---@param isHollow boolean|nil Is rectangle hollow?
	drawRectangle = function(x, y, width, height, isHollow)
	end,

	-- Draws a filled triangle, with the points (`x1`,`y1`), (`x2`,`y2`), (`x3`,`y3`).
	---@param x1 number Point 1 X
	---@param y1 number Point 1 Y
	---@param x2 number Point 2 X
	---@param y2 number Point 2 Y
	---@param x3 number Point 3 X
	---@param y3 number Point 3 Y
	drawTriangle = function(x1, y1, x2, y2, x3, y3)
	end,

	-- Sets the draw color of any shapes from the call of the function, and then on. If any shapes were drawn before the call of this function, those shapes will retain their draw color.
	---@param r number Color R value 0-255
	---@param g number Color G value 0-255
	---@param b number Color B value 0-255
	setColor = function(r, g, b)
	end
}

