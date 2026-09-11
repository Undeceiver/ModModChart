import * as remapper from "https://deno.land/x/remapper@4.2.3/src/mod.ts";
import { Effect, CreatorV3, GroupEffect, NumberGroupEffect, BSBasicObject, CustomDataField, BSObject } from "./types.ts";
import { nothingGroupEffect } from "./groups.ts";
import { createWithEffectV3, createWithIndividualEffectV3, getCustomDataField } from "./functions.ts";

export function noCreationV3<T>(): CreatorV3<T>
{
    return function(t:T)
    {
        return function(map: remapper.V3Difficulty)
        {
            return []
        }
    }
}
export function parameterizeCreationV3<T>(creator: ((t:T) => CreatorV3<T>)): CreatorV3<T>
{
    return function(t:T)
    {
        return function(map: remapper.V3Difficulty)
        {
            return creator(t)(t)(map)
        }
    }
}

export function parameterizeCreationByFieldV3<T,K extends keyof T>(field: K, creator: (v: T[K]) => CreatorV3<T>): CreatorV3<T>
{
    return function(t: T)
    {
        return function(map: remapper.V3Difficulty)
        {
            return creator(t[field])(t)(map)
        }
    }
}

export function parameterizeCreationByCustomDataV3<T extends BSBasicObject,V>(field: CustomDataField, creator: (v: V) => CreatorV3<T>): CreatorV3<T>
{
    return function(t: T)
    {
        return function(map: remapper.V3Difficulty)
        {
            return creator(getCustomDataField<T,V>(field)(t))(t)(map)
        }
    }
}

export function createWallsV3(copies = 1, fn: NumberGroupEffect<remapper.Wall> = nothingGroupEffect, fake = false ): CreatorV3<remapper.Wall>
{
    return function(owall: remapper.Wall)
    {
        return function(map: remapper.V3Difficulty)
        {        
            const result: remapper.Wall[] = []
            for(let i = 0; i < copies; i++)
            {
                const wall = new remapper.Wall(map,{fake:fake})
                fn(i)(wall)
                result.push(wall)
            }

            return result
        }
    }
}

export function createNotesV3(copies = 1, fn: NumberGroupEffect<remapper.ColorNote> = nothingGroupEffect, fake = false): CreatorV3<remapper.ColorNote>
{
    return function(onote: remapper.ColorNote)
    {
        return function(map: remapper.V3Difficulty)
        {
            const result: remapper.ColorNote[] = []
            for(let i = 0; i < copies; i++)
            {
                const note = new remapper.ColorNote(map,{fake:fake})
                fn(i)(note)                
                result.push(note)
            }

            return result
        }
    }
}

export function createBombsV3(copies = 1, fn: NumberGroupEffect<remapper.Bomb> = nothingGroupEffect, fake = false): CreatorV3<remapper.Bomb>
{
    return function(onote: remapper.Bomb)
    {
        return function(map: remapper.V3Difficulty)
        {
            const result: remapper.Bomb[] = []
            for(let i = 0; i < copies; i++)
            {
                const bomb = new remapper.Bomb(map,{fake:fake})
                fn(i)(bomb)
                result.push(bomb)
            }

            return result
        }
    }
}


export function copyObjectV3<T extends BSObject>(copies = 1, fn: NumberGroupEffect<T> = nothingGroupEffect, fake = false): CreatorV3<T>
{
    return function(t:T)
    {
        return function(map: remapper.V3Difficulty)
        {
            const result: T[] = []
            for(let i = 0; i < copies; i++)
            {
                const obj = remapper.copy(t)
                //obj.animate = new remapper.Animation().noteAnimation(obj.animation);
                fn(i)(obj)                
                result.push(obj)
            }

            return result
        }
    }
}

export function effectOnFakeV3<T extends BSBasicObject>(effect: Effect<T>): CreatorV3<T>
{
    return createWithIndividualEffectV3(copyObjectV3<T>(1,nothingGroupEffect,true),effect)
}