import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts"; // MAKE SURE THIS IS ON THE LATEST REMAPPER VERSION!!!!!!!!!


export type BSBasicObject = remapper.Note | remapper.Bomb | remapper.Wall
export type NoteOrBomb = remapper.Note | remapper.Bomb
export type BSObject = BSBasicObject | remapper.Chain

export type CustomDataField =
{
    field: string,
    subfield: CustomDataField | undefined
}

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
* Grouping
*/
export type Grouper<T,V> = ((t:T) => V)
export type StringGrouper<T> = Grouper<T,string>
export type NumberGrouper<T> = Grouper<T,number>

export type GroupEffect<T,V> = ((v:V) => Effect<T>)
export type StringGroupEffect<T> = GroupEffect<T,string>
export type NumberGroupEffect<T> = GroupEffect<T,number>

export type InterpolatedEffect<T> = ((startTime: number, endTime:number) => NumberGroupEffect<T>)


/*
* Creating new objects
*/

// A creator always start from an original object. For simplicity, we assume the resulting objects created are of the same type.
export type Creator<T> = ((t:T) => T[])

/*
* Track animations
*/
export type TrackAnimation = ((time: number) => Effect<remapper.TrackValue>)
export type TrackAnimationDefinition = ((duration: number, event:remapper.AnimationInternals.AbstractAnimation) => void)

/*
* Geometric patterns, for an individual point in time.
* Dependence on numbers for a specific point in time goes from 0 to 1.
*/
export type PointPattern = remapper.Vec2
export type LinePattern = ((v: number) => remapper.Vec2)
export type SurfacePattern = ((v: [number, number]) => remapper.Vec2)

/*
* Now over time
*/
export type TimePattern<T> = ((time: number) => T)
export type TimePointPattern = TimePattern<PointPattern> // Spirals belong here.
export type TimeLinePattern = TimePattern<LinePattern> // Fields belong here.
export type TimeSurfacePattern = TimePattern<SurfacePattern>

/*
* Ways to sample geometric patterns.
*/
export type LineSampler = number[]
export type SurfaceSampler = [number, number][]
export type TimeSampler = [number, number] // First number is offset beat, second number is frequency (in beats).

export type TimeSamples<T> = [number,T][]
export type PointTimeSamples = TimeSamples<remapper.Vec2>

export type TimePointPatternDefinition = [number,number,number,number,number,number][] // [time,angle,xradius,yradius,xoffset,yoffset]. The path begins on the first keyframe and ends at the last keyframe.