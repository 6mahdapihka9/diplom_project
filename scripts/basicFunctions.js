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
        relCtx.fillStyle = (color)? color : linerGrad(t.a, t.b, t.c) ;

        relCtx.fill();
    } else
        relCtx.stroke();
    relCtx.closePath();
};
const drawAllTriangles = ()=>{
    relCtx.fillStyle = "white";
    relCtx.fillRect(0,0, relC.width, relC.height);
    for (let i of Triangles)
        for (let j of i)
            for (let t of j)
                drawTriangle(t, true);
};
const drawLine = (xs, ys, xe, ye, color)=>{
    algCtx.strokeStyle = color;
    algCtx.beginPath();
    algCtx.moveTo(xs, ys);
    algCtx.lineTo(xe, ye);
    algCtx.stroke();
    algCtx.closePath();
};

const drawCircle = (x, y, r, color)=>{
    algCtx.strokeStyle = color;
    algCtx.beginPath();
    algCtx.arc(x , y , r, 0, Math.PI * 2, true);
    algCtx.stroke();
    algCtx.closePath();
};
const drawDot = (d)=>{
    if(d.covered && !d.underSurface){
        drawCircle(d.x, d.y, 2, "black");
    } else {
        drawLine(d.x - 2, d.y - 2, d.x + 2, d.y + 2, "black");
        drawLine(d.x + 2, d.y - 2, d.x - 2, d.y + 2, "black");
    }
};
const drawDotsToCover = ()=>{
    if (DTC.length > 0)
        for (let d of DTC)
            drawDot(d);
};
const drawGlobalSphere = ()=>{
    drawCircle(GS.x, GS.y, 2, "brown");
    drawLine(GS.x - 3, GS.y - 3, GS.x + 3, GS.y + 3, "brown");
    drawLine(GS.x + 3, GS.y - 3, GS.x - 3, GS.y + 3, "brown");

    drawCircle(GS.x, GS.y, GS.r, "blue");
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
