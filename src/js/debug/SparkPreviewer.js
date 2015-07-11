// The MIT License (MIT)

// Copyright (c) 2015 Ruggero Enrico Visintin

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE. 

console.log("SparkViewer.js included");

{
    var scriptEls = document.getElementsByTagName('script');
    var thisScriptEl = scriptEls[scriptEls.length - 1];
    var scriptPath = thisScriptEl.src;
    var scriptFolder = scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1);

    console.log(scriptFolder);

    var head = document.getElementsByTagName("head")[0];

    var subFolders = "SparkViewer/";

    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = scriptFolder + "subFolders Renderer.js";

    head.appendChild(js);

    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = scriptFolder + "subFolders glMatrix.js";

    head.appendChild(js);

    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = scriptFolder + "subFolders RendererUtils.js";

    head.appendChild(js);

    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = scriptFolder + "subFolders RenderMaterial.js";

    head.appendChild(js);

    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = scriptFolder + "subFolders RenderMesh.js";

    head.appendChild(js);

    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = scriptFolder + "subFolders RenderModel.js";

    head.appendChild(js);

    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = scriptFolder + "subFolders RenderTypes.js";

    head.appendChild(js);
	
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = scriptFolder + "subFolders/math/Vector2.js";

    head.appendChild(js);

    window.onload = SparkPreviewerMain;
}

function Application(canvas) {
	var mCanvas = canvas;
    var renderer;

    var backgroundColor;
    var renderModel;

    var litShaderProgram;
    var normalShaderProgram;
    var diffuseShaderProgram;
    var fullShaderProgram;
	
	var mProjectionMatrix;
	var mModelViewMatrix;
	
	var running;

    var LIT_VERTEX_SHADER_SOURCE                            	                     =
        "attribute vec2 position;" 								                     +
		//"attribute vec3 normal;" 								                     +
        "attribute vec2 uv;" 									                     +
		"uniform mat4 modelViewProjectionMatrix;" 				                     +
        "varying vec2 outUv;"									                     +
        "void main(void) {" 									                     +
        "   outUv = uv;"        								                     +
		"   vec4 pos = modelViewProjectionMatrix * vec4(position, 0.0, 1.0);"        +
        "   gl_Position = pos;"       	                                             +
        "}"                                                 	                     ;
	
    var LIT_FRAGMENT_SHADER_SOURCE                          	                     =
        "precision highp float;" 								                     +
        "varying vec2 outUv;" 									                     +
        "void main(void) {"                                 	                     +
        "   gl_FragColor = vec4(1.0, outUv.x, outUv.y, 1);" 	                     +
        "}"                                                 	                     ;

    this.init = function () {
        renderer = new Renderer();
        renderer.initWebGL(mCanvas);
        
        initBackground();
        initShaderPrograms();
        initDefaultModel();
        initMatrices();
		
        renderer.program = litShaderProgram;		
        renderer.init();

        // resize the viewport when the window is resized
        window.onresize = onResizeEvent;
		

			
	var vec = Vector2.create();
	var vecb = Vector2.create(2, 2);
	
	var out = Vector2.create(0, 0);
	Vector2.add(vec, 0, out);
	
	console.log("a: " + out[0] + ", " + "b: " + out[1]);



	
    };

    this.run = function () {
		running = true;
        runLoop();
    };
	
	this.stop = function () {
		running = false;
	};
	
	var initMatrices = function () {
        mModelViewMatrix = mat4.create();
        mProjectionMatrix = mat4.create();	
		
		mat4.identity(mModelViewMatrix);
		mat4.translate(mModelViewMatrix, [0, 0, -6]);   	
		
        mat4.perspective(45, mCanvas.clientWidth / mCanvas.clientHeight, 0.1, 100, mProjectionMatrix);
		
		//mat4.ortho(-1.0, 1.0, -1.0, 1.0, 0.1, 100, mProjectionMatrix);
        //mat4.scale(mModelViewMatrix, [0.5, 0.5, 0.5]);
	};

	var initBackground = function() {
		backgroundColor = vec3.create(0.0, 0.0, 0.0);
	};
	
	var initShaderPrograms = function () {
		litShaderProgram = initShaderFromString(LIT_VERTEX_SHADER_SOURCE, LIT_FRAGMENT_SHADER_SOURCE, renderer.getGfx());		
	};
	
	var initDefaultModel = function() {
				
        var vertices = [
                0.0, 1.0, 0.0, 1.0,
                -1.0, -1.0, -1.0, -1.0,
                1.0, -1.0, 1.0, -1.0,
        ];
		
		var renderMesh = new RenderMesh();
        var vbo = renderer.getGfx().createBuffer();

        renderer.getGfx().bindBuffer(renderer.getGfx().ARRAY_BUFFER, vbo);
        renderer.getGfx().bufferData(renderer.getGfx().ARRAY_BUFFER, new Float32Array(vertices), renderer.getGfx().STATIC_DRAW);

        renderMesh.setVertexBufferHandle(vbo);
        renderMesh.setVerticesSet(vertices);        

        var renderMaterial = new RenderMaterial();
        var renderMaterialTexture = loadTextureFromUrl("img/img.png", renderer.getGfx());
        renderMaterial.setDiffuseTextureHandle(renderMaterialTexture);

        var materialColor = vec3.create(0.0, 1.0, 0.0);
        renderMaterial.setDiffuseColor(materialColor);

        renderModel = new RenderModel();
        renderModel.setRenderMesh(renderMesh);
        renderModel.addRenderMaterial(renderMaterial);			
	};
	
	var rotation = 1;
	
	var runLoop = function () {
	
	    var mvp = mat4.create();

		mat4.rotate(mModelViewMatrix, rotation * Math.PI/180, [0.0, 1.0, 0.0], mModelViewMatrix);		
		mat4.multiply(mProjectionMatrix, mModelViewMatrix, mvp);
								
        var drawCall = new DrawCall();
        drawCall.vbo = renderModel.getRenderMesh().getVertexBufferHandle();
        drawCall.shaderProgram = litShaderProgram;
        drawCall.verticesNumber = 3;

		drawCall.matrixMVP = mvp;
		drawCall.mvpLocation = renderer.getGfx().getUniformLocation(litShaderProgram, "modelViewProjectionMatrix");

        renderer.render(0, drawCall);
		
		if(running) {
			window.requestAnimationFrame(runLoop);
		}
	};

	var onResizeEvent = function () {
	    mat4.perspective(45, mCanvas.clientWidth / mCanvas.clientHeight, 0.1, 100, mProjectionMatrix);
	}

    return this;
}

var APPLICATION;

function SparkPreviewerMain() {

    APPLICATION = new Application(document.getElementById("sparkViewer"));
    APPLICATION.init();
    APPLICATION.run();

    return 0;
}

