//顶点着色程序
var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+
'attribute vec4 a_Color;\n' +
'uniform mat4 u_ViewMatrix;\n'+
'uniform mat4 u_ProjMatrix;\n'+
'varying vec4 v_Color;\n' + 
'void main() {\n' + 
'   gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n' +
'   v_Color = a_Color;\n' +
'}\n';

var FSHADER_SOURCE = 
'precision mediump float;\n' +
'varying vec4 v_Color;\n' + 
'void main() {\n' + 
'   gl_FragColor = v_Color;\n' +
'}\n';


/*
 * 通过矩阵方法实现旋转并移动物体
 * @returns 
 */
 function main(){
    var canvas = document.getElementById('example');
    var gl = getWebGLContext(canvas);
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.error("Faile init shaders");
        return;
    }
    //设置顶点位置
    var n = initVertexBuffers(gl);
    if(n < 0){
        console.log("Faile to set the positions of vertices");
        return null;
    }
    //清除背景颜色
    gl.clearColor(0, 0, 0, 1);

    var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    if(!u_ViewMatrix){
        console.log("fuck you, failed to get the storage locations of u_ViewMatrix");
    }

    var u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
    if(!u_ProjMatrix){
        console.log("fuck you, failed to get the storage locations of u_ProjMatrix");
    }

    var viewMatrix = new Matrix4();　// The view matrix
    var projMatrix = new Matrix4();  // The projection matrix

    // calculate the view matrix and projection matrix
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width/canvas.height, 0, 100);
    // Pass the view and projection matrix to u_ViewMatrix, u_ProjMatrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, n);
    
}



/**
 * 创建顶点缓冲区对象
 * @param {*} gl 
 * @returns 
 */
 function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
      // Three triangles on the right side
      0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
      0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
      1.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 
  
      0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
      0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
      1.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 
  
      0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
      0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
      1.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
  
      // Three triangles on the left side
     -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
     -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
     -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 
  
     -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
     -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
     -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 
  
     -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
     -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
     -0.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
    ]);
    var n = 18; // Three vertices per triangle * 6
  
    // Create a buffer object
    var vertexColorbuffer = gl.createBuffer();  
    if (!vertexColorbuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Write the vertex coordinates and color to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  
    // Assign the buffer object to a_Position and enable the assignment
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
  
    // Assign the buffer object to a_Color and enable the assignment
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
    }
  
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
  
    return n;
  }
