//顶点着色程序
var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+
'void main() {\n' + 
'   gl_Position = a_Position;\n' +
'   gl_PointSize = 40.0;\n' +
'}\n';
//片元着色器程序
var FSHADER_SOURCE = 
'void main() {\n' + 
'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
'}\n';

/**
 * 绘制多个点
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

    gl.clearColor(1,1,0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
   
}
/**
 * 创建顶点缓冲区对象
 * @param {*} gl 
 * @returns 
 */
function initVertexBuffers(gl){
    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var n = 3;
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



/**
  * 创建一个程序对象并将其设置为当前
  * @param gl GL 上下文
  * @param vshader 顶点着色器程序（字符串）
  * @param fshader 片段着色器程序（字符串）
  * @return 创建一个程序对象，如果当前设置成功则为真
  */
function initShaders(gl, vshader, fshader){
    var program = createProgram(gl, vshader, fshader)
    if(!program){
        console.log("initShder: createprogram faile");
        return null
    }
    gl.useProgram(program);
    gl.program = program;
    return true;
}

/**
  * 创建一个链接的程序对象
  * @param gl GL 上下文
  * @param vshader 顶点着色器程序（字符串）
  * @param fshader 片段着色器程序（字符串）
  * @return 创建的程序对象。 如果创建失败，则为null
  */
function createProgram(gl, vshader, fshader){
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if(!vertexShader || !fragmentShader){
        console.log("createProgram: loadShader failed");
        return null; 
    }
    //创建GL程序对象
    var program = gl.createProgram();
    if(!program){
        console.log("createProgram: gl.createProgram failed");
        return null;
    }
    //设置着色器对象
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //链接程序对象
    gl.linkProgram(program);

    //检查链接结果
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!linked){
        console.error("createprogram: gl.getprogramParameter failed");
        gl.deleteprogram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
    }
    return program;
}
/**
  *着色器着色器对象
  * @param gl GL 上下文
  * @param type 要创建的着色器类型
  * @param 源着色器程序（字符串）
  * @return 创建的着色器对象。 如果创建失败，则为null
  */
function loadShader(gl, type, source){
    //创建着色器
    let shader = gl.createShader(type);
    //设置着色器程序
    gl.shaderSource(shader, source);
    //编译着色器
    gl.compileShader(shader);
    //获取编译结果
    var compileResult = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!compileResult){
        //获取编译错误log
        var log = gl.getShaderInfoLog(shader);
        console.error("loader Shader faile, compile sharder error:", log);
        return null;
    }
    return shader;
}