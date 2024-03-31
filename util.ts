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

export function constFunction<A, B>(b : B): ((a: A) => B)
{
    return ((a: A) : B => { return b })
}

export function interpolateFunction(startIn: number, startOut: number, endIn: number, endOut: number): (v: number) => number
{
    return function(v: number)
    {
        return startOut + (v-startIn)*(endOut-startOut)/(endIn-startIn)
    }
}

export function clampAngle(angle: number): number
{
    return ((angle % 360) + 360) % 360
}

// This is based on a base direction of 3 (right)
// Returns the angle and the remainder.
export function getClosestDirection(angle: number): [remapper.CUT, number]
{
    let anglem = clampAngle(angle)

    if(anglem >= 0 && anglem < 22.5)
    {
        return [remapper.CUT.RIGHT,clampAngle(anglem-0)]
    }
    else if(anglem >= -22.5+45 && anglem < 22.5+45)
    {
        return [remapper.CUT.UP_RIGHT,clampAngle(anglem-45)]
    }
    else if(anglem >= -22.5+90 && anglem < 22.5+90)
    {
        return [remapper.CUT.UP,clampAngle(anglem-90)]
    }
    else if(anglem >= -22.5+135 && anglem < 22.5+135)
    {
        return [remapper.CUT.UP_LEFT,clampAngle(anglem-135)]
    }
    else if(anglem >= -22.5+180 && anglem < 22.5+180)
    {
        return [remapper.CUT.LEFT,clampAngle(anglem-180)]
    }
    else if(anglem >= -22.5+225 && anglem < 22.5+225)
    {
        return [remapper.CUT.DOWN_LEFT,clampAngle(anglem-225)]
    }
    else if(anglem >= -22.5+270 && anglem < 22.5+270)
    {
        return [remapper.CUT.DOWN,clampAngle(anglem-270)]
    }
    else if(anglem >= -22.5+315 && anglem < 22.5+315)
    {
        return [remapper.CUT.DOWN_RIGHT,clampAngle(anglem-315)]
    }
    else if(anglem >= 360-22.5 && anglem < 360)
    {
        return [remapper.CUT.RIGHT,clampAngle(anglem-0)]
    }
    else
    {
        console.log("IMPOSSIBLE ANGLE: " + anglem)
        return [remapper.CUT.RIGHT,0]
    }
}

// Returns x and y, both between -1 and 1
export function getDiscreteDirectionVector(direction: remapper.CUT): [number, number]
{
    switch(direction)
    {
        case remapper.CUT.UP: return [0,1]
        case remapper.CUT.DOWN: return [0,-1]
        case remapper.CUT.LEFT: return [-1,0]
        case remapper.CUT.RIGHT: return [1,0]
        case remapper.CUT.UP_LEFT: return [-1,1]
        case remapper.CUT.UP_RIGHT: return [1,1]
        case remapper.CUT.DOWN_LEFT: return [-1,-1]
        case remapper.CUT.DOWN_RIGHT: return [1,-1]
        case remapper.CUT.DOT:
            console.log("ARE YOU SURE THIS IS WHAT YOU WANT? DISCRETE DIRECTION OF A DOT?")
            return [0,0]
    }
}