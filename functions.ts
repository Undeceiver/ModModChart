import { NoteFilter, BombFilter, WallFilter, Filter, Effect, CreatorV3, CustomDataField, BSBasicObject, NumberGroupEffect, NoteEffect, SelectorV3, NoteSelectorV3, BombSelectorV3, WallSelectorV3 } from "./types.ts";
import * as remapper from "https://deno.land/x/remapper@4.2.3/src/mod.ts";

// These wrappers hardly do anything, so arguably they're unnecessary. Don't use them if you prefer to use ReMapper directly for this.
export function selectAllNotesV3(): NoteSelectorV3
{    
    return function(map: remapper.V3Difficulty): remapper.ColorNote[]
    {
        return map.colorNotes
    }
}

export function selectAllBombsV3(): BombSelectorV3
{
    return function(map: remapper.V3Difficulty): remapper.Bomb[]
    {
        return map.bombs
    }
}

export function selectAllWallsV3(): WallSelectorV3
{
    return function(map: remapper.V3Difficulty): remapper.Wall[]
    {
        return map.walls
    }
}

/*export function selectAllChains(): remapper.Chain[]
{
    return remapper.activeDiffGet().chains
}*/



// In addition, you're encouraged to use the "between" functions of ReMapper as a starting point for a note array.

/*
* Selecting objects
*/

export function filterSelectorV3<T>(selector: SelectorV3<T>, filter: Filter<T>): SelectorV3<T>
{
    return function(map: remapper.V3Difficulty): T[]
    {
        return selector(map).filter(filter)
    }
}

export function selectNotesV3(filter: NoteFilter): NoteSelectorV3
{
    return filterSelectorV3(selectAllNotesV3(),filter)
}

export function selectBombsV3(filter: BombFilter): BombSelectorV3
{
    return filterSelectorV3(selectAllBombsV3(),filter)
}

export function selectWalls(filter: WallFilter): WallSelectorV3
{
    return filterSelectorV3(selectAllWallsV3(),filter)
}

// A more general version of this with more than two options would make sense too.
export function filterEffect<T>(filter: Filter<T>, trueEffect: Effect<T>, falseEffect: Effect<T>): Effect<T>
{
    return function(t: T)
    {
        if(filter(t))
        {
            trueEffect(t)
        }
        else
        {
            falseEffect(t)
        }
    }
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

export function runVoidEffect(effect: Effect<void>): void
{
    effect()
}

/*
* Combining creation with effects
*/
export function createWithEffectV3<T>(creator: CreatorV3<T>, effect: Effect<T[]>): CreatorV3<T>
{
    return function(t: T)
    {
        return function(map: remapper.V3Difficulty)
        {
            const results: T[] =  creator(t)(map)

            effect(results)

            return results
        }
    }
}

export function createWithIndividualEffectV3<T>(creator: CreatorV3<T>, effect: Effect<T>): CreatorV3<T>
{
    return createWithEffectV3(creator,mapEffect(effect))
}

export function createAndEffectV3<T>(creator: CreatorV3<T>, effect: Effect<T>): CreatorV3<T>
{
    return function(t: T)
    {
        return function(map: remapper.V3Difficulty)
        {
            const results: T[] = creator(t)(map)

            effect(t)

            return results
        }
    }
}

export function mapCreateV3<T>(creator: CreatorV3<T>): CreatorV3<T[]>
{
    return function(objects: T[])
    {
        return function(map: remapper.V3Difficulty)
        {
            return objects.map(function(t: T)
            {
                return creator(t)(map)
            })
        }
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

export function getCustomDataField<T extends BSBasicObject,V>(field: CustomDataField): ((t: T) => V)
{
    return function(t: T): V
    {
        return getCustomDataFieldInner(t.unsafeCustomData,field)
    }
}