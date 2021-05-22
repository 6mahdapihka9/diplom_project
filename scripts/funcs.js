//INPUT IMAGE
const inputImage = (input)=>{
    clear();
    try{
        let file = input.files[0];
        let reader = new FileReader();
        let src = "";
        reader.readAsDataURL(file);
        reader.onload = () => { if (typeof(reader.result) === "string") src = reader.result; };
        reader.onloadend = () => { loadImg(src); };
        reader.onerror = () => { alert(reader.error); };
    } catch (e) {
        console.log( e );
    }
};
const loadImg = (_src)=>{
    let img = new Image();
    img.src = _src;
    img.onload = ()=>{
        if (img.width < 10 || img.height < 10)
            return;
        algC.width = relC.width = imgW = img.width;
        algC.height = relC.height = imgH = img.height;

        relCtx.drawImage(img, 0, 0, relC.width, relC.height);

        Array.from(document.getElementsByClassName("operations"))
            .filter(op => op.id!=="clearButton" && op.id!=="inputImage")
            .map(op => {op.classList.add("disabled")});

        getById("prepare").classList.remove("disabled");
        IMAGE = img;
        inputedRelief = false
    }
};


//INPUT RELIEF
const inputRelief = (input)=>{
    clear();
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        Triangles = [];
        maxHeight = 0;
        minHeight = 256;
        Dots = JSON.parse(reader.result);

        relC.width = Dots[0][Dots[0].length-1].x;
        relC.height = Dots[Dots.length-1][0].y;

        for (let i = 0; i < relC.height; i++) {
            if (i < relC.height-1)
                Triangles[i] = [];

            for (let j = 0; j < relC.width; j++) {
                let h = Dots[i][j].z;
                maxHeight = (h > maxHeight) ? h : maxHeight;
                minHeight = (h < minHeight) ? h : minHeight;
            }
        }
        creationOfRelief();
    }
    reader.onloadend = () => {
        inputedRelief = true;

        drawAllTriangles();

        getById("prepare").classList.remove("disabled");
        getById("exportReliefDiv").classList.remove("disabled");
        getById("inputDots").classList.remove("disabled");
    };
    reader.onerror = function() {
        alert(reader.error);
    };
};


//CROP AND ACCURE
const changeAccuracy = (htmlEl)=>{
    // console.log(+htmlEl.value);
    if (+htmlEl.value < ((imgW>imgH)?imgH:imgW) && +htmlEl.value > 0 )
        accuracy = +htmlEl.value;
    else
        accuracy = htmlEl.value = 5;
};
const cropSmooth = ()=>{
    if (inputedRelief) {
        algC.width = relC.width = imgW = Dots[0][Dots[0].length-1].x * accuracy;
        algC.height = relC.height = imgH = Dots[Dots.length-1][0].y * accuracy;
    }

    if (imgW - imgW % accuracy + 1 <= imgW)
        algC.width = relC.width = imgW - imgW % accuracy + 1;
    else
        algC.width = relC.width = imgW - imgW % accuracy + 1 - accuracy;

    if (imgH - imgH % accuracy + 1 <= imgH)
        algC.height = relC.height = imgH - imgH % accuracy + 1;
    else
        algC.height = relC.height = imgH - imgH % accuracy + 1 - accuracy;

    if (!inputedRelief) {
        relCtx = relC.getContext("2d");
        relCtx.drawImage(IMAGE, 0, 0, relC.width, relC.height);
    } else {
        drawAllTriangles();
    }


    Array.from(document.getElementsByClassName("operations"))
        .filter(op => op.id!=="clearButton" && op.id!=="inputImage")
        .map(op => {op.classList.add("disabled")});

    if (!inputedRelief) {
        getById("prepare").classList.remove("disabled");
        getById("triangulation").classList.remove("disabled");
        getById("exportReliefDiv").classList.remove("disabled");
    } else {
        getById("prepare").classList.remove("disabled");
        getById("exportReliefDiv").classList.remove("disabled");
        getById("inputDots").classList.remove("disabled");
    }

};


