import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts"; // MAKE SURE THIS IS ON THE LATEST REMAPPER VERSION!!!!!!!!!


export type BSObject = remapper.Note | remapper.Bomb | remapper.Wall
export type NoteOrBomb = remapper.Note | remapper.Bomb

/*
* Filter types
*/
export type Filter<T> = ((t: T) => boolean)

export type NoteFilter = Filter<remapper.Note>
export type BombFilter = Filter<remapper.Bomb>
export type WallFilter = Filter<remapper.Wall>

/*
* Effect types
*/
export type Effect<T> = ((t: T) => void)

export type NoteEffect = Effect<remapper.Note>
export type BombEffect = Effect<remapper.Bomb>
export type WallEffect = Effect<remapper.Wall>

/*
* Groups
*/
export type GroupDefinition<T,N,V> = ((name: N) => (t: T) => V)