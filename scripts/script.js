

// <!--                buildManySpheres             -->
// <!--            <div id="buildManySpheres" class="operations">-->
// <!--                <div class="wrapper">-->
// <!--                    <label class="we1">Radius</label>-->
// <!--                    <input id="radius" type="text" onchange="changeRadius(this)" value="50">-->
//     <!--                </div>-->
//     <!--                <button onclick="buildManySpheres()">Build many spheres</button>-->
//     <!--            </div>-->

//canvas 3d

// <!--        <canvas id='c'></canvas>-->
// <!--        <script>-->
//     <!--            let c = document.getElementById('c');-->
//     <!--            let gl = c.getContext('webgl') || c.getContext("experimental-webgl");-->
//     <!--            gl.clearColor(0,0,0.8,1);-->
//     <!--            gl.clear(gl.COLOR_BUFFER_BIT);-->
//     <!--        </script>-->


//triangles
/*
this.cramer = (_a, _b)=>{

    let m = _b.x-_a.x, p = _b.y-_a.y, l = _b.z-_a.z;
    if (this.n.i*m + this.n.j*p + this.n.k*l !== 0) {
        let d, d1, d2, d3;
        let a11, a12, a13, b1;
        let a21, a22, a23, b2;
        let a31, a32, a33, b3;
        let x1, x2, x3;

        let matrix = [[],[],[]];
        matrix[0][0] = p;
        matrix[0][1] = -m;
        matrix[0][2] = 0;
        matrix[0][3] = p*_a.x - m*_a.y;

        matrix[1][0] = 0;
        matrix[1][1] = l;
        matrix[1][2] = -p;
        matrix[1][3] = l*_a.y - p*_a.z;

        matrix[2][0] = +this.n.i;
        matrix[2][1] = +this.n.j;
        matrix[2][2] = +this.n.k;
        matrix[2][3] = -this.n.d;
        console.log(matrix);
        a11 = p;    a12 = -m;    a13 = 0;   b1 = p*_a.x - m*_a.y;
        a21 = 0;    a22 = l;   a23 = -p;    b2 = l*_a.y - p*_a.z;
        a31 = this.n.i;    a32 = this.n.j;    a33 = this.n.k;   b3 = -this.n.d;

        d = determinant(a11, a12, a13, a21, a22, a23, a31, a32, a33);
        console.log('d=' + d);

        if (isNaN(d)) {
            console.log("NaN");
            return false;
        }

        d1 = determinant(b1, a12, a13, b2, a22, a23, b3, a32, a33);
        console.log('d1=' + d1);

        d2 = determinant(a11, b1, a13, a21, b2, a23, a31, b3, a33);
        console.log('d2=' + d2);

        d3 = determinant(a11, a12, b1, a21, a22, b2, a31, a32, b3);
        console.log('d3=' + d3);

        x1 = d1 / d;
        console.log('x1=' + x1);

        x2 = d2 / d;
        console.log('x2=' + x2);

        x3 = d3 / d;
        console.log('x3=' + x3);


        drawCircle(x1*20-1, x2*20-1);
        return isDotInsideTriangle(this.a, this.b, this.c, new Dot(x1, x2, x3));
    }
    console.log("pidor");
    return false;
};


let aaa = new Dot(0,0,0);
let bbb = new Dot(10,0,0);
let ccc = new Dot(0,10,0);
let ttt = new Triangle(aaa, bbb, ccc);
let ddd = new Dot(2, 2, -2);
let eee = new Dot(2, 2, 2);
drawLine(ddd,eee);
ttt.cramer(ddd,eee);

let aaa = new Dot(5,4,1);
let bbb = new Dot(10,1,2);
let ccc = new Dot(8,6,3);
let ttt = new Triangle(aaa, bbb, ccc);
let ddd = new Dot(7, 3, -1);
let eee = new Dot(8, 4, 4);
drawLine(ddd,eee);
ttt.cramer(ddd,eee);

this.doesLineGoesThroughTriangle = (_a, _b)=>{
    // Gauss
    let m = _b.x-_a.x, p = _b.y-_a.y, l = _b.z-_a.z;
    if (this.n.i*m + this.n.j*p + this.n.k*l !== 0) {
        let n = 3; //Ввод данных
        let matrix = [[],[],[]], //Определение рабочего массива
            answer = [], //Массив ответов
            k;    //Вспомогательные переменные

        matrix[0][0] = p;
        matrix[0][1] = -m;
        matrix[0][2] = 0;
        matrix[0][3] = p*_a.x - m*_a.y;

        matrix[1][0] = 0;
        matrix[1][1] = l;
        matrix[1][2] = -p;
        matrix[1][3] = l*_a.y - p*_a.z;

        matrix[2][0] = +this.n.i;
        matrix[2][1] = +this.n.j;
        matrix[2][2] = +this.n.k;
        matrix[2][3] = -this.n.d;



        // console.log(matrix);
        // console.log(matrix[0][0], matrix[0][1], matrix[0][2], matrix[0][3]);
        // console.log(matrix[1][0], matrix[1][1], matrix[1][2], matrix[1][3]);
        // console.log(matrix[2][0], matrix[2][1], matrix[2][2], matrix[2][3]);

        Iteration(n);
        answer = Answers();

        console.log(answer[0], answer[1], answer[2]);
        return isDotInsideTriangle(this.a, this.b, this.c, new Dot(answer[0], answer[1], answer[2]));

        function Iteration(iter_item) { //Функция итеррация
            for (iter_item = 0; iter_item < (n - 1); iter_item++) { //Цикл выполнения итерраций


                console.log(matrix[0][0], matrix[0][1], matrix[0][2], matrix[0][3]);
                console.log(matrix[1][0], matrix[1][1], matrix[1][2], matrix[1][3]);
                console.log(matrix[2][0], matrix[2][1], matrix[2][2], matrix[2][3]);
                if (matrix[iter_item][iter_item] == 0)
                    SwapRows(iter_item); //Проверка на ноль

                console.log(matrix[0][0], matrix[0][1], matrix[0][2], matrix[0][3]);
                console.log(matrix[1][0], matrix[1][1], matrix[1][2], matrix[1][3]);
                console.log(matrix[2][0], matrix[2][1], matrix[2][2], matrix[2][3]);

                for (let j = n; j >= iter_item; j--)
                    matrix[iter_item][j] /= matrix[iter_item][iter_item]; //Делим строку i на а[i][i]

                for (let i = iter_item + 1; i < n; i++)  //Выполнение операций со строками
                    for (let j = n; j >= iter_item; j--)
                        matrix[i][j] -= matrix[iter_item][j] * matrix[i][iter_item];



                for (let i = 0; i < n; ++i) {
                    for (let j = 0; j <= n; ++j)
                        console.log(matrix[i][j]);

                }
            }
        };

        function SwapRows(iter_item) { //Функция перемены строк
            for (let i = iter_item + 1; i < n; i++)
                if (matrix[i][iter_item] !== 0)
                    for (let j = 0; j <= n; j++) {
                        k = matrix[i - 1][j];
                        matrix[i - 1][j] = matrix[i][j];
                        matrix[i][j] = k;
                    }
        };

        function Answers() { //Функция поиска и вывода корней
            answer[n - 1] = matrix[n - 1][n] / matrix[n - 1][n - 1];
            for (let i = n - 2; i >= 0; i--) {
                k = 0;
                for (let j = n - 1; j > i; j--)
                    k = (matrix[i][j] * answer[j]) + k;

                answer[i] = matrix[i][n] - k;
            }
            for (let i = n; i > 0; i--)
                console.log("x" + i + " = " + answer[i - 1]);

            return answer;
        };
    }
    return false;
let aaa = new Dot(0,0,1);
let bbb = new Dot(1,0,2);
let ccc = new Dot(1,1,2);
let ttt = new Triangle(aaa, bbb, ccc);
let ddd = new Dot(0.5, 0.25, -1);
let eee = new Dot(0.5, 0.25, 4);
ttt.doesLineGoesThroughTriangle(ddd, eee);

let aaa = new Dot(0,0,1);
let bbb = new Dot(1,0,2);
let ccc = new Dot(1,1,2);
let ttt = new Triangle(aaa, bbb, ccc);
let ddd = new Dot(0, 1, -1);
let eee = new Dot(0, 1, 4);
};
*/



// let liner1 = ctx.createLinearGradient(0,0, C.width, 0);
// liner1.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
// liner1.addColorStop(1, 'rgba(0, 0, 255, 0.5)');
//
// let liner2 = ctx.createLinearGradient(0,0, 0, C.height);
// liner2.addColorStop(0, 'rgba(255, 255, 0, 0.5)');
// liner2.addColorStop(1, 'rgba(0, 255, 255, 0.5)');
//
// ctx.fillStyle = liner1;
// ctx.fillRect(0,0, C.width, C.height);
//
//
//
// ctx.fillStyle = liner2;
// ctx.fillRect(0,0, C.width, C.height);
//
//
// let a = new Dot(50,50,50),
//     b = new Dot(50, 100, 50),
//     c = new Dot(100,150,200),
//     d = new Dot(100,100,200);
// ctx.fillStyle = linerGrad(a, b, c, d);
// ctx.beginPath();
// ctx.moveTo(a.x, a.y);
// ctx.lineTo(b.x, b.y);
// ctx.lineTo(c.x, c.y);
// ctx.lineTo(d.x, d.y);
// ctx.fill();