//TRIANGULATION
const getPixel = ()=>{
    let pixel = relCtx.getImageData(relC.width/2, relC.height/4, 1, 1);
    let data = pixel.data;
    let rgba = 'rgba(' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + (data[3] / 255) + ')';
    console.log(rgba);
};
const triangulation = ()=>{
    //To gray
    let pixels = relCtx.getImageData(0,0, relC.width, relC.height);
    let data = pixels.data;

    changeAccuracy(getById("accuracy"));
    cropSmooth();

    Dots = [];
    Triangles = [];
    maxHeight = 0;
    minHeight = 256;

    for (let i = 0, I = 0; i < relC.height; i+=accuracy, I++) {
        Dots[I] = [];
        if (i < relC.height-1)
            Triangles[I] = [];

        for (let j = 0, J = 0, k = i*relC.width; j < relC.width; j+=accuracy, J++, k+=accuracy) {
            let h = (data[k * 4] + data[k * 4 + 1] + data[k * 4 + 2]) / 3;
            maxHeight = (255 - h > maxHeight)? 255 - h: maxHeight;
            minHeight = (255 - h < minHeight)? 255 - h: minHeight;

            Dots[I][J] = new Dot(J, I, 255 - h);
            // console.log("i ",i," I ",I," j ",j," J ",J," k ",k*4);
        }
    }


    creationOfRelief();

    drawAllTriangles();

    getById("exportReliefDiv").classList.remove("disabled");
    getById("inputDots").classList.remove("disabled");


    getById("triangulation").classList.add("disabled");
};
const creationOfRelief = ()=>{
    for (let i = 0; i < Dots.length-1; i++)
        for (let j = 0; j < Dots[i].length-1; j++){
            // console.log(i,j);
            let middleDot = new Dot((Dots[i][j].x + Dots[i+1][j+1].x)/2,
                (Dots[i][j].y + Dots[i+1][j+1].y)/2,
                (Dots[i][j].z + Dots[i+1][j].z + Dots[i+1][j+1].z + Dots[i][j+1].z)/4
            );

            Triangles[i][j] = [
                new Triangle(Dots[i][j], Dots[i][j+1], middleDot),
                new Triangle(Dots[i][j+1], Dots[i+1][j+1], middleDot),
                new Triangle(Dots[i+1][j+1], Dots[i+1][j], middleDot),
                new Triangle(Dots[i+1][j], Dots[i][j], middleDot)
            ];
        }
};
const drawAllTriangles = ()=>{

    relCtx.fillStyle = "white";
    relCtx.fillRect(0,0, relC.width, relC.height);

    for (let i in Triangles)
        for (let j in Triangles[i])
            for (let t in Triangles[i][j])
                drawTriangle(Triangles[i][j][t], true);
};


//EXPORT RELIEF
const reliefExport = ()=>{
    if (Triangles !== []) {
        let filename = "relief.txt";
        let text = JSON.stringify(Dots, null, 4);
        // let text = JSON.stringify(Triangles);
        // console.log(Dots);
        let blob = new Blob([text], {type: 'text/plain'});
        let exp = getById("exportRelief");
        exp.download = filename;
        exp.href = window.URL.createObjectURL(blob);
    }
}


//INPUT DOTS
const allowInput = (doInputWithCursor)=>{
    allowToInputDotsByCursor = doInputWithCursor.checked;
};
const changeZOfInput = (zInput)=>{
    console.log(zInput.value);
    zOfInputedDot = (+zInput.value > 0)? +zInput.value : zInput.value = 10;
};
const inputDots = (input)=>{
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        let arrayStrs = reader.result.split("\n");
        for (let key in arrayStrs) {
            if (arrayStrs[key] !== "") {
                let coords = arrayStrs[key].split(" ");
                if (coords.length === 3 &&
                    typeof (+coords[0]) === "number" &&
                    typeof (+coords[1]) === "number" &&
                    typeof (+coords[2]) === "number") {
                    let newDot = new Dot(+coords[0], +coords[1], +coords[2]);
                    DTC.push(newDot);
                } else {
                    alert("Incorrect data!");
                    break;
                }
            }
        }
    };
    reader.onloadend = () => {
        updateDotsInCheckPath();
        drawDotsToCover();
    };
    reader.onerror = function() {
        alert(reader.error);
    };
};
const updateDotsInCheckPath = ()=>{
    let opsTxt = "";
    for (let d in DTC)
        opsTxt += "<option value=" + d + ">" +
            "("+DTC[d].x+";"+DTC[d].y+";"+DTC[d].z+")" +
            "</option>";

    getById("dot1").innerHTML = opsTxt;
    getById("dot2").innerHTML = opsTxt;
    // getById("buildGlobalSphere").classList.remove("disabled");
    [getById("buildGlobalSphere"),
        getById("buildManySpheres"),
        getById("checkPath")].map(el => el.classList.remove("disabled"));
};
algC.onmousedown = (e) => {
    if (allowToInputDotsByCursor) {
        let x = +e.offsetX, y = +e.offsetY;
        DTC.push(new Dot(x, y, zOfInputedDot));
        drawDot(new Dot(x, y, ))
        drawCircle(x, y, 2, null,"black",true);
        updateDotsInCheckPath();
    }
};


