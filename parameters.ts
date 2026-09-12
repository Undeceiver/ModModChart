import { Parameterized, ParameterKind } from "./types.ts";

// Combining parameter types
export type BlendedParameters<P1 extends ParameterKind,P2 extends ParameterKind> = P1 & P2

export type Prefix<PF extends string, P extends ParameterKind> = { [K in keyof P as `${PF}.${K & string}`]: P[K]}
export type ProductParameters<PF1 extends string, P1 extends ParameterKind,PF2 extends string, P2 extends ParameterKind> = BlendedParameters<Prefix<PF1,P1>,Prefix<PF2,P2>>

// Blending params should mean just creating a single set of params that contains all necessary params of both.

export function prefixParams<PF extends string, P extends ParameterKind>(pf: PF, p: P): Prefix<PF,P>
{
    return Object.fromEntries(
        Object.entries(p).map(([key,value]) => [`${pf}.${key}`, value])
    ) as Prefix<PF,P>
}

export function unprefixParams<PF extends string, P extends ParameterKind>(pf: PF, pfp: Prefix<PF,P>): P
{
    return Object.fromEntries(
        Object.entries(pfp)
            .filter(([key,value]) => key.startsWith(`${pf}.`))
            .map(([key,value]) => [key.slice(pf.length + 1),value])        
    ) as P
}

export function productParams<PF1 extends string,P1 extends ParameterKind,PF2 extends string,P2 extends ParameterKind>(pf1: PF1, p1: P1, pf2: PF2, p2: P2): ProductParameters<PF1,P1,PF2,P2>
{
    return Object.fromEntries(
        Object.entries(prefixParams(pf1,p1)).concat(Object.entries(prefixParams(pf2,p2)))
    ) as ProductParameters<PF1,P1,PF2,P2>
}

// Combining functions via functions that act on the results
export function blendedParameterized<P1 extends ParameterKind,R1,P2 extends ParameterKind,R2,R>(f1: Parameterized<P1,R1>, f2: Parameterized<P2,R2>, combiner: (r1: R1, r2: R2) => R): Parameterized<BlendedParameters<P1,P2>,R>
{
    return function(params: BlendedParameters<P1,P2>)
    {
        const r1 = f1(params)
        const r2 = f2(params)

        return combiner(r1,r2)
    }
}

export function blendedPartial<P1 extends ParameterKind,R1,RP extends ParameterKind,R>(f1: Parameterized<P1,R1>, combiner: (r1: R1) => Parameterized<RP,R>): Parameterized<BlendedParameters<P1,RP>,R>
{
    return function(params: BlendedParameters<P1,RP>)
    {
        const r1 = f1(params)

        return combiner(r1)(params)
    }
}

export function multiParameterized<PF1 extends string,P1 extends ParameterKind,R1,PF2 extends string,P2 extends ParameterKind,R2,R>(pf1: PF1, pf2: PF2, f1: Parameterized<P1,R1>, f2: Parameterized<P2,R2>, combiner: (r1: R1, r2: R2) => R): Parameterized<ProductParameters<PF1,P1,PF2,P2>,R>
{
    return function(params: ProductParameters<PF1,P1,PF2,P2>)
    {
        const pp1: Prefix<PF1,P1> = params
        const pp2: Prefix<PF2,P2> = params

        const p1 = unprefixParams(pf1, pp1)
        const p2 = unprefixParams(pf2, pp2)

        const r1 = f1(p1)
        const r2 = f2(p2)

        return combiner(r1,r2)
    }
}

export function multiPartial<PF1 extends string, P1 extends ParameterKind,R1,RP extends ParameterKind,R>(pf1: PF1, f1: Parameterized<P1,R1>, combiner: (r1: R1) => Parameterized<RP,R>): Parameterized<Prefix<PF1,P1> & RP,R>
{
    return function(params: Prefix<PF1,P1> & RP)
    {
        const pp1: Prefix<PF1,P1> = params
        const pp2: RP = params

        const p1 = unprefixParams(pf1, pp1)        

        const r1 = f1(p1)        

        return combiner(r1)(pp2)
    }
}