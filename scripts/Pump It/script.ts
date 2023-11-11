import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts" // MAKE SURE THIS IS ON THE LATEST REMAPPER VERSION!!!!!!!!!
import * as ty from "file:///F:/ModModChart/types.ts"
import * as ef from "file:///F:/ModModChart/effects.ts"
import * as eff from "file:///F:/ModModChart/effectslibrary.ts"
import * as fn from "file:///F:/ModModChart/functions.ts"
import * as fl from "file:///F:/ModModChart/filters.ts"
import * as gs from "file:///F:/ModModChart/groups.ts"
import * as geo from "file:///F:/ModModChart/geometricpatterns.ts"
import * as cr from "file:///F:/ModModChart/creation.ts"
import * as util from "file:///F:/ModModChart/util.ts"
import { lerp } from "https://deno.land/x/remapper@3.1.1/src/general.ts"
import { settings } from "https://deno.land/x/remapper@3.1.1/src/beatmap.ts"


// PRELUDE

let map = new remapper.Difficulty("ExpertPlusStandard.dat", "ExpertPlusLawless.dat");

settings.forceJumpsForNoodle = true

const mapHJD = 2.175
const mapBPM = 174
const mapNJS = 18

let allnotes: remapper.Note[] = fn.selectAllNotes()
let allbombs: remapper.Bomb[] = fn.selectAllBombs()
let allwalls: remapper.Wall[] = fn.selectAllWalls()


// MAIN BODY

//fn.mapEffect(eff.windowwall())(allwalls)
const windowWall_cr = eff.windowWall()
const init_pos = ef.initializePosition()
const init_scale = ef.initializeScale()

fn.mapEffect(ef.combineEffects([init_pos,init_scale]))(allwalls)
fn.mapCreate(windowWall_cr)(allwalls)

// Towers and hypertowers

const stack_notes = fn.filterObjects(allnotes,fl.labelFilter("stack"))
const stack_init_pos = ef.initializePosition()
const stack_cr = eff.createTower(1)

fn.mapEffect(stack_init_pos)(stack_notes)
fn.mapCreate(stack_cr)(stack_notes)

const tower_notes = fn.filterObjects(allnotes,fl.labelFilter("tower"))
const tower_init_pos = ef.initializePosition()
const tower_cr = eff.createTower()

fn.mapEffect(tower_init_pos)(tower_notes)
fn.mapCreate(tower_cr)(tower_notes)

const hypertower_notes = fn.filterObjects(allnotes,fl.labelFilter("hypertower"))
const hypertower_init_pos = ef.initializePosition()
const hypertower_cr = eff.createTower(3)

fn.mapEffect(hypertower_init_pos)(hypertower_notes)
fn.mapCreate(hypertower_cr)(hypertower_notes)

// FINISH UP

// Reselect stuff
allnotes = fn.selectAllNotes()
allbombs = fn.selectAllBombs()
allwalls = fn.selectAllWalls()

// Disable wrong colour badcuts on all notes!
const nowrongcolor: ty.Effect<remapper.Note> = ef.disableBadCutSaberType()
fn.mapEffect(nowrongcolor)(allnotes)

// Make uninteractable after player for all bombs!
const uninteractable: ty.Effect<remapper.Bomb> = eff.uninteractableAfterPlayer()
fn.mapEffect(uninteractable)(allbombs)

map.save();