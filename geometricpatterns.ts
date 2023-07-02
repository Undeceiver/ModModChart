import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";
import { BSObject, Creator, LinePattern, LineSampler, NumberGroupEffect, PointTimeSamples, SurfacePattern, SurfaceSampler, TimeLinePattern, TimePattern, TimePointPattern, TimePointPatternDefinition, TimeSampler, TimeSamples, TimeSurfacePattern } from "./types.ts";
import { periodicEffect } from "./effectslibrary.ts";
import { Bomb } from "https://deno.land/x/remapper@3.1.1/src/note.ts";
import { combineEffects, disableNoteGravity, initializePosition, initializeScale, setDuration, setPosition, setScale, setTime } from "./effects.ts";
import { createBombs, createWalls } from "./creation.ts";
import { EASE } from "https://deno.land/x/remapper@3.1.1/src/constants.ts";
import { easeInBack } from "https://deno.land/x/remapper@3.1.1/src/easings.ts";
import { lerp } from "https://deno.land/x/remapper@3.1.1/src/general.ts";

export function basicLineSampler(n: number): LineSampler
{
    if(n <= 1)
    {
        return [0.5]
    }
    else
    {
        const step = 1/(n-1)
        const epsilon = 0.01
        const result = []
        
        for(let x = 0; x < 1+epsilon; x+=step)
        {
            result.push(x)
        }

        result.reverse()

        return result
    }
}

export function basicSurfaceSampler(n: number, m: number): SurfaceSampler
{
    const axis1 = basicLineSampler(n)
    const axis2 = basicLineSampler(m)
    const result : SurfaceSampler = []

    axis1.forEach(
        function(x: number)
        {
            axis2.forEach(
                function(y: number)
                {
                    result.push([x,y])
                }
            )
        }
    )

    result.reverse()

    return result
}

export function timeSampler(offset: number, period: number): TimeSampler
{
    return [offset,period]
}

export function sampleLine(pattern: LinePattern, sampler: LineSampler): remapper.Vec2[]
{
    return sampler.map(pattern)
}

export function sampleSurface(pattern: SurfacePattern, sampler: SurfaceSampler): remapper.Vec2[]
{
    return sampler.map(pattern)
}

export function sampleTime<T>(pattern: TimePattern<T>, sampler: TimeSampler, start: number, end: number): TimeSamples<T>
{
    const result : [number,T][] = []

    for(let t = sampler[0]; t <= end; t += sampler[1])
    {
        if(t >= start)
        {
            result.push([t,pattern(t)])
        }        
    }

    result.reverse()

    return result
}

export function sampleTimePointPattern(pattern: TimePointPattern, timeSampler: TimeSampler, start: number, end: number): PointTimeSamples
{
    return sampleTime(pattern, timeSampler, start, end)    
}

export function sampleTimeLinePattern(pattern: TimeLinePattern, lineSampler: LineSampler, timeSampler: TimeSampler, start: number, end: number): PointTimeSamples
{
    const lines = sampleTime(pattern, timeSampler, start, end)
    const result: [number,remapper.Vec2][] = []

    lines.forEach(
        function(sample: [number,LinePattern])
        {
            const points = sampleLine(sample[1], lineSampler)

            return points.map(
                function(v: remapper.Vec2)
                {
                    return [sample[0],v]
                }
            )
        }
    )

    result.reverse()

    return result
}

export function sampleTimeSurfacePattern(pattern: TimeSurfacePattern, surfaceSampler: SurfaceSampler, timeSampler: TimeSampler, start: number, end: number): PointTimeSamples
{
    const lines = sampleTime(pattern, timeSampler, start, end)
    const result: [number,remapper.Vec2][] = []

    lines.forEach(
        function(sample: [number,SurfacePattern])
        {
            const points = sampleSurface(sample[1], surfaceSampler)

            return points.map(
                function(v: remapper.Vec2)
                {
                    return [sample[0],v]
                }
            )
        }
    )

    result.reverse()
    
    return result
}

export function placeBombs(points: [number,remapper.Vec2][], fake = false): Creator<remapper.Bomb>
{
    const groupEffect: NumberGroupEffect<remapper.Bomb> =
        function(i: number)
        {
            const initPos = initializePosition()
            const setPos = setPosition(points[i][1])
            const setTimeEf = setTime(points[i][0])
            const nogravity = disableNoteGravity()
            
            return combineEffects([initPos,setPos,setTimeEf,nogravity])
        }
    
    return createBombs(points.length, groupEffect, fake)
}

