import { Effect, NoteEffect, BombEffect, WallEffect, BSObject } from "./types.ts";
import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";
import * as util from "./util.ts"

/*
* Combining effects
*/
export function combineEffects<T>(effects: Effect<T>[]): Effect<T>
{
    return function(t: T)
    {
        for(const effect of effects)
        {
            effect(t)
        }
    }
}

/*
* Parametric effects
*/

export function parameterizeEffect<T>(effect: (t: T) => Effect<T>): Effect<T>
{
    return function(t: T)
    {
        effect(t)(t)
    }
}

export function parameterizeEffectByField<T,K extends keyof T>(field: K, effect: (v: T[K]) => Effect<T>): Effect<T>
{
    return function(t: T)
    {
        effect(t[field])(t)
    }
}

/*
* Enabling / disabling things
*/
export function enableValue<T,K extends keyof T>(field: K): Effect<T>
{
    return setValueEffect(field,true as T[K])
}

export function disableValue<T,K extends keyof T>(field: K): Effect<T>
{
    return setValueEffect(field,false as T[K])
}

export function toggleValue<T,K extends keyof T>(field: K): Effect<T>
{
    return parameterizeEffect(
        function(t: T)
        {
            return setValueEffect(field,(!(t[field] as boolean)) as T[K])
        })
}

export function disableNoteGravity<T extends remapper.Note | remapper.Bomb>(): Effect<T>
{
    return disableValue("noteGravity")
}

export function disableSpawnEffect<T extends remapper.Note | remapper.Bomb>(): Effect<T>
{
    return disableValue("spawnEffect")
}

export function disableNoteLook<T extends remapper.Note | remapper.Bomb>(): Effect<T>
{
    return disableValue("noteLook")
}

/*
* Setting values
*/

// Set a value
export function setValueEffect<T,K extends keyof T>(field: K, value: T[K]): Effect<T>
{
    return function(t: T)
    {
        t[field] = value
    }
}

export function addValueEffect<T,K extends keyof T>(field: K, value: number): Effect<T>
{
    return function(t: T)
    {
        t[field] = (t[field] as number) + value as T[K]
    }
}

export function setNJS<T extends remapper.Note | remapper.Wall | remapper.Bomb>(njs: number): Effect<T>
{
    return setValueEffect("NJS", njs)    
}

export function addNJS<T extends remapper.Note | remapper.Wall | remapper.Bomb>(njs: number): Effect<T>
{
    return addValueEffect("NJS", njs)    
}

export function setOffset<T extends remapper.Note | remapper.Wall | remapper.Bomb>(offset: number): Effect<T>
{
    return setValueEffect("offset", offset)
}

export function addOffset<T extends remapper.Note | remapper.Wall | remapper.Bomb>(offset: number): Effect<T>
{
    return addValueEffect("offset", offset)    
}

export function setHJD<T extends remapper.Note | remapper.Wall | remapper.Bomb>(hjd: number): Effect<T>
{
    return parameterizeEffectByField("halfJumpDur",
        function(halfJumpDur: number)
        {
            return parameterizeEffectByField("offset",
                function(offset: number)
                {
                    return setOffset(offset+hjd-halfJumpDur)
                })
            })        
}

export function addHJD<T extends remapper.Note | remapper.Wall | remapper.Bomb>(hjd: number): Effect<T>
{
    return addOffset(hjd)
}

export function setPosition<T extends remapper.Note | remapper.Wall | remapper.Bomb>(position: remapper.Vec2): Effect<T>
{
    return setValueEffect("position",position)
}

export function initializePosition<T extends remapper.Note | remapper.Wall | remapper.Bomb>(): Effect<T>
{
    return parameterizeEffectByField("x",
        function(x: number)
        {
            return parameterizeEffectByField("y",
                function(y: number)
                {
                    return setPosition([util.fromVanillaToNEX(x),util.fromVanillaToNEY(y)] as remapper.Vec2)
                })            
        })
}

export function addPosition<T extends remapper.Note | remapper.Wall | remapper.Bomb>(position: remapper.Vec2): Effect<T>
{
    return parameterizeEffectByField("position",
        function(prevPosition: remapper.Vec2)
        {
            return setPosition([position[0] + prevPosition[0],position[1] + prevPosition[1]] as remapper.Vec2)
        })
}

export function setWidth<T extends remapper.Wall>(width: number): Effect<T>
{
    return setValueEffect("width",width)
}

export function addWidth<T extends remapper.Wall>(width: number): Effect<T>
{
    return addValueEffect("width",width)
}

export function setScale<T extends remapper.Wall>(scale: remapper.Vec3): Effect<T>
{
    return setValueEffect("scale",scale)
}

export function initializeScale<T extends remapper.Wall>(): Effect<T>
{
    return parameterizeEffectByField("width",
        function(width: number)
        {
            return parameterizeEffectByField("height",
                function(height: number)
                {
                    return parameterizeEffectByField("duration",
                        function(duration: number)
                        {
                            return parameterizeEffectByField("NJS",
                                function(njs: number)
                                {
                                    return setScale([width, height, duration*njs] as remapper.Vec3)
                                })                            
                        })
                })            
        })
}

export function addScale<T extends remapper.Wall>(scale: remapper.Vec3): Effect<T>
{
    return parameterizeEffectByField("scale",
        function(prevScale: remapper.Vec3)
        {
            return setScale([scale[0] + prevScale[0],scale[1] + prevScale[1],scale[2] + prevScale[2]] as remapper.Vec3)
        })
}


/*
* Path animations
*/
export function animateDefinitePosition<T extends BSObject>(definitePosition: remapper.KeyframesVec3): Effect<T>
{
    return function(obj: BSObject)
    {
        obj.animate.definitePosition = definitePosition        
    }
}

export function animatePosition<T extends BSObject>(position: remapper.KeyframesVec3): Effect<T>
{
    return function(obj: BSObject)
    {
        obj.animate.position = position
    }
}

export function animateDissolve<T extends remapper.Note | remapper.Bomb>(dissolve: remapper.KeyframesLinear): Effect<T>
{
    return function(obj: remapper.Note | remapper.Bomb)
    {
        obj.animate.dissolve = dissolve
    }
}

export function animateDissolveArrow<T extends remapper.Note | remapper.Bomb>(dissolveArrow: remapper.KeyframesLinear): Effect<T>
{
    return function(obj: remapper.Note | remapper.Bomb)
    {
        obj.animate.dissolveArrow = dissolveArrow
    }
}

export function animateScale<T extends BSObject>(scale: remapper.KeyframesVec3): Effect<T>
{
    return function(obj: BSObject)
    {
        obj.animate.scale = scale
    }
}