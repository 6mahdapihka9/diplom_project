//INPUT DOTS
const addDot = ()=>{
    let x = +getById("x").value, y = +getById("y").value, z = +getById("z").value;
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        let newDot = new Dot(x, y, z);
        DTC.push(newDot);
        drawDot(newDot);
        updateDotsInCheckPath();
    }
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

                    if (!isNaN(+coords[0]) && !isNaN(+coords[1]) && !isNaN(+coords[2])) {

                        let newDot = new Dot(+coords[0], +coords[1], +coords[2]);
                        DTC.push(newDot);
                        drawDot(newDot);

                    }
                } else {
                    alert("Incorrect data!");
                    break;
                }
            }
        }
    };
    reader.onloadend = () => {
        updateDotsInCheckPath();
    };
    reader.onerror = function() {
        alert(reader.error);
    };
};
const updateDotsInCheckPath = ()=>{
    let opsTxt = "";
    for (let d in DTC)
        opsTxt += `<option value=${d}>(${DTC[d].x};${DTC[d].y};${DTC[d].z})</option>`;

    getById("dot1").innerHTML = opsTxt;
    getById("dot2").innerHTML = opsTxt;

    [getById("buildGlobalSphere"), getById("checkPath")]
        .map(el => el.classList.remove("disabled"));
};
algC.onmousedown = (e) => {
    if (getById("allowInput").checked) {

        let x = +e.offsetX, y = +e.offsetY, z = +getById("z").value;
        if (isNaN(z))
            return;

        let newDot = new Dot(x, y, z);
        DTC.push(newDot);
        drawDot(newDot);

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

    tempX = (DTC[m].x + DTC[n].x)/2;
    tempY = (DTC[m].y + DTC[n].y)/2;
    tempZ = (DTC[m].z + DTC[n].z)/2;
    tempR = (new Dist(DTC[m], DTC[n])).value/2;


    areAllDotsInsideSphere = true;
    //проверка все ли точки входят в этот круг
    for (let i = 0; i < DTC.length; i++)
        // console.log((new Dist(DTC[i], new Dot(GS.x, GS.y, GS.z))).value, tempR, Math.round( tempR * 100000000.0) / 100000000.0 + 0.0001);

        if ((new Dist(DTC[i], new Dot(tempX, tempY, tempZ))).value > tempR) {
            areAllDotsInsideSphere = false;
            break;
        } else
            DTC[i].covered = true;//checkPath(DTC[i], new Dot(tempX, tempY, tempZ));

    //three dots
    if (!areAllDotsInsideSphere) {
        console.log("two are not enough");
        let threeR = max, threeX = 0, threeY = 0, threeZ = 0;
        for (let n = 0; n < DTC.length-2; n++)
            for (let m = n+1; m < DTC.length-1; m++)
                for (let l = m+1; l < DTC.length; l++) {
                    let dmx2 = DTC[m].x * DTC[m].x,
                        dmy2 = DTC[m].y * DTC[m].y,

                        dlx2 = DTC[l].x * DTC[l].x,
                        dly2 = DTC[l].y * DTC[l].y,

                        dnx2 = DTC[n].x * DTC[n].x,
                        dny2 = DTC[n].y * DTC[n].y;
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
                        R = (new Dist(tZ, DTC[n])).value;
                    else
                        continue;


                    areAllDotsInsideSphere = true;
                    for (let iter = 0; iter < DTC.length; iter++)
                        if ((new Dist(DTC[iter], tZ)).value/2 >
                            Math.round(R  * 100000000.0)/100000000.0 + 0.0001) {
                            areAllDotsInsideSphere = false;
                            break;
                        }

                    if (areAllDotsInsideSphere && R < threeR) {
                        threeX = Cx;
                        threeY = Cy;
                        threeZ = tZ.z;
                        threeR = R;
                    }
                }
        Cx = threeX;	Cy = threeY;	Cz = threeZ;	R = threeR;
    }

    GS = new Sphere(tempX, tempY, tempZ, tempR);
    getById("gsInfo").innerHTML = `<p>Sphere's info:</p>
                                        <p>X = ${GS.x}</p>
                                        <p>Y = ${GS.y}</p>
                                        <p>Z = ${GS.z}</p>
                                        <p>R = ${GS.r}</p>`;
    redraw();
};


//CHECK PATH BETWEEN TWO DOTS
getById("checkPathButton").onclick = ()=>{
    let d1 = DTC[Array.from(getById("dot1").options)
            .filter(option => option.selected)
            .map(option => option.value)[0]],
        d2 = DTC[Array.from(getById("dot2").options)
            .filter(option => option.selected)
            .map(option => option.value)[0]];

    checkPath(d1, d2,true);
};
const checkPath = (d1, d2, htmlRequest)=>{

    let isObstacleOnTheWay = false;

    //не совпадают ли выбраные точки
    if (d1 && d2 && d1 !== d2){
        if (Math.abs(d2.x-d1.x) > Math.abs(d2.y-d1.y)){
            let startD = (d1.x > d2.x)? d2 : d1, endD = (d1.x < d2.x)? d2 : d1;

            end: for (let x = startD.x; x < endD.x; x++){
                let y = startD.y + ((x-startD.x)/(endD.x-startD.x))*(endD.y-startD.y),
                    z = startD.z + ((x-startD.x)/(endD.x-startD.x))*(endD.z-startD.z);

                let TBlock = Triangles[Math.floor(y / accuracy)][Math.floor(x / accuracy)];
                for (let t of TBlock) {
                    let newT = new Triangle(t.a, t.b, t.c);

                    isObstacleOnTheWay = newT.simpleOperation(d1, d2) || newT.whichSide(new Dot(x, y, z)) < 0;

                    if (isObstacleOnTheWay)
                        break end;
                }
            }
        } else {
            let startD = (d1.y > d2.y)? d2 : d1, endD = (d1.y < d2.y)? d2 : d1;

            end: for (let y = startD.y; y < endD.y; y++){
                let x = startD.x + ((y-startD.y)/(endD.y-startD.y))*(endD.x-startD.x),
                    z = startD.z + ((x-startD.x)/(endD.x-startD.x))*(endD.z-startD.z);

                let TBlock = Triangles[Math.floor(y / accuracy)][Math.floor(x / accuracy)];
                for (let t of TBlock) {
                    let newT = new Triangle(t.a, t.b, t.c);

                    isObstacleOnTheWay = newT.simpleOperation(d1, d2) || newT.whichSide(new Dot(x, y, z)) < 0;

                    if (isObstacleOnTheWay)
                        break end;
                }
            }

        }
        if (htmlRequest)
            getById("isObstacleBetween").innerText = isObstacleOnTheWay;
        // console.log(isObstacleOnTheWay);
        return isObstacleOnTheWay;
    } else {
        alert("You should choose two different dots!");
    }

};

//REDRAW
const redraw = ()=>{
    algCtx.clearRect(0,0, algC.width, algC.height);
    drawDotsToCover();
    drawGlobalSphere();
};



const test = ()=>{
    console.log(getById("inputImageButton"));
};


