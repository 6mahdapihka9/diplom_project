let isDotInsideTriangle = (a, b, c, d)=>{
    return isDotsOnTheSameSide(a,b,c,d) && isDotsOnTheSameSide(b,c,a,d) && isDotsOnTheSameSide(c,a,b,d);
};
// Лежат ли точки C и D с одной стороны прямой (AB)?
const isDotsOnTheSameSide = (a, b, c, d)=>{
    return positionOfDot(a, b, c) * positionOfDot(a, b, d) >= 0;
};
// Вычисляет положение точки D(xd,yd) относительно прямой AB
const positionOfDot = (a, b, d)=>{
    return (d.x - a.x) * (b.y - a.y) - (d.y - a.y) * (b.x - a.x);
};
const determinant = (a11, a12, a13, a21, a22, a23, a31, a32, a33)=>{
    //(m)=>{//matrix
    // return m[0][0]*m[1][1]*m[2][2] + m[0][1]*m[1][2]*m[2][0] + m[0][2]*m[1][0]*m[2][1] -
    //         m[0][2]*m[1][1]*m[2][0] - m[0][1]*m[1][0]*m[2][2] - m[0][0]*m[1][2]*m[2][1];
    return a11*a22*a33 + a12*a23*a31 + a13*a21*a32
        - a13*a22*a31 - a12*a21*a33 - a11*a23*a32;
}
const drawTriangle = (t, fill, color)=>{
    relCtx.strokeStyle = "black";
    relCtx.beginPath();
    relCtx.moveTo(t.a.x*accuracy, t.a.y*accuracy);
    relCtx.lineTo(t.b.x*accuracy, t.b.y*accuracy);
    relCtx.lineTo(t.c.x*accuracy, t.c.y*accuracy);
    relCtx.lineTo(t.a.x*accuracy, t.a.y*accuracy);
    if (fill) {
        relCtx.fillStyle = linerGrad(t.a, t.b, t.c);

        if (color)
            relCtx.fillStyle = color;
        relCtx.fill();
    } else
        relCtx.stroke();
    relCtx.closePath();
};
const drawLine = (a, b)=>{
    algCtx.strokeStyle = "red";
    algCtx.beginPath();
    algCtx.moveTo(a.x*accuracy, a.y*accuracy);
    algCtx.lineTo(b.x*accuracy, b.y*accuracy);
    algCtx.stroke();
    algCtx.closePath();
};

const drawCircle = (x, y, r, fill, color, clear)=>{
    if (color){
        algCtx.strokeStyle = color;
        algCtx.fillStyle = color;
    } else {
        algCtx.strokeStyle = "black";
        algCtx.fillStyle = "green";
    }
    algCtx.beginPath();
    if (clear){
        algCtx.beginPath();
        algCtx.arc(x , y , r, 0, Math.PI * 2, true);
    } else {
        // ctx.moveTo(x * accuracy, y * accuracy);
        algCtx.beginPath();
        algCtx.arc(x * accuracy, y * accuracy, r, 0, Math.PI * 2, true);
    }
    if (fill)
        algCtx.fill();
    else
        algCtx.stroke();
    algCtx.closePath();
};
const drawDot = (d)=>{
    if(d.covered){

        algCtx.fillStyle = "green";
        algCtx.beginPath();
        algCtx.arc(d.x * accuracy, d.y * accuracy, 2, 0, Math.PI * 2, true);
        algCtx.stroke();
        algCtx.closePath();

    } else {

        algCtx.strokeStyle = "black";
        algCtx.beginPath();
        algCtx.moveTo(d.x * accuracy - 2, d.y * accuracy - 2);
        algCtx.lineTo(d.x * accuracy + 2, d.y * accuracy + 2);
        algCtx.stroke();
        algCtx.closePath();

        algCtx.beginPath();
        algCtx.moveTo(d.x * accuracy + 2, d.y * accuracy - 2);
        algCtx.lineTo(d.x * accuracy - 2, d.y * accuracy + 2);
        algCtx.stroke();
        algCtx.closePath();

    }
};
const drawDotsToCover = ()=>{
    if (DTC.length > 0)
        for (let d in DTC)
            drawDot(DTC[d]);
            // drawCircle(DTC[d].x, DTC[d].y, 2,null, "black", true);

};
const drawGlobalSphere = ()=>{
    drawCircle(Cx, Cy, 1,null, "blue", true);
    drawCircle(Cx, Cy, R,null, "blue", true);
};


