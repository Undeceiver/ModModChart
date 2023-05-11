import { Note } from "https://deno.land/x/remapper@3.1.1/src/note.ts";
import { Effect, NoteEffect, BombEffect, WallEffect, BSObject, NoteOrBomb, Creator, GroupEffect, NumberGroupEffect, TrackAnimationDefinition, InterpolatedEffect } from "./types.ts";
import * as effects from "./effects.ts"
import * as groups from "./groups.ts"
import { fromVanillaToNEX, fromVanillaToNEY, randomTrackName } from "./util.ts"
import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";
import { copyObject, createBombs, createWalls, effectOnFake, parameterizeCreation, parameterizeCreationByField } from "./creation.ts";
import { customDataField, filterEffect, runVoidEffect } from "./functions.ts";
import { noteTypeFilter } from "./filters.ts";
import { HemisphereLight } from "https://cdn.skypack.dev/three?dts";

// This file is sorted alphabetically

export function assignPlayerToTrack(track: remapper.TrackValue): Effect<void>
{
    return function()
    {
        new remapper.CustomEvent().assignPlayerToTrack("player").push();
    }
}

// direction horizontally mirrors the spiral
export function bombSpiral(startTime: number, endTime: number, startAngle: number, period: number, direction: number, bombDist = 0.125, xradius = 2, yradius = 1.5, xoffset = 0, yoffset = 1.25, fake = false): Creator<remapper.Bomb>
{
    const copies = (endTime - startTime)/bombDist

    const groupEffect =
        function(i: number)
        {
            const moduloTime = i*bombDist

            const angle = startAngle + 2*Math.PI*moduloTime/period

            const x = xoffset + direction*xradius*Math.cos(angle)
            const y = yoffset + yradius*Math.sin(angle)

            const initPos = effects.initializePosition()
            const setPos = effects.setPosition([x,y])
            const setTime = effects.setTime(startTime+moduloTime)
            const nogravity = effects.disableNoteGravity()

            return effects.combineEffects([initPos,setPos,setTime,nogravity])
        }
    
        return createBombs(copies, groupEffect, fake)
}

export function chonky<T extends NoteOrBomb>(scale = 1.25): Effect<T>
{
    return effects.animateScale([[scale,scale,scale,0],[scale,scale,scale,1]])
}

// Position must have been initialized
// width is on either side
export function closingWall(startTime: number, startWidth: number, endTime: number, endWidth: number, wallWidth = 0.5): Effect<remapper.Wall>
{
    return interpolateEffect(startTime, startWidth, endTime, endWidth, 
        function(width: number)
        {
            return effects.parameterizeEffect(
                function(wall: remapper.Wall)
                {
                    const width_ef = effects.setScale([wallWidth,wall.height,wall.duration*wall.NJS])
                    let pos_ef
                    if(wall.x < 0)
                    {
                        pos_ef = effects.setPosition([-width,wall.y])
                    }
                    else
                    {
                        pos_ef = effects.setPosition([width-wallWidth,wall.y])
                    }

                    return effects.combineEffects([pos_ef,width_ef])
                })
        })        
}

export function curveIn<T extends BSObject>(startYaw: number, finalYaw = 0, finalTime = 0.5): Effect<T>
{
    const worldRotation: remapper.KeyframesVec3 = [[0,startYaw,0,0],[0,finalYaw,0,finalTime,"easeInExpo"]]

    return effects.animateWorldRotation(worldRotation)
}

// Must initialize position before
export function easyDodge(move = 0.25): Effect<remapper.Wall>
{
    return effects.parameterizeEffect(
        function(wall: remapper.Wall)
        {
            if(wall.x >= 2 && wall.x < 3)
            {
                return effects.addPosition([move,0])
            }
            else if(wall.x + wall.width <= 2 && wall.x + wall.width > 1)
            {
                return effects.addPosition([-move,0])
            }
            else
            {
                return effects.addPosition([0,0])
            }
        })
}

