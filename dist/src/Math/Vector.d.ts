export declare class Vector {
    protected scs: number[];
    constructor(array: number[]);
    scalars(): number[];
    dim(): number;
    magnitude(): number;
    dot(vector: Vector): number;
    scalarMult(scalar: number): Vector;
    scalarSum(): number;
    cross(v: Vector): Vector;
}
