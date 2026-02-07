import { Effect, NoteEffect, BombEffect, WallEffect, BSBasicObject, CustomDataField, TrackAnimation, TrackAnimationDefinition, BSObject } from "./types.ts";
import * as remapper from "file:///F:/ReMapper/src/mod.ts";
import * as util from "./util.ts"
import { mapEffect } from "./functions.ts";
import { getCustomDataField } from "./functions.ts";
import { Note } from "file:///F:/ReMapper/src/note.ts";
import { NOTETYPE } from "file:///F:/ReMapper/src/constants.ts";

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

export function disableBadCutSaberType<T extends remapper.Note>(): Effect<T>
{
    return function(note: remapper.Note)
    {
        note.customData["disableBadCutSaberType"] = true
    }
}

export function makeFakeNote(map:remapper.Difficulty): Effect<remapper.Note>
{
    return function(t: remapper.Note)
    {
        t.push(true,false)
        map.notes.splice(map.notes.indexOf(t),1)
    }
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
    return setValueEffect("NJS", njs)    
}

export function addNJS<T extends BSObject>(njs: number): Effect<T>
{
    return addValueEffect("NJS", njs)    
}

export function setOffset<T extends BSObject>(offset: number): Effect<T>
{
    return setValueEffect("offset", offset)
}

export function addOffset<T extends BSObject>(offset: number): Effect<T>
{
    return addValueEffect("offset", offset)    
}

export function setHJD<T extends BSObject>(hjd: number): Effect<T>
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

export function setTime<T extends BSObject>(time: number): Effect<T>
{
    return setValueEffect("time",time)
}

export function addTime<T extends BSObject>(time: number): Effect<T>
{
    return addValueEffect("time",time)
}

export function setDirection<T extends remapper.Note | remapper.Chain>(direction: remapper.CUT): Effect<T>
{
    return function(t: T)
        {
            if(t instanceof remapper.Note)
            {
                t.direction = direction
            }
            else if(t instanceof remapper.Chain)
            {
                t.headDirection = direction
            }
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


export function setPosition<T extends BSObject>(position: remapper.Vec2): Effect<T>
{
    return setValueEffect("position",position)
}

export function initializePosition<T extends BSObject>(): Effect<T>
{
    return parameterizeEffect(
        function(t: T)
        {
            return parameterizeEffect(
                function(t: T)
                {
                    if("coordinates" in t.customData)                    
                    {
                        return noEffect()
                    }
                    else
                    {
                        return setPosition([util.fromVanillaToNEX(t.x),util.fromVanillaToNEY(t.y)] as remapper.Vec2)
                    }
                })            
        })
}

export function initializeRotation<T extends remapper.Note>(): Effect<T>
{
    return parameterizeEffect(
        function(t: T)
        {
            return parameterizeEffect(
                function(t: T)
                {
                    if("localRotation" in t.customData)                    
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

export function addPosition<T extends remapper.Note | remapper.Wall | remapper.Bomb>(position: remapper.Vec2): Effect<T>
{
    return parameterizeEffectByField("position",
        function(prevPosition: remapper.Vec2)
        {
            return setPosition([position[0] + prevPosition[0],position[1] + prevPosition[1]] as remapper.Vec2)
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

export function setAngle(angle: number): Effect<Note>
{
    return setValueEffect("angleOffset",Math.round(angle))
}

export function addAngle(angle: number): Effect<Note>
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
                                    if("size" in t.customData)
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

export function addScale<T extends remapper.Wall>(scale: remapper.Vec3): Effect<T>
{
    return parameterizeEffectByField("scale",
        function(prevScale: remapper.Vec3)
        {
            return setScale([scale[0] + prevScale[0],scale[1] + prevScale[1],scale[2] + prevScale[2]] as remapper.Vec3)
        })
}

export function setLocalRotation<T extends BSBasicObject>(localRotation: remapper.Vec3): Effect<T>
{
    return setValueEffect("localRotation",localRotation)
}

export function setWorldRotation<T extends BSBasicObject>(worldRotation: remapper.Vec3): Effect<T>
{
    return setValueEffect("rotation",worldRotation)
}

export function setUninteractable<T extends BSBasicObject>(uninteractable = true): Effect<T>
{
    return setValueEffect("interactable",!uninteractable)
}

export function setColor<T extends BSBasicObject>(red: number, green: number, blue: number, alpha: number): Effect<T>
{
    return setValueEffect("color",[red,green,blue,alpha])
}

/*
* Path animations
*/
export function animateDefinitePosition<T extends BSBasicObject>(definitePosition: remapper.KeyframesVec3): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animate.definitePosition = definitePosition        
    }
}

export function animatePosition<T extends BSBasicObject>(position: remapper.KeyframesVec3): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animate.position = position
    }
}

export function animateDissolve<T extends BSObject>(dissolve: remapper.KeyframesLinear): Effect<T>
{
    return function(obj: BSObject)
    {
        obj.animate.dissolve = dissolve
    }
}

export function animateDissolveArrow<T extends remapper.Note | remapper.Bomb | remapper.Chain>(dissolveArrow: remapper.KeyframesLinear): Effect<T>
{
    return function(obj: remapper.Note | remapper.Bomb | remapper.Chain)
    {
        obj.animate.dissolveArrow = dissolveArrow
    }
}

export function animateScale<T extends BSBasicObject>(scale: remapper.KeyframesVec3): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animate.scale = scale
    }
}

export function animateWorldRotation<T extends BSBasicObject>(rotation: remapper.KeyframesVec3): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animate.rotation = rotation
    }
}

export function animateLocalRotation<T extends BSBasicObject>(rotation: remapper.KeyframesVec3): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animate.localRotation = rotation
    }
}

