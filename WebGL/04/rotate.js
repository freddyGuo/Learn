//顶点着色程序
var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+
'uniform float u_CosB;\n'+
'uniform float u_SinB;\n'+
'void main() {\n' + 
'   gl_Position.x = a_Position.x*u_CosB - a_Position.y * u_SinB;\n' +
'   gl_Position.y = a_Position.x*u_SinB + a_Position.y * u_CosB;\n' +
'   gl_Position.z = a_Position.z;\n' +
'   gl_Position.w = 1.0;\n' +
'}\n';

var FSHADER_SOURCE = 
'void main() {\n' + 
'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
'}\n';

var ANGLE = 0;
/*
 * 旋转物体
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

    setInterval(() => {
        ANGLE += 0;
        var u_CosB = gl.getUniformLocation(gl.program, "u_CosB");
        var u_SinB = gl.getUniformLocation(gl.program, "u_SinB");
        gl.uniform1f(u_CosB, Math.cos(Math.PI * ANGLE / 180));
        gl.uniform1f(u_SinB, Math.sin(Math.PI * ANGLE / 180));

        gl.clearColor(1,1,0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.POINTS, 0, n);
        // gl.drawArrays(gl.LINE_STRIP, 0, n);
        // gl.drawArrays(gl.LINE_LOOP, 0, n);
        // gl.drawArrays(gl.LINES, 0, n);
        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
        // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }, 1000/60);

    
}
/**
 * 创建顶点缓冲区对象
 * @param {*} gl 
 * @returns 
 */
function initVertexBuffers(gl){
    var vertices = new Float32Array([
        0.0, 0.0, 
        0.0, 0.5, 
        0.5, 0.5, 
        0.5, 0, 
        -0.2, 0.4, 
        0.5, -0.4
    ]);
    var n = vertices.length /2;
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("initVertexBuffers: gl create buffer failed");
        return -1;
    }
    //将缓冲区对象绑定到对象, gl.ARRAY_BUFFER 表示缓冲区有顶点数据,gl.ELEMENT_ARRAY_BUFFER 表示缓冲区包含顶点索引值
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); 
    //开辟存储空间，向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


    //获取attribute变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0){
        console.log('Faile to get attribut a_Position');
        return null;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    //链接a_Position变量与分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position);   
    return n; 
}
