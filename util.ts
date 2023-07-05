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

// For when you want something that grows like the square root but is directed
export function signedsqrt(number: number): number
{
    const sign = Math.sign(number)
    const abs = Math.abs(number)

    const resultabs = Math.sqrt(abs)

    const result = resultabs*sign
    
    return result
}

// Note that this will ignore/lose individual easings on steps that need splitting
export function interpolateRotation(rotation: remapper.KeyframesVec3, maxEach = 90): remapper.KeyframesVec3
{
    const result : remapper.KeyframesVec3 = []

    const prevRotation: [number,number,number,number] = rotation[0] as [number,number,number,number]
    const prevPitch = prevRotation[0]
    const prevYaw = prevRotation[1]
    const prevRoll = prevRotation[2]
    const prevTime = prevRotation[3]

    result.push(prevRotation)

    for(let i = 1; i < rotation.length; i++)
    {
        const curRotation = rotation[i] as [number,number,number,number]

        const curPitch = curRotation[0]
        const curYaw = curRotation[1]
        const curRoll = curRotation[2]
        const curTime = curRotation[3]

        const pitchDiff = curPitch - prevPitch
        const yawDiff = curYaw - prevYaw
        const rollDiff = curRoll - prevRoll
        const timeDiff = curTime - prevTime

        const maxDiff = Math.max(Math.abs(pitchDiff),Math.abs(yawDiff),Math.abs(rollDiff))

        if(maxDiff > maxEach)
        {
            const numKeyframes = Math.ceil(maxDiff / maxEach)
            
            for(let j = 1; j <= numKeyframes; j++)
            {
                const nextPitch = prevPitch + j*pitchDiff/numKeyframes
                const nextYaw = prevYaw + j*yawDiff/numKeyframes
                const nextRoll = prevRoll + j*rollDiff/numKeyframes
                const nextTime = prevTime + j*timeDiff/numKeyframes

                result.push([nextPitch,nextYaw,nextRoll,nextTime])
            }
        }
        else
        {
            result.push(curRotation)
        }
    }

    return result
}

export function getWallReachProp(wall: remapper.Wall): number
{
    return wall.halfJumpDur/(wall.halfJumpDur+wall.duration)
}