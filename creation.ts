import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";
import { Effect, Creator, GroupEffect, NumberGroupEffect, BSBasicObject, CustomDataField, BSObject } from "./types.ts";
import { LightRemapper } from "https://deno.land/x/remapper@3.1.1/src/light_remapper.ts";
import { nothingGroupEffect } from "./groups.ts";
import { createWithEffect, createWithIndividualEffect, getCustomDataField } from "./functions.ts";

export function noCreation<T>(): Creator<T>
{
    return function(t:T)
    {
        return []
    }
}
export function parameterizeCreation<T>(creator: ((t:T) => Creator<T>)): Creator<T>
{
    return function(t:T)
    {
        return creator(t)(t)
    }
}

export function parameterizeCreationByField<T,K extends keyof T>(field: K, creator: (v: T[K]) => Creator<T>): Creator<T>
{
    return function(t: T)
    {
        return creator(t[field])(t)
    }
}

export function parameterizeCreationByCustomData<T extends BSBasicObject,V>(field: CustomDataField, creator: (v: V) => Creator<T>): Creator<T>
{
    return function(t: T)
    {
        return creator(getCustomDataField<T,V>(field)(t))(t)
    }
}

export function createWalls(copies = 1, fn: NumberGroupEffect<remapper.Wall> = nothingGroupEffect, fake = false ): Creator<remapper.Wall>
{
    return function(owall: remapper.Wall)
    {
        const result: remapper.Wall[] = []
        for(let i = 0; i < copies; i++)
        {
            const wall = new remapper.Wall()
            fn(i)(wall)
            wall.push(fake,false)
            result.push(wall)
        }
        return result
    }
}

export function createNotes(copies = 1, fn: NumberGroupEffect<remapper.Note> = nothingGroupEffect, fake = false): Creator<remapper.Note>
{
    return function(onote: remapper.Note)
    {
        const result: remapper.Note[] = []
        for(let i = 0; i < copies; i++)
        {
            const note = new remapper.Note()
            fn(i)(note)
            note.push(fake,false)
            result.push(note)
        }
        return result
    }
}

export function createBombs(copies = 1, fn: NumberGroupEffect<remapper.Bomb> = nothingGroupEffect, fake = false): Creator<remapper.Bomb>
{
    return function(onote: remapper.Bomb)
    {
        const result: remapper.Bomb[] = []
        for(let i = 0; i < copies; i++)
        {
            const bomb = new remapper.Bomb()
            fn(i)(bomb)
            bomb.push(fake,false)
            result.push(bomb)
        }
        return result
    }
}


export function copyObject<T extends BSObject>(copies = 1, fn: NumberGroupEffect<T> = nothingGroupEffect, fake = false): Creator<T>
{
    return function(t:T)
    {
        const result: T[] = []
        for(let i = 0; i < copies; i++)
        {
            const obj = remapper.copy(t)
            obj.animate = new remapper.Animation().noteAnimation(obj.animation);
            fn(i)(obj)
            obj.push(fake,false)
            result.push(obj)
        }
        return result
    }
}

export function effectOnFake<T extends BSBasicObject>(effect: Effect<T>): Creator<T>
{
    return createWithIndividualEffect(copyObject<T>(1,nothingGroupEffect,true),effect)
}