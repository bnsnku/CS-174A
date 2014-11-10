var canvas;
var gl;
var points = [];
var points2 = [];
var NumTimesToSubdivide = 6;
var rotationAmount = 0;
var displayingSierp = true;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    //var contextSave = canvas.getContext('2d');


    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    displaySierpinski();

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	//Set the starting color as black
	var colorLocation = gl.getUniformLocation(program, "uColor");
	var uColor = vec4(0.0, 0.0, 0.0, 1.0);
	if (colorLocation != 1)
	{
		gl.uniform4fv(colorLocation, uColor);
	}

    // Associate out shader variables with our data buffer
    var matrixLocation = gl.getUniformLocation(program,"uRotation")
    var rotationMat = rotate(rotationAmount, 0, 0, 1);
    gl.uniformMatrix4fv(matrixLocation, false, flatten(rotationMat));
 
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //contextSave.save();

    //this function waits for keybard events
	window.onkeypress = function(event)
	{
        //alert(event.keyCode);
        var key = event.keyCode ? event.keyCode : event.which;

        //extra credit #2; use keyboard method to change color
        //if '1' is pressed, change to green.
        if (key == 49)
        {
            var colorLocation = gl.getUniformLocation(program, "uColor");
            var uColor = vec4(0.0, 1.0, 0.0, 1.0);
            if (colorLocation != 1)
            {
                gl.uniform4fv(colorLocation, uColor);
            }

            render(); 
        }
        
        //if '2' is pressed, change to black.
        if (key == 50)
        {
            var colorLocation = gl.getUniformLocation(program, "uColor");
            var uColor = vec4(0.0, 0.0, 0.0, 1.0);
            if (colorLocation != 1)
            {
                gl.uniform4fv(colorLocation, uColor);
            }

            render(); 
        }

        //extra credit #3; switch between two display functions
        if (key == 116)
        {
            if (displayingSierp)
            {
                //alert("displaying mandelbrot");

                displayMandelbrot();
                render();
            }

            else
            {
                //alert("displaying sierpinski");

                displaySierpinski();
                render();
            }
        }

        //extra credit #4; rotate 10 deg CW if 'r' is pressed
        if (key == 114)
        {
            rotationAmount += -10;
            var matrixLocation = gl.getUniformLocation(program,"uRotation")
            var rotationMat = rotate(rotationAmount, 0, 0, 1);
            gl.uniformMatrix4fv(matrixLocation, false, flatten(rotationMat));

            render(); 
        }
        
    }

    render();
	
};

function displaySierpinski()
{
    // clear points in the buffer
    index = 0;
    points.splice( index, points.length );
    
    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.
    
    var vertices = [
        vec2( -0.5, -0.5 ),
        vec2(  0.5,  -0.5 ),
        vec2(  0, 0.5 )
    ];

    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.DYNAMIC_DRAW );

    displayingSierp = true;
}

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion
    
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
    
        //bisect the sides
        
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles
        
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

function displayMandelbrot()
{
    gl.clear(gl.DEPTH_BUFFER_BIT)
   // clear points in the buffer
    index = 0;
    points.splice( index, points.length );
 
    displayingSierp = false;
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
