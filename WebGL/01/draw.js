
function main(){
    //获取canvas
    var canvas = document.getElementById("example");
    if(!canvas){
        console.error("there is no canvas");
        return false;
    }
    var gl = getWebGLContext(canvas);
    //指定绘图区域的背景颜色
    gl.clearColor(1,1,0, 1);
    //用之前指定的颜色清空绘图区域
    //将指定的缓冲区设置为预定的值
    gl.clear(gl.COLOR_BUFFER_BIT);
    // console.log("——————————", gl.COLOR_BUFFER_BIT);
}