export function animateUninteractable<T extends BSBasicObject>(uninteractable: remapper.KeyframesLinear): Effect<T>
{
    return function(obj: BSBasicObject)
    {
        obj.animate.uninteractable = uninteractable
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
export function trackAnimationEffect<T extends BSBasicObject>(animation: TrackAnimation, track: remapper.TrackValue, timeVariation = 0): Effect<T>
{
    return function(t:T)
    {
        addTrack(track)(t)

        animation(t.time+timeVariation)(track)
    }
}

export function animateTrack(duration: number, animation: TrackAnimationDefinition, easing: remapper.EASE | undefined = undefined): TrackAnimation
{

    return function(time: number)
    {
        return function(track: remapper.TrackValue)
        {
            const event = new remapper.CustomEvent(time).animateTrack(track, duration, undefined, easing)
            
            animation(duration,event.animate)

            event.push()
        }
    }
}

// Use the keyframes with absolute times, it gets translated to proportions
export function animatePositionTrack(position: remapper.KeyframesVec3): TrackAnimationDefinition
{
    return function(duration, event)
    {
        event.offsetPosition = util.beatsToTrackAnimationPVec3(duration)(position)        
    }
}

export function animateScaleTrack(scale: remapper.KeyframesVec3): TrackAnimationDefinition
{
    return function(duration, event)
    {
        event.scale = util.beatsToTrackAnimationPVec3(duration)(scale)
    }
}

export function animateRotationTrack(worldRotation: remapper.KeyframesVec3): TrackAnimationDefinition
{
    return function(duration, event)
    {        
        event.rotation = util.beatsToTrackAnimationPVec3(duration)(worldRotation)
    }
}

export function animateWorldRotationTrack(worldRotation: remapper.KeyframesVec3): TrackAnimationDefinition
{
    return function(duration, event)
    {        
        event.offsetRotation = util.beatsToTrackAnimationPVec3(duration)(worldRotation)
    }
}

export function animateDissolveTrack(dissolve: remapper.KeyframesLinear): TrackAnimationDefinition
{
    return function(duration, event)
    {
        event.dissolve = util.beatsToTrackAnimationPLinear(duration)(dissolve)
    }
}

export function animateDissolveArrowTrack(dissolve: remapper.KeyframesLinear): TrackAnimationDefinition
{
    return function(duration, event)
    {
        event.dissolveArrow = util.beatsToTrackAnimationPLinear(duration)(dissolve)
    }
}
