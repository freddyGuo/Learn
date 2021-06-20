//顶点着色程序
var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+
'attribute vec4 a_Color;\n' +
'uniform mat4 u_ViewMatrix;\n'+
'varying vec4 v_Color;\n' + 
'void main() {\n' + 
'   gl_Position = u_ViewMatrix * a_Position;\n' +
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

    var viewMatrix = new Matrix4();

    document.onkeydown = (ev)=>{
        keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
    }

    draw(gl, n, u_ViewMatrix, viewMatrix);

    
}

var g_near = 0.0, g_far = 0.5;
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    // console.log(ev.keyCode)
    switch(ev.keyCode){
        case 39://右键
            g_near += 0.01;
            break;
        case 37://左键
            g_near -= 0.01;
            break;
        case 38://向上键
            g_far += 0.01;
            break;
        case 40: //向下键
            g_far -= 0.01;
            break;
    }
    draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
    viewMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, g_near, g_far);

    // Set the view matrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}




/**
 * 创建顶点缓冲区对象
 * @param {*} gl 
 * @returns 
 */
function initVertexBuffers(gl){
    var vertices = new Float32Array([
    // Vertex coordinates and color
    0.0,  0.6,  -0.4,  0.4,  1.0,  0.4, // The back green one
    -0.5, -0.4,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.4,  -0.4,  1.0,  0.4,  0.4, 
   
     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0, // The front blue one 
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
    ]);
    var n = 9;
   
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("initVertexBuffers: gl create vertexBuffer failed");
        return -1;
    }
    //将缓冲区对象绑定到对象, gl.ARRAY_BUFFER 表示缓冲区有顶点数据,gl.ELEMENT_ARRAY_BUFFER 表示缓冲区包含顶点索引值
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); 
    //开辟存储空间，向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var fSize = vertices.BYTES_PER_ELEMENT;

    //获取attribute变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0){
        console.log('Faile to get attribut a_Position');
        return null;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, fSize * 6, 0)
    //链接a_Position变量与分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position);  

    
    //获取attribute变量的存储位置
    var a_Color = gl.getAttribLocation(gl.program, "a_Color");
    if(a_Color < 0){
        console.log('Faile to get attribut a_Color');
        return null;
    }

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, fSize * 6, fSize * 6);
    gl.enableVertexAttribArray(a_Color);

    //unbind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
   
    return n; 
}