//BUILD GLOBAL SPHERE
const buildGlobalSphere = ()=>{
    //two dots
    //выбор двух опорных точок между которыми самое большое растояние, чтобы построить на них окружность
    let k = 0, m = 0, n = 0;
    let max = 0;
    let newDist;
    dist = [];
    minDistGlob = 100000000;
    for (let i = 0; i < DTC.length-1; i++)
        for (let j = i+1; j < DTC.length; j++) {
            newDist = new Dist(DTC[i], DTC[j]);

            if (newDist.value < minDistGlob)
                minDistGlob = newDist.value;

            dist.push(newDist);
            if (max < dist[k].value) {
                max = dist[k].value;
                m = i;
                n = j;
            }
            k++;
        }

    console.log(DTC[m], DTC[n]);
    tempX = (DTC[m].x + DTC[n].x)/2;
    tempY = (DTC[m].y + DTC[n].y)/2;
    tempZ = (DTC[m].z + DTC[n].z)/2;
    tempR = (new Dist(DTC[m], DTC[n])).value/2;
    enoughOne = true;
    //проверка все ли точки входят в этот круг
    for (let i = 0; i < DTC.length; i++)
        if ((new Dist(DTC[i], new Dot(tempX, tempY, tempZ))) >
            Math.round(tempR * tempR * 100000000.0) / 100000000.0 + 0.0001) {
            enoughOne = false;
            break;
        }

    Cx = tempX; Cy = tempY; Cz = tempZ; R = tempR;
    globalSphere = new Sphere(Cx, Cy, Cz, R);

    console.log(R, enoughOne);
    //three dots
    if (!enoughOne) {
        console.log("two are not enough");
        let threeR = max, threeX = 0, threeY = 0, threeZ = 0;
        for (let n = 0; n < DTC.length-2; n++)
            for (let m = n+1; m < DTC.length-1; m++)
                for (let l = m+1; l < DTC.length; l++) {
                    let dmx2 = DTC[m].x * DTC[m].x;
                    let dmy2 = DTC[m].y * DTC[m].y;

                    let dlx2 = DTC[l].x * DTC[l].x;
                    let dly2 = DTC[l].y * DTC[l].y;

                    let dnx2 = DTC[n].x * DTC[n].x;
                    let dny2 = DTC[n].y * DTC[n].y;
                    Cx = -(DTC[n].y * (dmx2 + dmy2 - dlx2 - dly2) +
                        DTC[m].y * (dlx2 + dly2 - dnx2 - dny2) +
                        DTC[l].y * (dnx2 + dny2 - dmx2 - dmy2)) /
                        (2 * (DTC[n].x * (DTC[m].y - DTC[l].y) +
                            DTC[m].x * (DTC[l].y - DTC[n].y) +
                            DTC[l].x * (DTC[n].y - DTC[m].y)));

                    Cy = (DTC[n].x * (dmx2 + dmy2 - dlx2 - dly2) +
                        DTC[m].x * (dlx2 + dly2 - dnx2 - dny2) +
                        DTC[l].x * (dnx2 + dny2 - dmx2 - dmy2)) /
                        (2 * (DTC[n].x * (DTC[m].y - DTC[l].y) +
                            DTC[m].x * (DTC[l].y - DTC[n].y) +
                            DTC[l].x * (DTC[n].y - DTC[m].y)));

                    let newTr = new Triangle(DTC[l], DTC[m], DTC[n]);
                    let tZ = newTr.simpleOperation(new Dot(Cx, Cy, -1000), new Dot(Cx, Cy, 1000));
                    if (tZ !== false)
                        R = (new Dist(tZ, DTC[n])).value/2;
                    else
                        continue;


                    enoughOne = true;
                    for (let iter = 0; iter < DTC.length; iter++)
                        if ((new Dist(DTC[iter], tZ)).value/2 >
                            Math.round(R * R * 100000000.0)/100000000.0 + 0.0001) {
                            enoughOne = false;
                            break;
                        }

                    if (enoughOne && R < threeR) {
                        threeX = Cx;
                        threeY = Cy;
                        threeZ = tZ.z;
                        threeR = R;
                    }
                }
        Cx = threeX;	Cy = threeY;	Cz = threeZ;	R = threeR;
    }

    globalSphere = new Sphere(Cx, Cy, Cz, R);
    redraw();
};


