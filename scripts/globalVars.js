//canvases variables
const relC = getById("relC");
let relCtx = relC.getContext("2d");

const algC = getById("algC");
let algCtx = algC.getContext("2d");

//IMAGE variables
let IMAGE, PIXELS, imgW, imgH, imgName;

//Triangles variables
let accuracy = 1;
let maxHeight = 0;
let minHeight = 256;
let scaledMaxH, scaledMinH;
let Dots = [], Triangles = [];

//algorithm variables
let DTC = [];
let GS = null;
let areAllDotsInsideSphere; //is radius big enough to draw a circle

const clear = ()=> {
    //clear all variables and canvas
    relCtx = relC.getContext("2d");
    relCtx.clearRect(0,0,imgW = relC.width = 300,imgH = relC.height = 150);
    algCtx.clearRect(0,0,algC.width = 300,algC.height = 150);
    getById("canvasInfo").innerHTML = `<p>canvas parameters:</p><p>width: ${relC.width}</p><p>height: ${relC.height}</p>`;

    getById("gsInfo").innerHTML = `<p>Sphere's info:</p>
                                        <p>X = ~</p>
                                        <p>Y = ~</p>
                                        <p>Z = ~</p>
                                        <p>R = ~</p>`;

    maxHeight = 0;
    minHeight = 256;
    IMAGE = PIXELS = undefined;
    accuracy = 1;
    Dots = [];
    Triangles = [];
    GS = null;
    DTC = [];

    //set default values to inputs
    getById('imgBlock').hidden = false;
    getById('exportByDefault').checked = true;
    getById('accuracy').value = 1;

    getById('dotsBlock').hidden = true;
    getById('allowInput').checked = true;

    getById('x').value = getById('y').value = getById('z').value = 10;

    getById("dot1").innerHTML = "";
    getById("dot2").innerHTML = "";

    getById("info").hidden = true;
    getById("tips").hidden = true;

    //disable all buttons except clear, import image, import relief
    Array.from(document.getElementsByClassName("operations"))
        .map(op => {op.classList.remove("disabled")});

    Array.from(document.getElementsByClassName("operations"))
        .filter(op => op.id!=="clearButton" && op.id!=="inputImage" && op.id !=="inputRelief")
        .map(op => {op.classList.add("disabled")});

    // Array.from(document.getElementsByClassName("operations"))
    //     .filter(op => op.id==="clearButton" || op.id==="inputImage" || op.id !=="inputRelief")
    //     .map(op => {op.classList.remove("disabled")});
};

//Initiation
(()=>{
    clear();

    getById("clear").onclick = ()=>{
        clear();
    };
    getById("hideInterfaceButton").onclick = ()=>{
        getById("main").hidden = !getById("main").hidden;
    };
    getById("showTipsButton").onclick = ()=>{
        getById("info").hidden = true;
        getById("tips").hidden = !getById("tips").hidden;
    };
    getById("showInfoButton").onclick = ()=>{
        getById("tips").hidden = true;
        getById("info").hidden = !getById("info").hidden;
    };
})();