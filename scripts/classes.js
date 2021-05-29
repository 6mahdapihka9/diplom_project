class Dot {
    constructor(_x, _y, _z) {
        if (_x !== undefined && _y !== undefined && _z !== undefined) {
            this.x = _x;
            this.y = _y;
            this.z = _z;
            this.covered = false;
            this.underSurface = false;
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

        this.n = {
            i: ab.y*ac.z - ab.z*ac.y,
            j: ab.z*ac.x - ab.x*ac.z,
            k: ab.x*ac.y - ab.y*ac.x,
            d: (ab.y*ac.z - ab.z*ac.y)*(-_a.x) + (ab.z*ac.x - ab.x*ac.z)*(-_a.y) + (ab.x*ac.y - ab.y*ac.x)*(-_a.z)
        };
        // drawTriangle(this);

        this.simpleOperation = (_a, _b)=>{
            let m = _b.x-_a.x, p = _b.y-_a.y, l = _b.z-_a.z;
            if (this.n.i*m + this.n.j*p + this.n.k*l !== 0) {
                let x, y, z, t;
                t = -(this.n.i*_a.x + this.n.j*_a.y + this.n.k*_a.z + this.n.d)/(this.n.i*m + this.n.j*p + this.n.k*l);
                x = _a.x + m*t;
                y = _a.y + p*t;
                z = _a.z + l*t;
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