// Create fake copies, apply the effect on them, and then make the original ones invisible.
export function fakeEffect<T extends NoteOrBomb>(effect: Effect<T>): Creator<T>
{
    const invisible_ef = invisible()    

    const creator = effectOnFake(effect)

    return function(t: T)
    {
        const created = creator(t)
        invisible_ef(t)
        
        return created
    }
}

// freq is measured in beats, and it lasts for as long as the original wall lasts
// total is measured in lanes
export function increasingWall(dir: number, freq = 0.1, total = 0.25): Creator<remapper.Wall>
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

export function initializePlayerRotation(worldRotation: remapper.KeyframesVec3, duration = 2): void
{
    const rotationDefinition = effects.animateWorldRotationTrack(worldRotation)
    const rotationAnimation = effects.animateTrack(duration,rotationDefinition)

    rotationAnimation(0)(playerTrack())    
}

export function initializePlayerTrack(): void
{
    runVoidEffect(assignPlayerToTrack(playerTrack()))
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

export function interpolateEffect<T extends BSObject>(startTime: number, startValue: number, endTime: number, endValue: number, effect: GroupEffect<T,number>): Effect<T>
{
    return effects.parameterizeEffectByField("time",
        function(time: number)
        {
            const value = startValue + (endValue - startValue)*(time-startTime)/(endTime - startTime)
            
            return effect(value)
        }
    )
}

export function interpolateEffectByArgument<T extends BSObject>(startInput: number, startValue: number, endInput: number, endValue: number, input: number, effect: GroupEffect<T,number>): Effect<T>
{
    const value = startValue + (endValue - startValue)*(input-startInput)/(endInput - startInput)
    
    return effect(value)
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

export function invisible<T extends NoteOrBomb>(): Effect<T>
{
    const dissolve = effects.animateDissolve([[0,0],[0,1]])
    const dissolveArrow = effects.animateDissolveArrow([[0,0],[0,1]])

    return effects.combineEffects([dissolve,dissolveArrow])
}

// Must have initialized position before.
// widths are additive values. Left hand to the left, right hand to the right.
export function openOrClose(startTime: number, endTime: number, startWidth = 0, endWidth = 1): Effect<remapper.Note>
{
    return effects.parameterizeEffect(
        function(note: remapper.Note)
        {        
            const width = startWidth + (endWidth - startWidth)*(note.time-startTime)/(endTime - startTime)        

            const leftEffect = effects.addPosition([-width,0])
            const rightEffect = effects.addPosition([width,0])

            return filterEffect(noteTypeFilter(remapper.NOTETYPE.RED),leftEffect,rightEffect)
        })
}

// finalTime is a proportion of the spawn animation
export function oscillateCurveIn<T extends BSObject>(startTime: number, period: number, amplitude: number, finalYaw = 0, finalTime = 0.5): Effect<T>
{
    const groupEffect = 
        function(angle: number)
        {
            return curveIn(angle,finalYaw,finalTime)
        }

    return oscillateEffect(startTime,period,amplitude,groupEffect)
}

// Starts on the negative extreme
// period is measured in beats
export function oscillateEffect<T extends BSObject>(startTime: number, period: number, amplitude: number, effect: GroupEffect<T,number>): Effect<T>
{
    return effects.parameterizeEffectByField("time",
        function(time: number)
        {
            const value = -amplitude*Math.cos((time-startTime)*2*Math.PI/period)

            return effect(value)
        }
    )
}

export function oscillateEffectByArgument<T extends BSObject>(startInput: number, period: number, amplitude: number, input:number, effect: GroupEffect<T,number>): Effect<T>
{
    const value = -amplitude*Math.cos((input-startInput)*2*Math.PI/period)
    
    return effect(value)
}

export function oscillateYaw(startTime: number, endTime: number, period: number, amplitude: number): void
{
    const keyframes: remapper.KeyframesVec3 = [[0,-amplitude,0,0],[0,0,0,0.25,"easeInSine"],[0,amplitude,0,0.5,"easeOutSine"],[0,0,0,0.75,"easeInSine"],[0,-amplitude,0,1,"easeOutSine"]]    

    const def:TrackAnimationDefinition = 
        function(duration, event)
        {
            event.rotation = keyframes
        }

    const worldRotationEffect = effects.animateTrack(period,def)

    for(let time = startTime; time < endTime; time += period)
    {
        worldRotationEffect(time)(playerTrack())
    }
}

export function periodicEffect<T extends BSObject>(startTime: number, period: number, effect: InterpolatedEffect<T>): Effect<T>
{
    return effects.parameterizeEffectByField("time",
        function(time: number)
        {
            const moduloTime = (time - startTime + period*10000) % period
            
            return effect(0, period)(moduloTime)
        }
    )
}

export function playerTrack(): remapper.TrackValue
{
    return "player"
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
export function queueObject<T extends remapper.Note | remapper.Bomb>(stepDistance = 6, stayTime = 0.2, steps = 2, jumpTime = 0.25): Effect<T>
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

export function surge(stump = 0.4, duration = 0.75): Effect<remapper.Wall>
{
    const parametricEffect = function(surgeTime: number): Effect<remapper.Wall>
    {     
        return effects.parameterizeEffect(
            function(wall: remapper.Wall)
            {                
                const track = randomTrackName()
             
                const wallheight = wall.height
                const hjd = wall.halfJumpDur
                const extra = 0.25
                const begin = hjd+surgeTime+extra
                const end = hjd+surgeTime+duration+extra
                const scale = [[1,stump/wallheight,1,0],[1,stump/wallheight,1,begin],[1,1,1,end]] as remapper.KeyframesVec3

                const animateTrack = effects.animateTrack(hjd+surgeTime+duration+extra,effects.animateScaleTrack(scale))

                return effects.trackAnimationEffect(animateTrack,track,-hjd-extra)
            }
        )        
    }

    return effects.parameterizeEffectByCustomData(customDataField("surge"),parametricEffect)
}

// direction basically horizontally mirrors the spiral
export function wallSpiral(startTime: number, endTime: number, startAngle: number, period: number, direction: number, wallDist = 0.125, xradius = 2, yradius = 1.5, xoffset = 0, yoffset = 1.25, wallside = 0.5, fake = false): Creator<remapper.Wall>
{
    const copies = (endTime - startTime)/wallDist

    const groupEffect =
        function(i: number)
        {
            const moduloTime = i*wallDist

            const angle = startAngle + 2*Math.PI*moduloTime/period

            const x = xoffset - wallside/2 + direction*xradius*Math.cos(angle)
            const y = yoffset - wallside/2 + yradius*Math.sin(angle)

            const initPos = effects.initializePosition()
            const setPos = effects.setPosition([x,y])
            const setTime = effects.setTime(startTime+moduloTime)
            const setDuration = effects.setDuration(wallDist)
            const initScale = effects.initializeScale()
            const setScale = effects.setScale([wallside,wallside,wallside])
            
            return effects.combineEffects([initPos,setPos,setTime,setDuration,initScale,setScale])
        }
    
        return createWalls(copies, groupEffect, fake)
}

// slowTime is a proportion as in animations, so 0 means spawn time, 0.5 means the time the player has to hit the note.
export function zoomIn<T extends BSObject>(spawnDist = 35, slowDist = 15, slowTime = 0.05): Effect<T>
{
    const playDist = 1

    const spawn = [0,0,spawnDist,0]
    const slowDown = [0,0,slowDist,slowTime]
    const play = [0,0,playDist,0.5]
    const after = [0,0,-slowDist,1.0]

    const definitePosition: remapper.KeyframesVec3 = [spawn,slowDown,play,after] as unknown as remapper.KeyframesVec3
    
    return effects.animateDefinitePosition(definitePosition)
}