//GRADIENT
const linerGrad = (a,b,c)=>{
    let min, mid, max;

    if (a.z > b.z){
        if (b.z > c.z){
            min = c;
            mid = b;
            max = a;
        } else {
            min = b;
            if (a.z > c.z) {
                max = a;
                mid = c;
            } else {
                max = c;
                mid = a;
            }
        }
    } else {
        if (a.z > c.z){
            min = c;
            mid = a;
            max = b;
        } else {
            min = a;
            if (b.z > c.z) {
                max = b;
                mid = c;
            } else {
                max = c;
                mid = b;
            }
        }
    }

    min.z = Math.floor(min.z);
    mid.z = Math.floor(mid.z);
    max.z = Math.floor(max.z);

    let liner = relCtx.createLinearGradient(min.x*accuracy, min.y*accuracy, max.x*accuracy, max.y*accuracy);
    let half = maxHeight/2;

    liner.addColorStop(0, createRGBA(min.z));
    liner.addColorStop(0.5, createRGBA(mid.z));
    liner.addColorStop(1, createRGBA(max.z));

    // console.log(min.z, mid.z, max.z);

    return liner;
};
const createRGBA = (z)=>{
    let rgbaTxt = "rgba(", h, val = 0;
    if (scaledMinH && scaledMinH < 0){
        //TODO
        //scaling for above sealevel and under sealevel
        h = (maxHeight-minHeight)/4;
        if (z-minHeight >= 0 && z-minHeight < h){

            rgbaTxt += "0," + Math.floor(((z-minHeight)/h)*255) + ",255";

        } else if (z-minHeight >= h && z-minHeight < 2*h){

            rgbaTxt += "255,0," + Math.floor(255-((z-minHeight-h)/h)*255);

        } else if (z-minHeight >= 2*h && z-minHeight < 3*h){

            rgbaTxt += Math.floor(((z-minHeight-2*h)/h)*255) + ",255,0";

        } else if (z-minHeight >= 3*h && z-minHeight <= 4*h){

            rgbaTxt += "255," + Math.floor(255-((z-minHeight-h*3)/h)*255) + ",0";

        }
    } else {
        h = (maxHeight-minHeight)/2;
        // val = ((z-minHeight)/h)*255;
        // if (z-minHeight >= 0 && z-minHeight < h){
        if ( z-minHeight < h){

            rgbaTxt += Math.floor(((z-minHeight)/h)*255) + ",255,0";

        // } else if (z-minHeight >= h && z-minHeight <= 2*h){
        } else if (z-minHeight >= h ){
            rgbaTxt += "255," + Math.floor(255-((z-minHeight-h)/h)*255) + ",0";

        }
    }
    // console.log(z, minHeight, maxHeight, Math.floor(((z - minHeight-h) / h) * 255));

    return rgbaTxt + ",1)";
};






/*
let mouse = {
    xPm : 0,
    yPm : 0,
    xPd : 0,
    yPd : 0,
    xNow: 0,
    yNow: 0,
    xReleased : 0,
    yReleased : 0,
    down: false
};
C.onmousedown = (e) => {
    mouse.xPm = e.offsetX;
    mouse.yPm = e.offsetY;
    mouse.xPd = (e.offsetX - xTranslated) / scaleRate;
    mouse.yPd = (e.offsetY - yTranslated) / scaleRate;
    mouse.down = true;
    if (inputByYourself.style.backgroundColor === "lightblue") {
        let newDot = new Dot(mouse.xPd, mouse.yPd);
        d.push( newDot );
        CTX.strokeStyle = 'red';
        CTX.beginPath();
        CTX.arc(mouse.xPd, mouse.yPd, 2, 0, Math.PI*2, true);
        CTX.stroke();
        dataExport();
        unButton.disabled = false;
        eventHappened.push("dotAdded");
    }
};
C.onmousemove = (e) => {
    pX.textContent = "x: " + (e.offsetX - xTranslated) / scaleRate;
    pY.textContent = "y: " + (e.offsetY - yTranslated) / scaleRate;
    if (mouse.down && moveButton.style.backgroundColor === "lightblue") {
        mouse.xNow = e.offsetX;
        mouse.yNow = e.offsetY;
        xTranslateTo = mouse.xReleased + mouse.xNow - mouse.xPm;
        yTranslateTo = mouse.yReleased + mouse.yNow - mouse.yPm;
        blankCanvas();
        redraw();
    }
};
C.onmouseup = () => {
    mouse.xReleased = xTranslated;
    mouse.yReleased = yTranslated;
    mouse.down = false;
};
*/