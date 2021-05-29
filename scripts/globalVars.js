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
let Dots = [], Triangles = [], GlobalSphere = null, Spheres = [];
let DTC = [];


//algorithm variables
let dist = [];
let GS = null;
let Cx, Cy, Cz, R;
let tempX, tempY, tempZ, tempR;
let lenX, lenY, smallR = 50;
let minDistGlob = 100000000;
let enoughOne; //is radius big enough to draw a circle


const clear = ()=> {
    //ToDo
    //clear all variables and canvas
    relCtx = relC.getContext("2d");
    relCtx.clearRect(0,0,imgW = relC.width = 300,imgH = relC.height = 150);
    algCtx.clearRect(0,0,algC.width = 300,algC.height = 150);
    maxHeight = 0;
    minHeight = 256;
    IMAGE = PIXELS = undefined;
    accuracy = 1;
    Dots = [];
    Triangles = [];
    GlobalSphere = null;
    Spheres = [];
    DTC = [];
    allowToInputDotsByCursor = false;
    zOfInputedDot = 10;
    smallR = 50;
    inputedRelief = false;

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
        getById("tips").hidden = !getById("tips").hidden;
        getById("info").hidden = (!getById("info").hidden)? true : false;
    };
    getById("showInfoButton").onclick = ()=>{
        getById("info").hidden = !getById("info").hidden;
        getById("tips").hidden = (!getById("tips").hidden)? true : false;
    };

})();