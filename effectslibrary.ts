import { Note } from "https://deno.land/x/remapper@3.1.1/src/note.ts";
import { Effect, NoteEffect, BombEffect, WallEffect, BSObject, NoteOrBomb, Creator, GroupEffect, NumberGroupEffect } from "./types.ts";
import * as effects from "./effects.ts"
import * as groups from "./groups.ts"
import { fromVanillaToNEX, fromVanillaToNEY } from "./util.ts"
import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";
import { copyObject, parameterizeCreation, parameterizeCreationByField } from "./creation.ts";

// This file is sorted alphabetically

export function chonky<T extends NoteOrBomb>(scale = 1.25): Effect<T>
{
    return effects.animateScale([[scale,scale,scale,0],[scale,scale,scale,1]])
}

// freq is measured in beats, and it lasts for as long as the original wall lasts
// total is measured in lanes
export function increasingWall(dir: number, freq = 0.1, total = 0.5): Creator<remapper.Wall>
{    
    //console.log("Creating increasing wall with dir:" + dir)        

    return parameterizeCreation(
        function(wall: remapper.Wall): Creator<remapper.Wall>
        {
            const n = wall.duration/freq

            const reduceDur: Effect<remapper.Wall> = effects.setDuration(freq)

            reduceDur(wall)

            const groupEffect: NumberGroupEffect<remapper.Wall> = function(v: number)
            {
                const i = v+1
                const initpos = effects.initializePosition()
                const peri = total*i
                const displace: Effect<remapper.Wall> = effects.addPosition([dir*peri/n,0])
                const displaceTime: Effect<remapper.Wall> = effects.addTime(i*freq)
                const reduceDur: Effect<remapper.Wall> = effects.setDuration(freq)

                return effects.combineEffects([initpos,displace,reduceDur,displaceTime])
            }

            //console.log("Creating increasing wall with duration: " + duration +  " and n: " + n)
            
            return copyObject(n,groupEffect)
        })
}

export function interpolateHJD<T extends BSObject>(startTime: number, startValue: number, endTime: number, endValue: number): Effect<T>
{
    return effects.parameterizeEffect(
        function(t: T)
        {
            const value = startValue + (endValue - startValue)*(t.time-startTime)/(endTime - startTime)

            return effects.setHJD(value)
        }
    )
}

export function interpolateNJS<T extends BSObject>(startTime: number, startValue: number, endTime: number, endValue: number): Effect<T>
{
    return interpolateValue("NJS",startTime,startValue,endTime,endValue)
}

// Smooths a value between a start value and an end value over a certain time range
// Note the effect can, in principle, also be extrapolated to stuff outside. Use at own risk.
export function interpolateValue<T extends BSObject>(field: keyof T, startTime: number, startValue: number, endTime: number, endValue: number): Effect<T>
{
    return effects.parameterizeEffect(
        function(t: T)
        {
            const value = startValue + (endValue - startValue)*(t.time-startTime)/(endTime - startTime)

            return effects.setValueEffect(field, value as T[keyof T])
        }
    )
}

// Making notes "pop" then start moving
// It pops at the JD on its HJD and then moves at the NJS. If you also want to modify that, modify it separately.
export function popObject<T extends remapper.Note | remapper.Bomb>(): Effect<T>
{
    const dissolve: remapper.KeyframesLinear = [[0,0],[0,0.01],[1,0.0101]]
    const dissolveArrow: remapper.KeyframesLinear = [[0,0],[0,0.01],[1,0.0101]]

    const dissolveAnimation: Effect<T> = effects.animateDissolve(dissolve)
    const dissolveArrowAnimation: Effect<T> = effects.animateDissolveArrow(dissolveArrow)

    const disableGravity: Effect<T> = effects.disableNoteGravity()
    const disableSpawnEffect: Effect<T> = effects.disableSpawnEffect()
    const disableNoteLook: Effect<T> = effects.disableNoteLook()

    return effects.combineEffects([dissolveAnimation,dissolveArrowAnimation,disableGravity,disableSpawnEffect,disableNoteLook])
}

