import * as remapper from "https://deno.land/x/remapper@4.2.3/src/mod.ts";
import { BSBasicObject, Filter, Identifier, Linker } from "./types.ts";

export function joinLinkers<T>(linkers: Linker<T>[]): Linker<T>
{
    return function(t: T)
    {        
        return linkers.map((linker) => linker(t)).flat()        
    }
}

// Links each note in a pattern to the whole pattern that the pattern is linked to
export function patternLinkerToNoteLinker(patterns: remapper.ColorNote[][], patternLinker: Linker<remapper.ColorNote[]>, identifier: Identifier<remapper.ColorNote>): Linker<remapper.ColorNote>
{
    return function(t: remapper.ColorNote)
    {
        for(let i = 0; i < patterns.length; i++)
        {
            const pattern = patterns[i]
            for(let j = 0; j < pattern.length; j++)
            {
                if(identifier(t,pattern[j]))
                {
                    const linkedPattern = patternLinker(pattern)
                    
                    if(linkedPattern.length > 0)
                    {
                        return linkedPattern[0]
                    }
                    else
                    {
                        return []
                    }
                }
            }
        }

        return []
    }    
}

// Links elements to the one that comes count positions after, in the order that they come. Count can be negative to link backwards.
export function countLinker<T>(elements: T[], count: number, identifier: Identifier<T>): Linker<T>
{
    return function(t: T)
    {
        for(let i = Math.max(0,0-count); i < Math.min(elements.length - count,elements.length); i++)
        {
            if(identifier(t,elements[i]))
            {
                return [elements[i+count]]
            }
        }

        return []
    }
}

export function beatLinker<T extends BSBasicObject>(elements: T[], numLinker: Linker<number>): Linker<T>
{
    return function(t: T)
    {
        const beatNums = numLinker(t.beat)

        return elements.filter((t2) => beatNums.indexOf(t2.beat) != -1)
    }
}