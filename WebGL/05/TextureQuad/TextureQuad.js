var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+ 
'attribute vec2 a_TexCoord;\n'+
'varying vec2 v_TexCoord;\n' + 
"void main(){\n" + 
"   gl_Position = a_Position;\n" +
"   v_TexCoord = a_TexCoord;\n" +
"}"

var FSHADER_SOURCE = 
'precision mediump float;\n' +
'uniform sampler2D u_Sampler;\n' +
'varying vec2 v_TexCoord;\n' +  
'void main() {\n' + 
'   gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
'}\n';



function main() {
    var canvas = document.getElementById('example');
    var gl = getWebGLContext(canvas);
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.error("Faile init shaders");
        return;
    }
    //设置顶点位置
    var n = initVertextBuffers(gl);

    if(!initTextures(gl, n)){
        console.error("initTextures error");
        return
    }
}

/**
 * 
 */
function initTextures(gl, n){
    //创建纹理对象
    var texture = gl.createTexture();
    //获取u_Sampler的存储地址
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if(!u_Sampler){
        console.log("initVertextBuffers: gl create u_Sampler failed");
        return -1;
    }
    //创建一个image对象
    var image = new Image();
    image.onload = ()=>{
        loadTexture(gl, n, texture, u_Sampler, image);
    }
    image.src = "./resources/sky1.jpg";
    return true;
}

function loadTexture(gl, n, texture, u_Sampler, image){
    //对纹理图像进行Y轴翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //将0号纹理传递给着色器
    gl.uniform1i(u_Sampler, 0);

    gl.clearColor(1,1,0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}




/**
 * 创建顶点缓冲区对象
 * @param {*} gl 
 * @returns 
 */
 function initVertextBuffers(gl){
    var verticesTexCoords = new Float32Array([
        //顶点左边 //纹理坐标
        -0.5, 0.5,  0.0, 1.0, 
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5,   1.0, 1.0,
        0.5, -0.5,  1.0, 0.0,
    ]);
    var n = 4;
   
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("initVertextBuffers: gl create vertexBuffer failed");
        return -1;
    }
    //将缓冲区对象绑定到对象, gl.ARRAY_BUFFER 表示缓冲区有顶点数据,gl.ELEMENT_ARRAY_BUFFER 表示缓冲区包含顶点索引值
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); 
    //开辟存储空间，向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var fSize = verticesTexCoords.BYTES_PER_ELEMENT;

    //获取attribute变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0){
        console.log('Faile to get attribut a_Position');
        return null;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, fSize * 4, 0)
    //链接a_Position变量与分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position);  

    
    //获取attribute变量的存储位置
    var a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
    if(a_TexCoord < 0){
        console.log('Faile to get attribut a_TexCoord');
        return null;
    }

    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, fSize * 4, fSize * 2);
    gl.enableVertexAttribArray(a_TexCoord);
    return n; 
}


