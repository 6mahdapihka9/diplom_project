
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
            //TODO

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



const test = ()=>{
    document.getElementsByName("typeToEvaluate").forEach((el)=>{
        if (el.checked)
            console.log(el.value);
    });
};


