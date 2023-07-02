import { TrackValue, complexifyArray } from "https://deno.land/x/remapper@3.1.1/src/animation.ts";
import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";

export function fromVanillaToNEX(x: number)
{
    return x-2
}

export function fromNEToVanillaX(x: number)
{
    return x+2
}

export function fromVanillaToNEY(y: number)
{
    return y
}

export function fromNEToVanillaY(y: number)
{
    return y
}

export function beatsToTrackAnimationP(duration: number): ((beats: number) => number)
{
    return function(beats: number)
    {
        return beats/duration
    }
}

export function beatsToTrackAnimationPLinear(duration: number): ((keyframes: remapper.KeyframesLinear) => remapper.KeyframesLinear)
{
    return function(keyframes: remapper.KeyframesLinear)
    {      
        if(typeof keyframes === "string")
        {
            return keyframes
        }
        else
        {
            const keyframes2 = complexifyArray(keyframes)
            return keyframes2.map(keyframe =>
                keyframe.map((x: number | any, i) =>
                    (i == 1 && typeof x === "number") ? beatsToTrackAnimationP(duration)(x) : x)) as remapper.KeyframesLinear
        }        
    }
}

export function beatsToTrackAnimationPVec3(duration: number): ((keyframes: remapper.KeyframesVec3) => remapper.KeyframesVec3)
{
    return function(keyframes: remapper.KeyframesVec3)
    {      
        if(typeof keyframes === "string")
        {
            return keyframes
        }
        else
        {
            const keyframes2 = complexifyArray(keyframes)
            return keyframes2.map(keyframe =>
                keyframe.map((x: number | any, i) =>
                    (i == 3 && typeof x === "number") ? beatsToTrackAnimationP(duration)(x) : x)) as remapper.KeyframesVec3        
        }        
    }
}

export function trackAnimationPToBeats(duration: number): ((p: number) => number)
{
    return function(p: number)
    {
        return p*duration
    }
}

export function randomTrackName(): remapper.TrackValue
{
    return Math.random().toString().substring(10)
}

export function degreesToRadians(degrees: number): number
{
    return degrees*Math.PI/180
}

export function radiansToDegrees(radians: number): number
{
    return radians*180/Math.PI
}