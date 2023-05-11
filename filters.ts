import { BSObject, Filter } from "./types.ts";
import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";

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
export function labelFilter<T extends remapper.Note | remapper.Bomb | remapper.Wall>(label:string): Filter<T>
{
    return function(t: T)
    {
        return t.customData[label] === true
    }
}

export function groupFilter<T extends remapper.Note | remapper.Bomb | remapper.Wall>(groupName:string): Filter<T>
{
    return function(t: T)
    {
        return groupName in t.customData
    }
}

// inclusive start, exclusive end
export function beatFilter<T extends remapper.Note | remapper.Bomb | remapper.Wall>(start: number, end: number, startInclusive = true, endInclusive = false): Filter<T>
{
    return function(t: T)
    {
        return ((t.time > start) || (startInclusive && t.time == start)) && ((t.time < end) || (endInclusive && t.time ==  end))
    }
}

export function beatModuloFilter<T extends BSObject>(quotient: number, minModulo: number, maxModulo: number, offset = 0)
{
    return function(t: T)
    {
        const modulo = (t.time - offset + 10000*quotient) % quotient
        if(modulo < 0)
        {
            console.log("NEGATIVE MODULO!!: " + modulo + " = " + t.time + " - " + offset + " % " + quotient)
        }

        return (modulo >= minModulo) && (modulo <= maxModulo)
    }
}

export function noteTypeFilter(type: remapper.NOTETYPE): Filter<remapper.Note>
{
    return function(t: remapper.Note)
    {
        return t.type == type
    }
}