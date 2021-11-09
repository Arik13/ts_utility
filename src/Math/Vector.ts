export class Vector {
    protected scs: number[];
    constructor(array: number[]) {
        this.scs = array;
    }
    scalars() {
        return this.scs.map(x => x);
    }
    dim() {
        return this.scs.length;
    }
    magnitude() {
        return Math.sqrt(this.scs.map(x => x**2).reduce((p, c) => p + c));
    }
    dot(vector: Vector) {
        if (this.dim() != vector.dim())
            throw new Error(`The dot product is not a valid operation for vectors of different dimensions: ${this.dim()} != ${vector.dim()}`);
        return this.scs.map((x, i) => x * vector.scs[i]).reduce((p, v) => p + v);
    }
    scalarMult(scalar: number) {
        return new Vector(this.scs.map(x => x * scalar));
    }
    scalarSum() {
        return this.scs.reduce((p, c) => p + c);
    }
    cross(v: Vector) {
        if (this.dim() != 3 || v.dim() != 3)
            throw new Error(`The cross product is not a valid operation for vectors of dimensions other than 3: ${v.dim()}`);
        return new Vector([
            this.scs[1] * v.scs[2] - this.scs[2] * v.scs[1],
            this.scs[2] * v.scs[0] - this.scs[0] * v.scs[2],
            this.scs[0] * v.scs[1] - this.scs[1] * v.scs[0],
        ])
    }
    normalize() {
        let mag = this.magnitude();
        return new Vector(this.scs.map(x => x / mag));
    }
}