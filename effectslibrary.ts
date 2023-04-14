import { Note } from "https://deno.land/x/remapper@3.1.1/src/note.ts";
import { Effect, NoteEffect, BombEffect, WallEffect, BSObject, NoteOrBomb } from "./types.ts";
import * as effects from "./effects.ts"
import { fromVanillaToNEX, fromVanillaToNEY } from "./util.ts"
import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts";

// "Queueing" notes.
// Put at a distance, then move in.
// steps includes the final step being when the player can hit it
export function queueObject<T extends remapper.Note | remapper.Bomb>(stepDistance: number, steps: number): Effect<T>
{
    const playDist = 2
    const gone = -10
    const stepDuration = 0.55/steps

    return effects.parameterizeEffect(function(t: T)
    {
        const y = t.y

        const end = [0,y,playDist-stepDistance,0.56]
        const postend = [0,y,playDist+gone,1]

        const stepArray = []
        for(let i = 1; i <= steps; i++)
        {
            const stepStart = [0,y,playDist+stepDistance*(steps-i),0.01+stepDuration*(i-1)]
            const stepEnd = [0,y,playDist+stepDistance*(steps-i),0.01+stepDuration*i-0.02]

            stepArray.push(stepStart)
            stepArray.push(stepEnd)
        }
        stepArray.push(end)
        stepArray.push(postend)
        const definitePosition: remapper.KeyframesVec3 = stepArray as remapper.KeyframesVec3

        const dissolve: remapper.KeyframesLinear = [[0,0],[0,0.01],[1,0.0101]]
        const dissolveArrow: remapper.KeyframesLinear = [[0,0],[0,0.01],[1,0.0101]]

        const posAnimation: Effect<T> = effects.animateDefinitePosition(definitePosition)
        const dissolveAnimation: Effect<T> = effects.animateDissolve(dissolve)
        const dissolveArrowAnimation: Effect<T> = effects.animateDissolveArrow(dissolveArrow)

        const disableGravity: Effect<T> = effects.disableNoteGravity()
        const disableSpawnEffect: Effect<T> = effects.disableSpawnEffect()
        const disableNoteLook: Effect<T> = effects.disableNoteLook()

        return effects.combineEffects([posAnimation,dissolveAnimation,dissolveArrowAnimation,disableGravity,disableSpawnEffect,disableNoteLook])    
    })
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

// end is 
export function slideIn<T extends NoteOrBomb>(dist: number, end: number): Effect<T>
{
    return effects.parameterizeEffect(
        function(t: T)
        {            
            const position: remapper.KeyframesVec3 = [[dist,0,0,0],[0,0,0,end]]

            return effects.animatePosition(position)
        }
    )       
}