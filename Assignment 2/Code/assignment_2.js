var canvas;
var gl;
var length = 1;
var rotBy = 1.0;
var totalRotation = 0;
var totalRotation2 = 0;
var moveBy = 0.25;

var scaleArr = vec3(1, 1, 1);

var translateArr = [vec3(10.0, 0.0, 0.0), vec3(0.0, 10.0, 0.0), vec3(0.0, 0.0, 10.0),
vec3(10.0, 10.0, 0.0), vec3(10.0, 0.0, 10.0), vec3(0.0, 10.0, 10.0),
vec3(10.0, 10.0, 10.0), vec3(0.0, 0.0, 0.0)];

var modelViewMatrix;
var viewMatrix;
var projectionMatrix;

var colorLocation;
var uColor;

var currWidth;
var currHeight;

var eye = vec3(30, 20, 20);
var at = vec3(0, 0, 1);
var up = vec3(0, 0, 1);

var xa = vec3( 1, 0, 0 );
var ya = vec3( 0, 1, 0 );
var za = vec3( 0, 0, 1 );

var rotMat = rotate(0, ya);
var rotMat2 = rotate(0, ya);

var colorList = [ vec4(1.0, 0.0, 0.0, 1.0), vec4(0.0, 1.0, 0.0, 1.0), vec4(0.0, 0.0, 1.0, 1.0),
vec4(1.0, 1.0, 0.0, 1.0), vec4(0.0, 1.0, 1.0, 1.0), vec4(1.0, 0.0, 1.0, 1.0),
vec4(0.5, 0.0, 0.0, 1.0), vec4(0.0, 0.5, 0.0, 1.0), vec4(0.0, 0.0, 0.5, 1.0) ]
var colorID = 0;