//BUILD MAY SMALL SPHERES
const changeRadius = (radiusInput)=>{
    smallR = (+radiusInput.value > 1)? +radiusInput.value : radiusInput.value = 50;
};
const buildManySpheres = ()=>{

};


//CHECK PATH BETWEEN TWO DOTS
const checkPath = ()=>{
    let d1 = DTC[Array.from(getById("dot1").options)
        .filter(option => option.selected)
        .map(option => option.value)[0]],
        d2 = DTC[Array.from(getById("dot2").options)
            .filter(option => option.selected)
            .map(option => option.value)[0]];

    if (d1 && d2 && d1 !== d2){
        if (Math.abs(d2.x-d1.x) > Math.abs(d2.y-d1.y)){

            // console.log(d1,d2);

            let startD = (d1.x > d2.x)? d2 : d1,
                endD = (d1.x < d2.x)? d2 : d1;
            for (let i = startD.x; i < endD.x; i++){
                let j = startD.y + ((i-startD.x)/(endD.x-startD.x))*(endD.y-startD.y);
                // console.log(j, i, Math.floor(j / accuracy), Math.floor(i/ accuracy));
                // console.log(Triangles[Math.floor(j / accuracy)][Math.floor(i / accuracy)]);
                let TBlock = Triangles[Math.floor(j / accuracy)][Math.floor(i / accuracy)]
                for (let t in TBlock){
                    // console.log(TBlock[t]);
                    drawTriangle(TBlock[t],true,"black");
                    console.log(TBlock[t].simpleOperation(d1, d2));;
                }
            }

        } else {

        }
    } else {
        alert("You should choose two different dots!");
    }

};

//REDRAW
const redraw = ()=>{
    algCtx.clearRect(0,0, algC.width, algC.height);
    drawDotsToCover();
    drawGlobalSphere();
    // drawManySpheres();
};




// const changeInput = (bool)=>{
//     console.log(bool);
//     if (bool){
//         getById("platoDiv").innerHTML = "";
//         buildSpikeDiv();
//     } else {
//         getById("spikeDiv").innerHTML = "";
//         buildPlatoDiv();
//     }
// };
// const buildSpikeDiv = ()=>{
//     console.log(numberOfSpikesControlDots);
//     let div = getById("spikeDiv");
//     div.innerHTML = "<label>Number of control dots: <input id='nSpikesCD' type='text' onchange='numberOfSpikesControlDots = (this.value > 2)?this.value:3; buildSpikeDiv();'></label>";
//     div.innerHTML += buildInputOfDot("Spike");
//     for (let i = 0; i < numberOfSpikesControlDots; i++)
//         div.innerHTML += buildInputOfDot(i);
//
//     div.innerHTML +=    "<button onclick='addSpike()'>" +
//                             "Add Spike" +
//                         "</button>";
//     // console.log(div);
// };
// const buildPlatoDiv = ()=>{
//     let div = getById("platoDiv");
//
//
//
// };
// const buildInputOfDot = (_id)=>{
//     return "<div>Dot[" + _id + "]: " +
//                 "<label>" +
//                     "x" +
//                     "<input type='text' id='" + _id + "x'>" +
//                 "</label>" +
//                 "<label>" +
//                     "y" +
//                     "<input type='text' id='" + _id + "y'>" +
//                 "</label>" +
//                 "<label>" +
//                     "z" +
//                     "<input type='text' id='" + _id + "z'>" +
//                 "</label>" +
//             "</div>";
// };
// const getDot = (_id)=>{
//     return new Dot(getById(_id+"x").value, getById(_id+"y").value, getById(_id+"z").value);
// };
//
// const addSpike=()=>{
//     let spike = getDot("Spike"), controlDots = [];
//     for (let i = 0; i < numberOfSpikesControlDots; i++) {
//         controlDots.push(getDot(i));
//         if (i > 0){
//             if (i === numberOfSpikesControlDots-1){
//                 // controlDots[]
//             } else {
//                 // controlDots[i-1]
//             }
//         }
//     }
//     // console.log(_t);
// };

