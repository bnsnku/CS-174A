var canvas;
var gl;
var length = 3;
var rotBy = 1.0;
var totalRotation = 0;
var totalRotation1 = [0, 0, 0, 0, 0, 0];
var totalRotation2 = 0;
var moveBy = 0.25;

//circle code
var numTimesToSubdivide = 5;
 
var index = 0;

var pointsArray = [];
var normalsArray = [];
var points = [];

var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var va = vec4(0.0, 0.0, -10.0, 1);
var vb = vec4(0.0, 9.42809, 3.33333, 1);
var vc = vec4(-8.16497, -4.71405, 3.33333, 1);
var vd = vec4(8.16497, -4.71405, 3.33333,1);

//[sun, plan1 (ice) , plan2(swamp) , plan3(water) , plan4(muddy) , moon]
var colorList = [ vec4(1.0, 0.9, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0), vec4(0.4, 0.8, 0.5, 1.0),
vec4(0.0, 0.0, 0.8, 1.0), vec4(0.6, 0.4, 0.1, 1.0), vec4(0.0, 0.0, 0.0, 1.0)];

//orbit radii
var orbR1 = 50;
var orbR2 = 30;
var orbR3 = 20;
var orbR4 = 40;
var orbRM = 3;

var orbitSpeed = [0, 1, 1.5, 3, 2.1, 3]

//put planets in initial position
var translateArr = [vec3(0.0, 0.0, 0.0), vec3(0.0, orbR1, 0.0), vec3(0.0, orbR2, 0.0),
vec3(0.0, orbR3, 0.0), vec3(0.0, orbR4, 0.0), vec3(10.0, orbRM, 10.0)];

//planet diameter scaling factor
var scaleP1 = 0.5;
var scaleP2 = 0.3;
var scaleP3 = 0.4;
var scaleP4 = 0.5;
var scalePM = 0.1;

//define planets initial size
var scaleArr = [vec3(1, 1, 1), vec3(scaleP1, scaleP1, scaleP1), vec3(scaleP2, scaleP2, scaleP2),
vec3(scaleP3, scaleP3, scaleP3), vec3(scaleP4, scaleP4, scaleP4), vec3(scalePM, scalePM, scalePM)]; 

var modelViewMatrix;
var projectionMatrix;
var viewMatrix;
var modelViewMatrixLoc;
var projectionMatrixLoc;

var colorLocation;
var uColor;

var lightPosition = vec4(0.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

// var eye = vec3(80, 20, 20);
// var at = vec3(0, 0, 1);
// var up = vec3(0, 0, 1);

var xa = vec3( 1, 0, 0 );
var ya = vec3( 0, 1, 0 );
var za = vec3( 0, 0, 1 );

var rotMat = rotate(0, ya);
var rotMat1 = [rotate(0, za), rotate(0, za), rotate(0, za),
rotate(0, za), rotate(0, za), rotate(0, za)];
var rotMat2 = rotate(0, ya);

var colorID = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height);
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

    Cube(vertices, points);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // ambientProduct = mult(lightAmbient, materialAmbient);
    // diffuseProduct = mult(lightDiffuse, materialDiffuse);
    // specularProduct = mult(lightSpecular, materialSpecular);

    // tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    // var nBuffer = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    // var vNormal = gl.getAttribLocation( program, "vNormal" );
    // gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    // gl.enableVertexAttribArray( vNormal);

    // var vBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    // var vPosition = gl.getAttribLocation( program, "vPosition");
    // gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vPosition);
    
    // modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    // projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
   

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");

    // //set up camera
    viewMatrix = translate( 0, 0, -100 );
    projectionMatrix = perspective(90, 1, -1, 1);

    // //set up colors
    colorLocation = gl.getUniformLocation(program, "uColor");
    uColor = colorList[colorID];


   // gl.uniform4fv( gl.getUniformLocation(program, 
   //     "ambientProduct"),flatten(ambientProduct) );
   //  gl.uniform4fv( gl.getUniformLocation(program, 
   //     "diffuseProduct"),flatten(diffuseProduct) );
   //  gl.uniform4fv( gl.getUniformLocation(program, 
   //     "specularProduct"),flatten(specularProduct) );   
   //  gl.uniform4fv( gl.getUniformLocation(program, 
   //     "lightPosition"),flatten(lightPosition) );
   //  gl.uniform1f( gl.getUniformLocation(program, 
   //     "shininess"),materialShininess );

    drawSpheres();

    window.onkeydown = function(event)
    {
       // alert(event.keyCode);
        var key = event.keyCode ? event.keyCode : event.which;

        //extra credit #2; use keyboard method to change color
        //if 'c' is pressed, cycle colors.
        // if ( key == 67 )
        // {
        //         colorNext();
        //         if ( colorLocation != 1 )
        //         {
        //             gl.uniform4fv(colorLocation, uColor);
        //         } 
        // }

        //if 'r' pressed, reset view
        if ( key == 82 )
        {
            rotMat = rotate( 0, ya );

            // currWidth = canvas.width;
            // currHeight = canvas.height;
            // gl.viewport( 0, 0, currWidth, currHeight);
            totalRotation = 0;
        }
        //if left pressed, azimuth left, rotate left
        if ( key == 37 ){
            totalRotation -= rotBy;

            rotMat = rotate( totalRotation, vec3(0,1,0) );
            drawSpheres();  
        }
        //if right pressed, azimuth right, rotate right
        if (key == 39){
            totalRotation += rotBy;
            rotMat = rotate( totalRotation, vec3(0,1,0) );

            drawSpheres();  
        }
        //if up pressed, altitude up, translate up
        if (key == 38){
            for (kk = 0; kk < translateArr.length; kk++)
            {
                translateArr[kk][0] -= moveBy*ya[0];
                translateArr[kk][1] -= moveBy*ya[1];
                translateArr[kk][2] -= moveBy*ya[2];
            }
            drawSpheres();  
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
            drawSpheres();  
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
            drawSpheres();  
        }
        //if k pressed, camera right, translate right
        if (key == 75){
            for (kk = 0; kk < translateArr.length; kk++)
            {
                translateArr[kk][0] -= moveBy*xa[0];
                translateArr[kk][1] -= moveBy*xa[1];
                translateArr[kk][2] -= moveBy*xa[2];
            }
            drawSpheres();  
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
            drawSpheres();  
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
            drawSpheres();  
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

function triangle(a, b, c) {

     normalsArray.push(a);
     normalsArray.push(b);
     normalsArray.push(c);
     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}


function drawSpheres(){

   for ( kk = 0; kk < translateArr.length ; kk++ )
    {        
        uColor = colorList[(colorID+kk)%8];
        gl.uniform4fv(colorLocation, uColor);

        ctm = mat4();
        ctm = mult(ctm, projectionMatrix);
        ctm = mult(ctm, rotMat); //navigation rotation
        ctm = mult(ctm, viewMatrix);
        ctm = mult(ctm, rotMat1[kk]); //rotate about the origin
        ctm = mult(ctm, translate(translateArr[kk]));
        ctm = mult(ctm, rotMat2); //rotate about own axis
        ctm = mult(ctm, scale(scaleArr[kk])); 

        gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));

        gl.drawArrays( gl.TRIANGLES, 0, 36 );
    }
}

function render()
{
   gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   totalRotation2 += rotBy;
   rotMat2 = rotate(totalRotation2, ya);

    for ( kk = 0; kk < rotMat1.length ; kk++ )
    {  
        totalRotation1[kk] += orbitSpeed[kk];
        rotMat1[kk] = rotate(totalRotation1[kk], za);
    }

   drawSpheres();

   window.requestAnimFrame( render );
}


