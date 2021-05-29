class Dot {
    constructor(_x, _y, _z, _dtc) {
        if (_x !== undefined && _y !== undefined && _z !== undefined) {
            this.x = _x;
            this.y = _y;
            this.z = _z;

            this.covered = false;
            this.underSurface = false;

            if (_dtc)
                end: for (let i of Triangles)
                    for (let j of i)
                        for (let t of j)
                            if (this.underSurface =
                                (!!t.simpleOperation(new Dot(_x, _y, _z), new Dot(_x, _y, 1000000)) &&
                                    t.whichSide(new Dot(_x, _y, _z))) < 0){
                                // console.log(t, t.simpleOperation(t, new Dot(_x, _y, _z), new Dot(_x, _y, 1000000)), t.whichSide(new Dot(_x, _y, _z)) );
                                break end;
                            }

                // if (Math.floor(_y / accuracy) < Triangles.length && Math.floor(_x / accuracy) < Triangles[0].length)
                // for (let t of Triangles[Math.floor(_y / accuracy)][Math.floor(_x / accuracy)])
                //     this.underSurface = !!t.simpleOperation(new Dot(_x, _y, _z), new Dot(_x, _y, 1000));

        }
    }
}
class Dist {
    constructor(_d1, _d2) {
        this.value = Math.sqrt(Math.pow(_d2.x-_d1.x,2) + Math.pow(_d2.y-_d1.y,2) + Math.pow(_d2.z-_d1.z,2));
        this.dot1 = _d1;
        this.dot2 = _d2;
    }
}
class Sphere {
    constructor(_x, _y, _z, _r) {
        if (_x !== undefined && _y !== undefined && _z !== undefined) {
            this.r = _r;
            this.x = _x;
            this.y = _y;
            this.z = _z;
            this.dotsCovered = 0;
        }
    }
}


class Triangle {
    constructor(_a, _b, _c) {
        this.a = _a;
        this.b = _b;
        this.c = _c;
        //ab
        let ab = new Dot(_b.x - _a.x, _b.y - _a.y, _b.z - _a.z);
        //ac
        let ac = new Dot(_c.x - _a.x, _c.y - _a.y, _c.z - _a.z);

        //вектор нормали
        this.n = {
            i: ab.y*ac.z - ab.z*ac.y,
            j: ab.z*ac.x - ab.x*ac.z,
            k: ab.x*ac.y - ab.y*ac.x,
            d: (ab.y*ac.z - ab.z*ac.y)*(-_a.x) + (ab.z*ac.x - ab.x*ac.z)*(-_a.y) + (ab.x*ac.y - ab.y*ac.x)*(-_a.z)
        };

        // Теорема. Если в пространстве задана точка М0(х0, у0, z0), то уравнение плоскости,
        //     проходящей через точку М0 перпендикулярно вектору нормали (A, B, C) имеет вид: A(x – x0) + B(y – y0) + C(z – z0) = 0.
        this.whichSide = (_p)=>{
            return this.n.i*(_p.x - this.a.x) + this.n.j*(_p.y - this.a.y) + this.n.k*(_p.z - this.a.z);
        }

        this.simpleOperation = (_a, _b)=>{
            let m = _b.x-_a.x, p = _b.y-_a.y, l = _b.z-_a.z;
            if (this.n.i*m + this.n.j*p + this.n.k*l !== 0) {
                let x, y, z, t;
                t = -(this.n.i*_a.x + this.n.j*_a.y + this.n.k*_a.z + this.n.d)/(this.n.i*m + this.n.j*p + this.n.k*l);
                x = _a.x + m*t;
                y = _a.y + p*t;
                z = _a.z + l*t;
                //проекция точки на плоскость
                let newDot = new Dot(x, y, z);
                if (isDotInsideTriangle(this.a, this.b, this.c, newDot)){
                    // drawTriangle(this, true);
                    // if (_a.z > z)
                    //     drawLine(_a, newDot);
                    // else
                    //     drawLine(_b, newDot);
                    // drawCircle(x,y);
                    return newDot;
                }
            }
            return false;
        }
    }
}

