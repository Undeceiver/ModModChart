import { Effect, NoteEffect, BombEffect, WallEffect, BSBasicObject, CustomDataField, TrackAnimationV3, TrackAnimationDefinition, BSObject } from "./types.ts";
import * as remapper from "https://deno.land/x/remapper@4.2.3/src/mod.ts";
import * as util from "./util.ts"
import { mapEffect } from "./functions.ts";
import { getCustomDataField } from "./functions.ts";

export function noEffect<T>(): Effect<T>
{
    return function(t:T)
    {
        return
    }
}
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

export function parameterizeEffectByCustomData<T extends BSBasicObject,V>(field: CustomDataField, effect: (v: V) => Effect<T>): Effect<T>
{
    return function(t: T)
    {           
        effect(getCustomDataField<T,V>(field)(t))(t)
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
        function(t: T)        {           
            
            return setValueEffect(field,(!(t[field] as boolean)) as T[K])
        })
}

export function disableNoteGravity<T extends remapper.ColorNote | remapper.Bomb>(): Effect<T>
{
    return enableValue("disableNoteGravity")
}

export function disableSpawnEffect<T extends remapper.ColorNote | remapper.Bomb>(): Effect<T>
{
    return disableValue("spawnEffect")
}

export function disableNoteLook<T extends remapper.ColorNote | remapper.Bomb>(): Effect<T>
{   
    return enableValue("disableNoteLook")
}

export function setFlip(flip: remapper.Vec2): Effect<remapper.ColorNote>
{
    return setValueEffect("flip",flip)
}

export function disableFlip(): Effect<remapper.ColorNote>
{
    return parameterizeEffect(function(t: remapper.ColorNote)
    {
        return setValueEffect("flip",[t.x-2,0])
    })
}

