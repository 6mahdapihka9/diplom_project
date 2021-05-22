const relC = getById("relC");
let relCtx = relC.getContext("2d");

const algC = getById("algC");
let algCtx = algC.getContext("2d");



let IMAGE, PIXELS, imgW, imgH;
let accuracy = 1;
let maxHeight = 0;
let minHeight = 256;
let scaledMaxH, scaledMinH;
let Dots = [], Triangles = [], GlobalSphere = null, Spheres = [];
let DTC = [];
let allowToInputDotsByCursor = false;
let zOfInputedDot = 10;
let inputedRelief = false;


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

    //disable all buttons except clear and load image
    Array.from(document.getElementsByClassName("operations"))
        .filter(op => op.id!=="clearButton" && op.id!=="inputImage")
        .map(op => {op.classList.add("disabled")});
};

//Initiation
(()=>{
    clear();
    getById("clear").onclick = ()=>{clear()};
})();