//
var l = -10;
var r = 10;
var t = 10;
var b = -10;
var ne = -10;
var f = 10;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    currWidth = canvas.width;
    currHeight = canvas.height;
    
    gl.viewport( 0, 0, currWidth, currHeight);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    vertices = [
        vec3(  length,   length, length ), //vertex 0
        vec3(  length,  -length, length ), //vertex 1
        vec3( -length,   length, length ), //vertex 2
        vec3( -length,  -length, length ),  //vertex 3 
        vec3(  length,   length, -length ), //vertex 4
        vec3(  length,  -length, -length ), //vertex 5
        vec3( -length,   length, -length ), //vertex 6
        vec3( -length,  -length, -length )  //vertex 7   
    ];

    var points = [];
    Cube(vertices, points);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");

    //set up camera
    viewMatrix = translate( -5, -5, -30 );
    projectionMatrix = perspective(90, 1, -1, 1);

    //set up colors
    colorLocation = gl.getUniformLocation(program, "uColor");
    uColor = colorList[colorID];

    drawCubes();

    window.onkeydown = function(event)
    {
       // alert(event.keyCode);
        var key = event.keyCode ? event.keyCode : event.which;

        //extra credit #2; use keyboard method to change color
        //if 'c' is pressed, cycle colors.
        if ( key == 67 )
        {
                colorNext();
                if ( colorLocation != 1 )
                {
                    gl.uniform4fv(colorLocation, uColor);
                } 

            // }
        }

        //if 'r' pressed, reset view
        if ( key == 82 )
        {
            rotMat = rotate( 0, ya );
            translateArr = [vec3(10.0, 0.0, 0.0), vec3(0.0, 10.0, 0.0), vec3(0.0, 0.0, 10.0),
            vec3(10.0, 10.0, 0.0), vec3(10.0, 0.0, 10.0), vec3(0.0, 10.0, 10.0),
            vec3(10.0, 10.0, 10.0), vec3(0.0, 0.0, 0.0)]

            currWidth = canvas.width;
            currHeight = canvas.height;
            gl.viewport( 0, 0, currWidth, currHeight);
            totalRotation = 0;
        }
        //if left pressed, azimuth left, rotate left
        if ( key == 37 ){
            totalRotation -= rotBy;

            rotMat = rotate( totalRotation, vec3(0,1,0) );
            drawCubes();  
        }
        //if right pressed, azimuth right, rotate right
        if (key == 39){
            totalRotation += rotBy;
            rotMat = rotate( totalRotation, vec3(0,1,0) );

            drawCubes();  
        }
        //if up pressed, altitude up, translate up
        if (key == 38){
            for (kk = 0; kk < translateArr.length; kk++)
            {
                translateArr[kk][0] -= moveBy*ya[0];
                translateArr[kk][1] -= moveBy*ya[1];
                translateArr[kk][2] -= moveBy*ya[2];
            }
            drawCubes();  
        }
        //if down pressed, altitude down, translate down
        if (key == 40){
            for (kk = 0; kk < translateArr.length; kk++)
            {
                // alert(translateArr[0][0]);
             
                translateArr[kk][0] += moveBy*ya[0];
                translateArr[kk][1] += moveBy*ya[1];
                translateArr[kk][2] += moveBy*ya[2];
            }
            drawCubes();  
        }

        //if j pressed, camera left, translate left
        if (key == 74){
                // alert(translateArr[0][0]);
            for (kk = 0; kk < translateArr.length; kk++)
            {
                translateArr[kk][0] += moveBy*xa[0];
                translateArr[kk][1] += moveBy*xa[1];
                translateArr[kk][2] += moveBy*xa[2];
            }
            drawCubes();   
        }
        //if k pressed, camera right, translate right
        if (key == 75){
            for (kk = 0; kk < translateArr.length; kk++)
            {
                translateArr[kk][0] -= moveBy*xa[0];
                translateArr[kk][1] -= moveBy*xa[1];
                translateArr[kk][2] -= moveBy*xa[2];
            }
            drawCubes();  
        }

        //if i pressed, camera forward, translate forward
        if (key == 73){
            for (kk = 0; kk < translateArr.length; kk++)
            {
                // alert(translateArr[0][0]);
                translateArr[kk][0] += moveBy*za[0];
                translateArr[kk][1] += moveBy*za[1];
                translateArr[kk][2] += moveBy*za[2];
            }
            drawCubes();  
        }
        //if m pressed, camera backward, translate backwards
        if (key == 77){
            for (kk = 0; kk < translateArr.length; kk++)
            {
                // alert(translateArr[0][0]);
             
                translateArr[kk][0] -= moveBy*za[0];
                translateArr[kk][1] -= moveBy*za[1];
                translateArr[kk][2] -= moveBy*za[2];
            }
            drawCubes();  
        }

        //if n pressed, make view narrower,
        if (key == 78){
            currWidth -= 10;
            gl.viewport( 0, 0, currWidth, currHeight);
        }
        //if w pressed, make view wider
        if (key == 87){
            currWidth += 10;
            gl.viewport( 0, 0, currWidth, currHeight);
        }

        //if x pressed, display orthographic crosshair
        if (key == 88){
            // crossMat = ortho( l, r, b, t, ne, f )
            // var verticesCrossHair = [
            //     vec3(  1.0,  0.0,  0.0 ),
            //     vec3( -1.0,  0.0,  0.0 ),
            //     vec3(  0.0,  1.0,  0.0 ),
            //     vec3(  0.0, -1.0,  0.0 ),
            // ];

            // gl.uniformMatrix4fv( modelViewMatrix, false, flatten(crossMat) );

            // gl.drawArrays( gl.LINES, 36, verticesCrossHair.length);
        }
    }
    
    render();
}

function Cube(vertices, points){
    Quad(vertices, points, 0, 1, 2, 3);
    Quad(vertices, points, 4, 0, 6, 2);
    Quad(vertices, points, 4, 5, 0, 1);
    Quad(vertices, points, 2, 3, 6, 7);
    Quad(vertices, points, 1, 5, 3, 7);
    Quad(vertices, points, 6, 7, 4, 5);
}

function Quad( vertices, points, v1, v2, v3, v4){
    points.push(vertices[v1]);
    points.push(vertices[v3]);
    points.push(vertices[v4]);
    points.push(vertices[v1]);
    points.push(vertices[v4]);
    points.push(vertices[v2]);
}

function colorNext(){
    colorID++;
    if (colorID == colorList.length)
    {
        colorID = 0;
    }
}

function drawCubes()
{

   for ( kk = 0; kk < 8 ; kk++ )
    {        
        uColor = colorList[(colorID+kk)%8];
        gl.uniform4fv(colorLocation, uColor);

        ctm = mat4();
        ctm = mult(ctm, projectionMatrix);
        ctm = mult(ctm, rotMat);
        ctm = mult(ctm, viewMatrix);
        ctm = mult(ctm, translate(translateArr[kk]));
        ctm = mult(ctm, rotMat2);
        ctm = mult(ctm, scale(scaleArr)); 

        gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));

        gl.drawArrays( gl.TRIANGLES, 0, 36 );
    }
}

function render()
{
   gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   totalRotation2 += rotBy;
   rotMat2 = rotate(totalRotation2, ya);

   drawCubes();

   window.requestAnimFrame( render );
}