export function disableBadCutSaberType<T extends remapper.ColorNote>(): Effect<T>
{
    return enableValue("disableBadCutSaberType")
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

export function setNJS<T extends BSObject>(njs: number): Effect<T>
{    
    return setValueEffect("noteJumpMovementSpeed", njs)    
}

export function addNJS<T extends BSObject>(njs: number): Effect<T>
{
    return addValueEffect("noteJumpMovementSpeed", njs)    
}

export function setOffset<T extends BSObject>(offset: number): Effect<T>
{
    return setValueEffect("noteJumpStartBeatOffset", offset)
}

export function addOffset<T extends BSObject>(offset: number): Effect<T>
{
    return addValueEffect("noteJumpStartBeatOffset", offset)    
}

export function setHJD<T extends BSObject>(hjd: number): Effect<T>
{
    return parameterizeEffectByField("halfJumpDuration",
        function(halfJumpDur: number)
        {
            return parameterizeEffectByField("noteJumpStartBeatOffset",
                function(offset: number | undefined)
                {
                    offset = offset ?? 0

                    return setOffset(offset+hjd-halfJumpDur)                    
                })
            })        
}

export function addHJD<T extends BSObject>(hjd: number): Effect<T>
{
    return addOffset(hjd)
}

export function setDuration(duration: number): Effect<remapper.Wall>
{
    return setValueEffect("duration",duration)
}

export function addDuration(duration: number): Effect<remapper.Wall>
{
    return addValueEffect("duration",duration)
}

export function setBeat<T extends BSObject>(beat: number): Effect<T>
{
    return setValueEffect("beat",beat)
}

export function addBeat<T extends BSObject>(beat: number): Effect<T>
{
    return addValueEffect("beat",beat)
}

export function setCutDirection<T extends remapper.ColorNote | remapper.Chain>(cutDirection: remapper.NoteCut): Effect<T>
{
    return function(t: T)
        {
            t.cutDirection = cutDirection            
        }
}

// Vanilla x and y. Relevant mostly for spawn effects
export function setX<T extends BSObject>(x: number): Effect<T>
{
    return setValueEffect("x",x)
}

export function setY<T extends BSObject>(y: number): Effect<T>
{
    return setValueEffect("y",y)
}


export function setCoordinates<T extends BSObject>(coordinates: remapper.Vec2): Effect<T>
{
    return setValueEffect("coordinates",coordinates)
}

export function initializePosition<T extends BSObject>(): Effect<T>
{
    return parameterizeEffect(
        function(t: T)
        {
            return parameterizeEffect(
                function(t: T)
                {
                    if("coordinates" in t.unsafeCustomData)                    
                    {
                        return noEffect()
                    }
                    else
                    {
                        return setCoordinates([util.fromVanillaToNEX(t.x),util.fromVanillaToNEY(t.y)] as remapper.Vec2)
                    }
                })            
        })
}

export function initializeRotation<T extends remapper.ColorNote>(): Effect<T>
{
    return parameterizeEffect(
        function(t: T)
        {
            return parameterizeEffect(
                function(t: T)
                {
                    if("localRotation" in t.unsafeCustomData)                    
                    {
                        return noEffect()
                    }
                    else
                    {
                        const localRotEf = setLocalRotation([0,0,t.angleOffset] as remapper.Vec3)
                        const offsetEf: Effect<T> = setValueEffect("angleOffset",0)

                        return combineEffects([localRotEf,offsetEf])
                    }
                })            
        })
}

export function addCoordinates<T extends remapper.ColorNote | remapper.Wall | remapper.Bomb>(coordinates: remapper.Vec2): Effect<T>
{
    return parameterizeEffectByField("coordinates",
        function(prevCoordinates: remapper.Vec2 | undefined)
        {
            prevCoordinates = prevCoordinates ?? [0,0]
            return setCoordinates([coordinates[0] + prevCoordinates[0],coordinates[1] + prevCoordinates[1]] as remapper.Vec2)
        })
}

export function addX<T extends BSObject>(x: number): Effect<T>
{
    return parameterizeEffectByField("x",
        function(prevX: number)
        {
            return setX(prevX+x)
        })
}

export function addY<T extends BSObject>(y: number): Effect<T>
{
    return parameterizeEffectByField("y",
        function(prevY: number)
        {
            return setX(prevY+y)
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

export function setAngle(angle: number): Effect<remapper.ColorNote>
{
    return setValueEffect("angleOffset",Math.round(angle))
}

export function addAngle(angle: number): Effect<remapper.ColorNote>
{
    return addValueEffect("angleOffset",Math.round(angle))
}

export function setScale<T extends remapper.Wall>(scale: remapper.Vec3): Effect<T>
{
    return setValueEffect("scale",scale)
}

export function initializeScale<T extends remapper.Wall>(): Effect<T>
{
    return parameterizeEffect(
        function(t: T)
        {
            return parameterizeEffect(
                function(t: T)
                {
                    return parameterizeEffect(
                        function(t: T)
                        {
                            return parameterizeEffect(
                                function(t: T)
                                {                                    
                                    if("size" in t.unsafeCustomData)
                                    {
                                        return noEffect()
                                    }
                                    else
                                    {
                                        return setScale([t.width, t.height, null as unknown as number] as remapper.Vec3)
                                    }
                                })                            
                        })
                })            
        })
}

export function setLocalRotation<T extends BSBasicObject>(localRotation: remapper.Vec3): Effect<T>
{
    return setValueEffect("localRotation",localRotation)
}

export function setWorldRotation<T extends BSBasicObject>(worldRotation: remapper.Vec3): Effect<T>
{
    return setValueEffect("worldRotation",worldRotation)
}

export function setUninteractable<T extends BSBasicObject>(uninteractable = true): Effect<T>
{
    return setValueEffect("uninteractable",uninteractable)
}

export function setChromaColor<T extends BSBasicObject>(red: number, green: number, blue: number, alpha: number): Effect<T>
{
    return setValueEffect("chromaColor",[red,green,blue,alpha])
}

/*
* Path animations
*/
export function animateDefinitePosition<T extends BSBasicObject>(definitePosition: remapper.ComplexPointsVec3): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animation.definitePosition = definitePosition        
    }
}

export function animatePosition<T extends BSBasicObject>(position: remapper.ComplexPointsVec3): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animation.position = position
    }
}

