//INPUT IMAGE
const inputImage = (input)=>{
console.log("dick");
    //try load image
    try {
        let file = input.files[0];
        console.log(imgName = file.name);
        let reader = new FileReader();
        let src = "";
        reader.readAsDataURL(file);
        reader.onload = () => { if (typeof(reader.result) === "string") src = reader.result; };
        reader.onloadend = () => {
            loadImg(src);


        };
        reader.onerror = () => { alert(reader.error); };
    } catch (e) {
        alert(e);
        console.log( e );
        clear();
        return;
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

        IMAGE = img;


        try {
            triangulation();
        } catch (e) {
            alert(e);
            console.log( e );
            clear();
            return;
        }

        try {
            creationOfRelief();
        } catch (e) {
            alert(e);
            console.log( e );
            clear();
            return;
        }

        try {
            drawAllTriangles();
        } catch (e) {
            alert(e);
            console.log( e );
            clear();
            return;
        }


        disableInputRelief();
        if (getById("exportByDefault").checked)
            getById("exportReliefButton").click();
    }
    img.onerror = ()=>{
        alert("Loading image error!");
        clear();
    }
};

const disableInputRelief = ()=>{

    getById('imgBlock').hidden = true;
    getById('dotsBlock').hidden = false;

    Array.from(document.getElementsByClassName("operations"))
        .filter(op => op.id!=="clearButton" && op.id!=="exportReliefDiv" && op.id!=="inputDots")
        .map(op => {op.classList.add("disabled")});

    Array.from(document.getElementsByClassName("operations"))
        .filter(op => op.id=="clearButton" || op.id=="exportReliefDiv" || op.id=="inputDots")
        .map(op => {op.classList.remove("disabled")});
};


//CROP image
const crop = ()=>{
    //accuracy html Input El
    let htmlEl = getById("accuracy");
    if (+htmlEl.value < ((imgW>imgH)?imgH:imgW) && +htmlEl.value > 0 )
        accuracy = +htmlEl.value;
    else
        accuracy = htmlEl.value = 1;


    if (imgW - imgW % accuracy + 1 <= imgW)
        algC.width = relC.width = imgW - imgW % accuracy + 1;
    else
        algC.width = relC.width = imgW - imgW % accuracy + 1 - accuracy;

    if (imgH - imgH % accuracy + 1 <= imgH)
        algC.height = relC.height = imgH - imgH % accuracy + 1;
    else
        algC.height = relC.height = imgH - imgH % accuracy + 1 - accuracy;

    relCtx = relC.getContext("2d");
    relCtx.drawImage(IMAGE, 0, 0, relC.width, relC.height);
};


//TRIANGULATION
const triangulation = ()=>{
    crop();
    //To gray
    let pixels = relCtx.getImageData(0,0, relC.width, relC.height);
    let data = pixels.data;

    Dots = [];
    Triangles = [];
    maxHeight = 0;
    minHeight = 256;

    let type = "Brightness";
    document.getElementsByName("typeToEvaluate").forEach((el)=>{
        if (el.checked)
            type = el.value;
    });

    for (let i = 0, I = 0; i < relC.height; i+=accuracy, I++) {
        Dots[I] = [];
        if (i < relC.height-1)
            Triangles[I] = [];

        for (let j = 0, J = 0, k = i*relC.width; j < relC.width; j+=accuracy, J++, k+=accuracy) {
            let h = 0;
            switch (type) {
                case "Brightness":
                    h = (data[k * 4] + data[k * 4 + 1] + data[k * 4 + 2]) / 3;
                    break;
                case "Red":
                    h = data[k * 4];
                    break;
                case "Green":
                    h = data[k * 4 + 1];
                    break;
                case "Blue":
                    h = data[k * 4 + 2];
                    break;
            }

            maxHeight = (h > maxHeight)? h: maxHeight;
            minHeight = (h < minHeight)? h: minHeight;

            Dots[I][J] = new Dot(J, I, h);
            // console.log("i ",i," I ",I," j ",j," J ",J," k ",k*4);
        }
    }

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

    for (let i of Triangles)
        for (let j of i)
            for (let t of j)
                drawTriangle(t, true);
};



//INPUT RELIEF
const inputRelief = (input)=>{
    clear();
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        let relief = JSON.parse(reader.result);

        // console.log(relief.accuracy, relief.width, relief.height, relief.Triangles);

        maxHeight = relief.maxHeight;
        minHeight = relief.minHeight;
        accuracy = relief.accuracy;
        Triangles = relief.Triangles;
        algC.width = relC.width = imgW = relief.width;
        algC.height = relC.height = imgH = relief.height;

    }
    reader.onloadend = () => {

        drawAllTriangles();

        disableInputRelief();

    };
    reader.onerror = function() {
        alert(reader.error);
    };
};



//EXPORT RELIEF
const reliefExport = ()=>{
    if (Triangles !== []) {
        let width = relC.width, height = relC.height, filename = `relief of ${imgName} (acc = ${accuracy}).txt`;

        let text = JSON.stringify({maxHeight, minHeight,accuracy, width, height, Triangles}, null, 4);

        let blob = new Blob([text], {type: 'text/plain'});
        let exp = getById("exportRelief");
        exp.download = filename;
        exp.href = window.URL.createObjectURL(blob);
    }
}

