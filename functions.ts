import { NoteFilter, BombFilter, WallFilter, Filter, Effect, Creator, CustomDataField, BSObject } from "./types.ts";
import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";

// These wrappers hardly do anything, so arguably they're unnecessary. Don't use them if you prefer to use ReMapper directly for this.
export function selectAllNotes(): remapper.Note[]
{
    return remapper.activeDiffGet().notes
}

export function selectAllBombs(): remapper.Bomb[]
{
    return remapper.activeDiffGet().bombs
}

export function selectAllWalls(): remapper.Wall[]
{
    return remapper.activeDiffGet().walls
}
// In addition, you're encouraged to use the "between" functions of ReMapper as a starting point for a note array.

/*
* Selecting objects
*/

// Wrapper for .filter
export function filterObjects<T>(objects: T[], filter: Filter<T>): T[]
{
    return objects.filter(filter)
}

export function selectNotes(filter: NoteFilter): remapper.Note[]
{
    return selectAllNotes().filter(filter)
}

export function selectBombs(filter: BombFilter): remapper.Bomb[]
{
    return selectAllBombs().filter(filter)
}

export function selectWalls(filter: WallFilter): remapper.Wall[]
{
    return selectAllWalls().filter(filter)
}

/*
* Applying effects
*/

// Wrapper for evaluation of an effect
export function applyEffect<T>(effect: Effect<T>, t: T)
{
    effect(t)
}

// Wrapper for mapping an effect to an array
export function mapEffect<T>(effect: Effect<T>): Effect<T[]>
{
    return function(objects: T[])
    {
        objects.map(effect)
    }
}

/*
* Combining creation with effects
*/
export function createWithEffect<T>(creator: Creator<T>, effect: Effect<T[]>): Creator<T>
{
    return function(t: T)
    {
        const results: T[] =  creator(t)

        effect(results)

        return results
    }
}

export function createWithIndividualEffect<T>(creator: Creator<T>, effect: Effect<T>): Creator<T>
{
    return createWithEffect(creator,mapEffect(effect))
}

export function mapCreate<T>(creator: Creator<T>): Creator<T[]>
{
    return function(objects: T[])
    {
        return objects.map(creator)
    }
}

export function customDataField(field: string, subfield: CustomDataField | undefined = undefined)
{
    return {field: field, subfield: subfield}
}

function getCustomDataFieldInner<V>(customData: Record<string,unknown>, field: CustomDataField): V
{
    if(field.subfield === undefined)
    {
        return customData[field.field] as V
    }
    else
    {
        return getCustomDataFieldInner(customData[field.field] as Record<string,unknown>,field.subfield)
    }
}

export function getCustomDataField<T extends BSObject,V>(field: CustomDataField): ((t: T) => V)
{
    return function(t: T): V
    {
        return getCustomDataFieldInner(t.customData,field)
    }
}