export function animateDissolve<T extends BSObject>(dissolve: remapper.ComplexPointsLinear): Effect<T>
{
    return function(obj: BSObject)
    {
        obj.animation.dissolve = dissolve
    }
}

export function animateDissolveArrow<T extends remapper.ColorNote | remapper.Bomb | remapper.Chain>(dissolveArrow: remapper.ComplexPointsLinear): Effect<T>
{
    return function(obj: remapper.ColorNote | remapper.Bomb | remapper.Chain)
    {
        obj.animation.dissolveArrow = dissolveArrow
    }
}

export function animateScale<T extends BSBasicObject>(scale: remapper.ComplexPointsVec3): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animation.scale = scale
    }
}

export function animateWorldRotation<T extends BSBasicObject>(rotation: remapper.ComplexPointsVec3): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animation.rotation = rotation
    }
}

export function animateLocalRotation<T extends BSBasicObject>(rotation: remapper.ComplexPointsVec3): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animation.localRotation = rotation
    }
}

export function animateUninteractable<T extends BSBasicObject>(uninteractable: remapper.ComplexPointsLinear): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animation.uninteractable = uninteractable
    }
}

/*
* Track animations
*/
export function addTrack<T extends BSBasicObject>(track: remapper.TrackValue): Effect<T>
{
    return function(t: T)
    {
        t.track.add(track)
    }
}

// This should only be used in some cases, not in general
export function trackAnimationEffect<T extends BSBasicObject>(map: remapper.V3Difficulty, animation: TrackAnimationV3, track: remapper.TrackValue, timeVariation = 0): Effect<T>
{
    return function(t:T)
    {
        addTrack(track)(t)

        animation(map)(t.beat+timeVariation)(track)
    }
}

export function animateTrack(duration: number, animation: TrackAnimationDefinition, easing: remapper.EASE | undefined = undefined): TrackAnimationV3
{

    return function(map: remapper.V3Difficulty)
    {
        return function(time: number)
        {
            return function(track: remapper.TrackValue)
            {
                const event = remapper.animateTrack(map,
                    {
                        beat: time,
                        duration: duration,
                        track: track,
                        easing: easing
                    })                
                
                animation(duration,event)
            }
        }
    }
}

// Use the keyframes with absolute times, it gets translated to proportions
export function animatePositionTrack(position: remapper.ComplexPointsVec3): TrackAnimationDefinition
{
    return function(duration, event)
    {        
        event.animation.offsetPosition = util.beatsToTrackAnimationPVec3(duration)(position)        
    }
}

export function animateScaleTrack(scale: remapper.ComplexPointsVec3): TrackAnimationDefinition
{
    return function(duration, event)
    {
        event.animation.scale = util.beatsToTrackAnimationPVec3(duration)(scale)
    }
}

export function animateRotationTrack(worldRotation: remapper.ComplexPointsVec3): TrackAnimationDefinition
{
    return function(duration, event)
    {        
        event.animation.rotation = util.beatsToTrackAnimationPVec3(duration)(worldRotation)
    }
}

export function animateWorldRotationTrack(worldRotation: remapper.ComplexPointsVec3): TrackAnimationDefinition
{
    return function(duration, event)
    {        
        event.animation.offsetRotation = util.beatsToTrackAnimationPVec3(duration)(worldRotation)
    }
}

export function animateDissolveTrack(dissolve: remapper.ComplexPointsLinear): TrackAnimationDefinition
{
    return function(duration, event)
    {
        event.animation.dissolve = util.beatsToTrackAnimationPLinear(duration)(dissolve)
    }
}

export function animateDissolveArrowTrack(dissolve: remapper.ComplexPointsLinear): TrackAnimationDefinition
{
    return function(duration, event)
    {
        event.animation.dissolveArrow = util.beatsToTrackAnimationPLinear(duration)(dissolve)
    }
}
