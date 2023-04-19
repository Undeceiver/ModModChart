import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";
import { Effect, Grouper, StringGrouper, NumberGrouper, GroupEffect, StringGroupEffect, NumberGroupEffect, BSObject } from "./types.ts";
import { parameterizeEffect } from "./effects.ts";

export function groupEffect<T,V>(grouper: Grouper<T,V>, effect: GroupEffect<T,V>): Effect<T>
{
    return parameterizeEffect(
        function (t: T)
        {
            return effect(grouper(t))
        })
}

export function customDataGrouper<T extends BSObject, V>(groupName: string): Grouper<T,V>
{
    return function(t: T)
    {
        return t.customData[groupName] as V
    }
}

export function timeGrouper<T extends BSObject>(frequency = 1, offset = 0): NumberGrouper<T>
{
    return function(t: T)
    {
        return (t.time - offset) % frequency
    }
}

// dictGroupEffect TODO

// We use an array of pairs instead of a dictionary because we use an epsilon for checking the time and this makes it easier to traverse the group definition.
export function discreteTimeGroupEffect<T>(effects: [number,Effect<T>][], epsilon = 0.05): NumberGroupEffect<T>
{
    return function(time: number)
    {
        for(const deftime of effects)
        {
            if(Math.abs(time-deftime[0]) < epsilon)
            {
                return deftime[1]
            }
        }

        throw new Error("Could not identify the group of object with time: " + time)
    }
}