export function placeWalls(points: [number,remapper.Vec2][], wallDist: number, wallSide: number, fake = false): Creator<remapper.Wall>
{
    const groupEffect: NumberGroupEffect<remapper.Wall> =
        function(i: number)
        {
            const initPos = initializePosition()
            const setPos = setPosition(points[i][1])
            const setTimeEf = setTime(points[i][0])
            const setDurationEf = setDuration(wallDist)
            const initScale = initializeScale()
            const setScaleEf = setScale([wallSide,wallSide,wallSide])                       

            return combineEffects([initPos,setPos,setTimeEf,setDurationEf,initScale,setScaleEf])
        }
    
    return createWalls(points.length, groupEffect, fake)
}

// Some notes about this:
// - To change easing, use two separate paths
// - Note that the interpolation of the angle happens in the direction indicated by the signs.
// - This can be used to change direction or do multiple loops.
export function drawPath(keyframes: TimePointPatternDefinition, angleEasing: EASE = "easeLinear", radiusEasing: EASE = "easeLinear", positionEasing: EASE = "easeLinear"): TimePointPattern
{
    const sections: [number,TimePointPattern][] = []

    let prevTime = keyframes[0][0]
    let prevAngle = keyframes[0][1]
    let prevXRadius = keyframes[0][2]
    let prevYRadius = keyframes[0][3]
    let prevXOffset = keyframes[0][4]
    let prevYOffset = keyframes[0][5]

    for(let i = 1; i < keyframes.length; i++)
    {
        const prevTimeStored = prevTime
        const prevAngleStored = prevAngle
        const prevXRadiusStored = prevXRadius
        const prevYRadiusStored = prevYRadius
        const prevXOffsetStored = prevXOffset
        const prevYOffsetStored = prevYOffset

        const nextTime = keyframes[i][0]
        const nextAngle = keyframes[i][1]
        const nextXRadius = keyframes[i][2]
        const nextYRadius = keyframes[i][3]
        const nextXOffset = keyframes[i][4]
        const nextYOffset = keyframes[i][5]

        const fun = function(time: number): remapper.Vec2
        {
            //console.log("nextTime:" + nextTime)
            //console.log("nextAngle:" + nextAngle)
            //console.log("nextXRadius:" + nextXRadius)
            //console.log("nextYRadius:" + nextYRadius)
            //console.log("nextXOffset" + nextXOffset)
            //console.log("nextYOffset:" + nextYOffset)

            const prop = (time - prevTimeStored)/(nextTime - prevTimeStored)
            const curAngle = lerp(prevAngleStored,nextAngle,prop,angleEasing)
            const curXRadius = lerp(prevXRadiusStored,nextXRadius,prop,radiusEasing)
            const curYRadius = lerp(prevYRadiusStored,nextYRadius,prop,radiusEasing)
            const curXOffset = lerp(prevXOffsetStored,nextXOffset,prop,positionEasing)
            const curYOffset = lerp(prevYOffsetStored,nextYOffset,prop,positionEasing)

            //console.log("prevTimeStored:"+prevTimeStored)

            //console.log("prop:"+prop)
            //console.log("curAngle:"+curAngle)
            //console.log("curXRadius:"+curXRadius)
            //console.log("curYRadius:"+curYRadius)
            //console.log("curXOffset:"+curXOffset)
            //console.log("curYOffset:"+curYOffset)

            const x = curXOffset + curXRadius*Math.cos(curAngle)
            const y = curYOffset + curYRadius*Math.sin(curAngle)

            //console.log("x:"+x)
            //console.log("y:"+y)

            return [x,y]
        }

        sections.push([nextTime,fun])

        prevTime = nextTime
        prevAngle = nextAngle
        prevXRadius = nextXRadius
        prevYRadius = nextYRadius
        prevXOffset = nextXOffset
        prevYOffset = nextYOffset
    }

    //sections.reverse()

    return function(time: number)
    {     
        //console.log("Placing bomb on time: " + time)  
        for(let i = 0; i < sections.length; i++)
        {
            const curSection = sections[i]
            const curEnd = curSection[0]
            const curFun = curSection[1]

            //console.log("cur section end: " + curEnd)
            if(time <= curEnd)
            {
                //console.log("It's this one.")
                const result = curFun(time)
                //console.log("Resultime vector: " + result)
                return result
            }
        }

        //console.log("ERROR INTERPOLATING PATH!")
        return [0,0]
    }
}