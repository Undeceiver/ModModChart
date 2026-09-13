import * as remapper from "https://deno.land/x/remapper@4.2.3/src/mod.ts";

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

// Commenting out for now, may reuse later or just delete
export function beatsToTrackAnimationPLinear(duration: number): ((keyframes: remapper.ComplexPointsLinear) => remapper.ComplexPointsLinear)
{
    return function(keyframes: remapper.ComplexPointsLinear)
    {      
        if(typeof keyframes === "string")
        {
            return keyframes
        }
        else
        {
            const keyframes2 = remapper.complexifyPoints(keyframes)
            return keyframes2.map(keyframe =>
                keyframe.map((x: number | any, i) =>
                    (i == 1 && typeof x === "number") ? beatsToTrackAnimationP(duration)(x) : x)) as remapper.ComplexPointsLinear
        }        
    }
}

export function beatsToTrackAnimationPVec3(duration: number): ((keyframes: remapper.ComplexPointsVec3) => remapper.ComplexPointsVec3)
{
    return function(keyframes: remapper.ComplexPointsVec3)
    {      
        if(typeof keyframes === "string")
        {
            return keyframes
        }
        else
        {
            const keyframes2 = remapper.complexifyPoints(keyframes)
            return keyframes2.map(keyframe =>
                keyframe.map((x: number | any, i) =>
                    (i == 3 && typeof x === "number") ? beatsToTrackAnimationP(duration)(x) : x)) as remapper.ComplexPointsVec3        
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
export function interpolateRotation(rotation: remapper.ComplexPointsVec3, maxEach = 90): remapper.ComplexPointsVec3
{
    const result : remapper.ComplexPointsVec3 = []

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
    return wall.halfJumpDuration/(wall.halfJumpDuration+wall.duration)
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
export function getClosestDirection(angle: number): [remapper.NoteCut, number]
{
    let anglem = clampAngle(angle)

    if(anglem >= 0 && anglem < 22.5)
    {
        return [remapper.NoteCut.RIGHT,clampAngle(anglem-0)]
    }
    else if(anglem >= -22.5+45 && anglem < 22.5+45)
    {
        return [remapper.NoteCut.UP_RIGHT,clampAngle(anglem-45)]
    }
    else if(anglem >= -22.5+90 && anglem < 22.5+90)
    {
        return [remapper.NoteCut.UP,clampAngle(anglem-90)]
    }
    else if(anglem >= -22.5+135 && anglem < 22.5+135)
    {
        return [remapper.NoteCut.UP_LEFT,clampAngle(anglem-135)]
    }
    else if(anglem >= -22.5+180 && anglem < 22.5+180)
    {
        return [remapper.NoteCut.LEFT,clampAngle(anglem-180)]
    }
    else if(anglem >= -22.5+225 && anglem < 22.5+225)
    {
        return [remapper.NoteCut.DOWN_LEFT,clampAngle(anglem-225)]
    }
    else if(anglem >= -22.5+270 && anglem < 22.5+270)
    {
        return [remapper.NoteCut.DOWN,clampAngle(anglem-270)]
    }
    else if(anglem >= -22.5+315 && anglem < 22.5+315)
    {
        return [remapper.NoteCut.DOWN_RIGHT,clampAngle(anglem-315)]
    }
    else if(anglem >= 360-22.5 && anglem < 360)
    {
        return [remapper.NoteCut.RIGHT,clampAngle(anglem-0)]
    }
    else
    {
        console.log("IMPOSSIBLE ANGLE: " + anglem)
        return [remapper.NoteCut.RIGHT,0]
    }
}

// Returns x and y, both between -1 and 1
export function getDiscreteDirectionVector(direction: remapper.NoteCut): [number, number]
{
    switch(direction)
    {
        case remapper.NoteCut.UP: return [0,1]
        case remapper.NoteCut.DOWN: return [0,-1]
        case remapper.NoteCut.LEFT: return [-1,0]
        case remapper.NoteCut.RIGHT: return [1,0]
        case remapper.NoteCut.UP_LEFT: return [-1,1]
        case remapper.NoteCut.UP_RIGHT: return [1,1]
        case remapper.NoteCut.DOWN_LEFT: return [-1,-1]
        case remapper.NoteCut.DOWN_RIGHT: return [1,-1]
        case remapper.NoteCut.DOT:
            console.log("ARE YOU SURE THIS IS WHAT YOU WANT? DISCRETE DIRECTION OF A DOT?")
            return [0,0]
    }
}

// Groups patterns, where a pattern is all notes on the same beat.
// This function assumes notes come in order for simplicity.
export function patternsFromNotes(notes: remapper.ColorNote[]): remapper.ColorNote[][]
{
    const result : remapper.ColorNote[][] = []
    let curPattern : remapper.ColorNote[] = []
    let curBeat = -1

    for(let i = 0; i < notes.length; i++)
    {
        const curNote = notes[i]

        if(curPattern.length == 0)
        {
            curPattern.push(curNote)
            curBeat = curNote.beat
        }
        else if(curNote.beat != curBeat)
        {
            result.push(curPattern)
            curPattern = [curNote]
            curBeat = curNote.beat
        }        
        else
        {
            curPattern.push(curNote)            
        }
    }

    return result
}

export function beatsToZDistance(noteJumpMovementSpeed: number): (beats:number) => number
{
    return function(beats: number)
    {
        return noteJumpMovementSpeed*beats
    }
}

export const playZ = 1
export const saberLength = 1/0.6
export const reasonableReach = 1.25/0.6