// Must have initialized position and scale
export function pushIn<T extends BSObject>(groupName: string, direction: number, hjdIncrease = 1, slideDist = 8, slideEnd = 0.2): Effect<T>
{
    const hjdEf = effects.addHJD(hjdIncrease)
    const positionFn = function(push: number): Effect<BSObject> { return effects.addPosition([direction*push,0] as remapper.Vec2)}
    const positionEf = groups.groupEffect(groups.customDataGrouper(groupName),positionFn)
    //const widthFn = function(push: number): Effect<remapper.Wall> { return effects.addScale([pushFactor*push,0,0] as remapper.Vec3)}
    //const widthEf = groups.groupEffect(groups.customDataGroup(),widthFn,groupName)
    const slideEf = slideIn(-1*direction*slideDist,slideEnd)

    const wallEff = effects.combineEffects([hjdEf,positionEf,slideEf])
    const noteEff = effects.combineEffects([hjdEf,positionEf,slideEf])

    return function(t: T)
        {
            if(t instanceof remapper.Wall)
            {
                wallEff(t)
            }
            else
            {
                noteEff(t)
            }
        }
}

// "Queueing" notes.
// Put at a distance, then move in.
// steps includes the final step being when the player can hit it
// stepTime is a proportion of the stepDuration, and it indicates the time the notes do not move
export function queueObject<T extends remapper.Note | remapper.Bomb>(stepDistance = 6, stayTime = 0.3, steps = 2, jumpTime = 0.3): Effect<T>
{
    const playDist = 1
    const gone = -10
    const stepDuration = jumpTime/(steps-1+stayTime)

    const swing = [0,0,playDist,0.5]
    const end = [0,0,playDist-stepDistance,0.5+stepDuration]
    const postend = [0,0,playDist+gone,1]

    const stepArray = []
    for(let i = 0; i < steps; i++)
    {
        const stepStart = [0,0,playDist+stepDistance*(steps-i),0.01+stepDuration*i]
        const stepEnd = [0,0,playDist+stepDistance*(steps-i),0.01+stepDuration*(i+stayTime)]

        stepArray.push(stepStart)
        stepArray.push(stepEnd)
    }
    stepArray.push(swing)
    stepArray.push(end)
    stepArray.push(postend)
    const definitePosition: remapper.KeyframesVec3 = stepArray as remapper.KeyframesVec3

    //const dissolve: remapper.KeyframesLinear = [[0,0],[0,0.01],[1,0.0101]]
    //const dissolveArrow: remapper.KeyframesLinear = [[0,0],[0,0.01],[1,0.0101]]

    const posAnimation: Effect<T> = effects.animateDefinitePosition(definitePosition)
    //const dissolveAnimation: Effect<T> = effects.animateDissolve(dissolve)
    //const dissolveArrowAnimation: Effect<T> = effects.animateDissolveArrow(dissolveArrow)

    //const disableGravity: Effect<T> = effects.disableNoteGravity() // THIS CAUSES BUGS
    //const disableSpawnEffect: Effect<T> = effects.disableSpawnEffect()
    //const disableNoteLook: Effect<T> = effects.disableNoteLook()

    return effects.combineEffects([posAnimation])        
}

// end is a proportion of the spawn animation
export function slideIn<T extends BSObject>(dist: number, end: number): Effect<T>
{
    const position: remapper.KeyframesVec3 = [[dist,0,0,0],[0,0,0,end]]

    return effects.animatePosition(position)
}

export function spawnGroups<T extends BSObject>(beatsPerBeat = 0.8, frequency = 1, offset = 0): Effect<T>
{    
    const fn = function(time: number): Effect<T> { return effects.addHJD(time*beatsPerBeat) }
    return groups.groupEffect(groups.timeGrouper(frequency,offset),fn)
}