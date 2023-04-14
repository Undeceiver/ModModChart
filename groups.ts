import { Effect, NoteEffect, BombEffect, WallEffect, GroupDefinition } from "./types.ts";
import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";
import { parameterizeEffect } from "./effects.ts";

export function customDataGroup<T extends remapper.Note | remapper.Bomb | remapper.Wall,V>(): GroupDefinition<T,string,V>
{
    return function(name: string)        
    {
        return function(t: T)
        {
            return t.customData[name] as V
        }
    }    
}

export function arrayGroup<T>() : GroupDefinition<T,T[],number>
{
    return function(array: T[])
    {
        return function(t: T)
        {
            for(let i = 0; i < array.length; i++)
            {
                if(array[i] === t)
                {
                    return i
                }
            }

            return -1
        }
    }
}

export function groupEffect<T,N,V>(group: GroupDefinition<T,N,V>, effect: ((v: V) => Effect<T>), name: N): Effect<T>
{
    return parameterizeEffect(
        function(t: T): Effect<T>
        {
            const v: V = group(name)(t)

            return effect(v)
        }
    )
}

export function createGroups<T>(groupFn: (t:T) => string, ts: T[]): T[][]
{
    const groups : Record<string,T[]> = {}

    for(const t of ts)
    {
        const key: string = groupFn(t)

        let group: T[] | undefined = groups[key]

        if(group === undefined)
        {
            group = []
        }

        group.push(t)

        groups[key] = group
    }

    const result: T[][] = []

    for(const key in groups)
    {        
        const group = groups[key]

        result.push(group)
    }

    return result
}

export function createGroupsByBeat<T extends remapper.Note | remapper.Bomb | remapper.Wall>(groupFn: (beat:number) => string, ts: T[]): T[][]
{
    return createGroups(function(t: T) { return groupFn(t.time) }, ts)
}

export function createAdjacentGroups<T extends remapper.Note | remapper.Bomb | remapper.Wall>(groupStart: number, groupLength: number, ts: T[]): T[][]
{
    const groupFn = function(beat: number)
    {
        return (Math.floor(beat-groupStart)/groupLength).toString()
    }

    return createGroupsByBeat(groupFn, ts)
}