/*
function built() {
    blankCanvas();
    circles = [];
    dist = [];
    if (d.length >= 1) {
        if (form.builtOne.checked)
            builtOne();
    }
    if (d.length >= 2){
        if (form.builtMany.checked)
            builtMany();
    }
    redraw();
    statsDiv.hidden = false;
    removeDivStats();
}

function builtMany(){
    smallR = +form.radius.value;
    let newCircle;
    let maxDotsCoveredDist = 0, maxDotsCoveredTri = 0, circleToAdd = 0, dotsLeft = d.length, radiusEnough = (smallR > minDistGlob) ;

    for (let j = 0; j < d.length; j++) d[j].covered = false;
    for (let j = 0; j < dist.length; j++) dist[j].used = false;
    while(dotsLeft > 0){
        if (radiusEnough) {
            let tX, tY;
            for (let n = 0; n < d.length-2; n++)
                for (let m = n+1; m < d.length-1; m++)
                    for (let l = m+1; l < d.length; l++) {
                        tX = -(d[n].y * (d[m].x * d[m].x + d[m].y * d[m].y - d[l].x * d[l].x - d[l].y * d[l].y) + d[m].y * (d[l].x * d[l].x + d[l].y * d[l].y - d[n].x * d[n].x - d[n].y * d[n].y) + d[l].y * (d[n].x * d[n].x + d[n].y * d[n].y - d[m].x * d[m].x - d[m].y * d[m].y)) / (2 * (d[n].x * (d[m].y - d[l].y) + d[m].x * (d[l].y - d[n].y) + d[l].x * (d[n].y - d[m].y)));
                        tY = (d[n].x * (d[m].x * d[m].x + d[m].y * d[m].y - d[l].x * d[l].x - d[l].y * d[l].y) + d[m].x * (d[l].x * d[l].x + d[l].y * d[l].y - d[n].x * d[n].x - d[n].y * d[n].y) + d[l].x * (d[n].x * d[n].x + d[n].y * d[n].y - d[m].x * d[m].x - d[m].y * d[m].y)) / (2 * (d[n].x * (d[m].y - d[l].y) + d[m].x * (d[l].y - d[n].y) + d[l].x * (d[n].y - d[m].y)));

                        newCircle = new Circle(tX, tY);

                        for (let j = 0; j < d.length; j++)
                            if (!d[j].covered && (Math.pow(d[j].x - newCircle.x, 2) + Math.pow(d[j].y - newCircle.y, 2)) <= Math.round(smallR * smallR * 100000000.0) / 100000000.0 + 0.0001)
                                newCircle.dotsCovered++;

                        if (newCircle.dotsCovered > maxDotsCoveredDist && newCircle.dotsCovered > maxDotsCoveredTri) {
                            circleToAdd = newCircle;
                            maxDotsCoveredTri = newCircle.dotsCovered;
                        }
                    }

            for (let i = 0; i < dist.length; i++) {
                tX = (dist[i].dot1.x + dist[i].dot2.x) / 2;
                tY = (dist[i].dot1.y + dist[i].dot2.y) / 2;
                newCircle = new Circle(tX, tY);
                for (let j = 0; j < d.length; j++)
                    if (!d[j].covered && (Math.pow(d[j].x - newCircle.x, 2) + Math.pow(d[j].y - newCircle.y, 2)) <= Math.round(smallR * smallR * 100000000.0) / 100000000.0 + 0.0001)
                        newCircle.dotsCovered++;

                if (newCircle.dotsCovered > maxDotsCoveredDist && newCircle.dotsCovered > maxDotsCoveredTri) {
                    circleToAdd = newCircle;
                    maxDotsCoveredDist = newCircle.dotsCovered;
                }
            }
            let minusDots;
            if ((minusDots = (maxDotsCoveredDist > maxDotsCoveredTri)? maxDotsCoveredDist : maxDotsCoveredTri) > 1) {
                circles.push(circleToAdd);
                dotsLeft -= minusDots;
                for (let j = 0; j < d.length; j++)
                    if ((Math.pow(d[j].x - circleToAdd.x, 2) + Math.pow(d[j].y - circleToAdd.y, 2)) <= Math.round(smallR * smallR * 100000000.0) / 100000000.0 + 0.0001) {
                        d[j].covered = true;
                        d[j].coveredBy = circleToAdd;
                    }
                maxDotsCoveredDist = 0;
                maxDotsCoveredTri = 0;
            } else
                radiusEnough = false;
        } else {
            for (let j = 0; j < d.length; j++)
                if (!d[j].covered){
                    newCircle = new Circle();
                    newCircle.x = d[j].x;
                    newCircle.y = d[j].y;
                    newCircle.dotsCovered = 1;
                    circles.push(newCircle);
                    d[j].covered = true;
                    d[j].coveredBy = newCircle;
                }
            break;
        }
    }

    statsExport();
}
*/


