import { BSBasicObject, BSObject, Filter } from "./types.ts";
import * as remapper from "https://deno.land/x/remapper@4.2.3/src/mod.ts";

/*
* Operations between filters. These do not seem to be standard in JavaScript / TypeScript (that I could find)
*/

export function andFilter<T>(filters: Filter<T>[])
{
    return function(t: T) {
        let result = true

        for(const filter of filters)
        {
            result = result && filter(t)
        }

        return result
    }    
}

export function orFilter<T>(filters: Filter<T>[])
{
    return function(t: T) {
        let result = false

        for(const filter of filters)
        {
            result = result || filter(t)
        }

        return result
    }    
}

/*
* Ways to filter objects
*/

// Checks if the object has an entry in customData with label:-anyvalue-
export function labelFilter<T extends BSObject>(label:string): Filter<T>
{
    return function(t: T)
    {
        return t.unsafeCustomData[label] === true
    }
}

export function groupFilter<T extends BSObject>(groupName:string): Filter<T>
{
    return function(t: T)
    {
        return groupName in t.unsafeCustomData
    }
}

// inclusive start, exclusive end
export function beatFilter<T extends BSObject>(start: number, end: number, startInclusive = true, endInclusive = false): Filter<T>
{
    return function(t: T)
    {
        return ((t.beat > start) || (startInclusive && t.beat == start)) && ((t.beat < end) || (endInclusive && t.beat ==  end))
    }
}

export function laneFilter<T extends BSObject>(lane: number): Filter<T>
{
    return function(t: T)
    {
        return t.x == lane
    }
}

export function rowFilter<T extends BSObject>(row: number): Filter<T>
{
    return function(t: T)
    {
        return t.y == row
    }
}

export function beatModuloFilter<T extends BSObject>(quotient: number, minModulo: number, maxModulo: number, offset = 0)
{
    return function(t: T)
    {
        const modulo = (t.beat - offset + 10000*quotient) % quotient
        if(modulo < 0)
        {
            console.log("NEGATIVE MODULO!!: " + modulo + " = " + t.beat + " - " + offset + " % " + quotient)
        }

        return (modulo >= minModulo) && (modulo <= maxModulo)
    }
}

export function noteColorFilter(color: remapper.NoteColor): Filter<remapper.ColorNote>
{
    return function(t: remapper.ColorNote)
    {
        return t.color == color
    }
}