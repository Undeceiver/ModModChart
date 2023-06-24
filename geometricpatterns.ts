import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";
import { Creator, LinePattern, LineSampler, NumberGroupEffect, PointTimeSamples, SurfacePattern, SurfaceSampler, TimeLinePattern, TimePattern, TimeSampler, TimeSamples, TimeSurfacePattern } from "./types.ts";
import { periodicEffect } from "./effectslibrary.ts";
import { Bomb } from "https://deno.land/x/remapper@3.1.1/src/note.ts";
import { combineEffects, disableNoteGravity, initializePosition, initializeScale, setDuration, setPosition, setScale, setTime } from "./effects.ts";
import { createBombs, createWalls } from "./creation.ts";

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

export function placeWalls(points: [number,remapper.Vec2][], wallDist: number, wallside: number, fake = false): Creator<remapper.Wall>
{
    const groupEffect: NumberGroupEffect<remapper.Wall> =
        function(i: number)
        {
            const initPos = initializePosition()
            const setPos = setPosition(points[i][1])
            const setTimeEf = setTime(points[i][0])
            const setDurationEf = setDuration(wallDist)
            const initScale = initializeScale()
            const setScaleEf = setScale([wallside,wallside,wallside])                       

            return combineEffects([initPos,setPos,setTimeEf,setDurationEf,initScale,setScaleEf])
        }
    
    return createWalls(points.length, groupEffect, fake)
}