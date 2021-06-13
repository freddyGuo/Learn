//顶点着色程序
var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+
'uniform mat4 u_xformMatrix;\n'+
'attribute float a_Size;\n' +
'void main() {\n' + 
'   gl_Position = u_xformMatrix * a_Position;\n' +
'   gl_PointSize = a_Size;\n' + 
'}\n';

var FSHADER_SOURCE = 
'void main() {\n' + 
'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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
    var n = initVertextBuffers(gl);
    if(n < 0){
        console.log("Faile to set the positions of vertices");
        return null;
    }
    // rotateAndMove(gl, n); 
    rotateAndMove1(gl, n);   
}



/**
 * 边旋转边移动 使用Matrix4方法
 * @param {*} gl 
 * @param {*} n 
 */
function rotateAndMove1(gl, n){
    var ANGLE = 0;
    var move = 0;
    setInterval(()=>{
        // ANGLE += 10;
        // move  += 0.4/100;        
        var modelMatrix = new Matrix4();
        //设置旋转角度
        modelMatrix.setRotate(ANGLE, 0, 0, 1);
        //设置移动距离
        modelMatrix.translate(move, 0, 0);
        var u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
        gl.uniformMatrix4fv(u_xformMatrix, false, modelMatrix.elements);
        gl.clearColor(1,1,0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, n);
        // gl.drawArrays(gl.LINE_STRIP, 0, n);
        // gl.drawArrays(gl.LINE_LOOP, 0, n);
        // gl.drawArrays(gl.LINES, 0, n);
        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
        // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
        // gl.drawArrays(gl.TRIANGLES, 0, n);
    }, 1000/60)
}

/**
 * 边旋转边移动
 * @param {*} gl 
 * @param {*} n 
 */
 function rotateAndMove(gl, n){
    var ANGLE = 0;
    var move = 0;
    setInterval(()=>{
        ANGLE += 10;
        move  += 0.4/100; 
        let radian = ANGLE * Math.PI / 180;
        let sinB   = Math.sin(radian);
        let cosB   = Math.cos(radian);
        //webGL中的矩阵式列为主序的
        var xFormMatrix = new Float32Array([
            cosB, sinB, 0.0, 0.0,
            -sinB, cosB, 0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            move,  0,  0.0,  1.0 
        ])

        var u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
        // var u_moveformMatrix = gl.getUniformLocation(gl.program, "u_moveformMatrix");
        gl.uniformMatrix4fv(u_xformMatrix, false, xFormMatrix);
        // gl.uniformMatrix4fv(u_moveformMatrix, false, u_xformMatrix);
        gl.clearColor(1,1,0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.POINTS, 0, n);
        // gl.drawArrays(gl.LINE_STRIP, 0, n);
        // gl.drawArrays(gl.LINE_LOOP, 0, n);
        // gl.drawArrays(gl.LINES, 0, n);
        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
        // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }, 1000/60)
}



/**
 * 创建顶点缓冲区对象
 * @param {*} gl 
 * @returns 
 */
function initVertextBuffers(gl){
    var vertices = new Float32Array([
        0.0, 0.0, 
        0.0, 0.5, 
        0.5, 0.5, 
        // 0.5, 0, 
        // -0.2, 0.4, 
        // 0.5, -0.4
    ]);
    var n = vertices.length /2;
    let pointList = [];
    for (let index = 0; index < n; index++) {
        pointList.push(5 +Math.random() * 20);
    }
    var sizes = new Float32Array(pointList);
    
    console.log(sizes);
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("initVertextBuffers: gl create vertexBuffer failed");
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

    var sizeBuffer = gl.createBuffer();
    if(!sizeBuffer){
        console.log("initVertextBuffers: gl create sizeBuffer failed");
        return;
    }

   
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    //获取attribute变量的存储位置
    var a_Size = gl.getAttribLocation(gl.program, "a_Size");
    if(a_Size < 0){
        console.log('Faile to get attribut a_Size');
        return null;
    }

    gl.vertexAttribPointer(a_Size, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Size);

    
   
    return n; 
}
