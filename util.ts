import { TrackValue } from "https://deno.land/x/remapper@3.1.1/src/animation.ts";
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
        const result = []
        for(const keyframe of keyframes)
        {
            const keyframeas = keyframe as [number,number]
            result.push([keyframeas[0],beatsToTrackAnimationP(duration)(keyframeas[1])])
        }

        return result as remapper.KeyframesLinear
    }
}

export function beatsToTrackAnimationPVec3(duration: number): ((keyframes: remapper.KeyframesVec3) => remapper.KeyframesVec3)
{
    return function(keyframes: remapper.KeyframesVec3)
    {        
        const result = []
        for(const keyframe of keyframes)
        {
            const keyframeas = keyframe as [number,number,number,number]
            result.push([keyframeas[0],keyframeas[1],keyframeas[2],beatsToTrackAnimationP(duration)(keyframeas[3])])
        }

        return result as remapper.KeyframesVec3
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