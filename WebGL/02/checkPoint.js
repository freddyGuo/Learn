//顶点着色程序
var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+
'void main() {\n' + 
'   gl_Position = a_Position;\n' +
'   gl_PointSize = 20.0;\n' +
'}\n';
//片元着色器程序
var FSHADER_SOURCE = 
'precision mediump float;\n'+ //中等精度
'uniform vec4 u_FragColor;\n'+
'void main() {\n' + 
'   gl_FragColor = u_FragColor;\n' +
'}\n';

/**
 * 鼠标点击的位置绘制点
 * 不同位置显示不同的颜色
 * @returns 
 */
function main(){
    var canvas = document.getElementById('example');
    var gl = getWebGLContext(canvas);
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.error("Faile init shaders");
        return;
    }

    //获取attribute变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0){
        console.log('Faile to get attribut a_Position');
        return null;
    }
    //将定点位置传输给attrubute变量
    // gl.vertexAttrib3f(a_Position, 0, 0.4, 0);

    canvas.onmousedown =(ev)=>{
        click(ev, gl, canvas);
    }

    gl.clearColor(1,1,1,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.drawArrays(gl.POINTS, 0, 1);
}

var gPositionList = [];
function click(ev, gl, canvas){
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    //当前整个窗口中的X坐标
    let x = ev.clientX;
    let y = ev.clientY;
    // console.log("x", x, "y", y, "canvas.height", canvas.height,"canvas.with", canvas.width)
    let rect = ev.target.getBoundingClientRect();
    // console.log("rect.top", rect.top, "rect.left", rect.left);
    //rect.left rect.top 为canvas组件在当前窗口的xy坐标
    x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    y = ((canvas.height/2) - (y - rect.top))/ (canvas.height/2);
    // console.log("new x", x, "new y", y);
    gPositionList.push(x);
    gPositionList.push(y);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let len = gPositionList.length;
    for(let i=0; i<len; i+=2){
        gl.vertexAttrib3f(a_Position, gPositionList[i], gPositionList[i+1], 0);
        //这里根据坐标位置显示不同颜色
        gl.uniform4f(u_FragColor, 0.5 + gPositionList[i]/2, 0.5 + gPositionList[i+1]/2, 0.5 + gPositionList[i+1]/2, 1.0)
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

