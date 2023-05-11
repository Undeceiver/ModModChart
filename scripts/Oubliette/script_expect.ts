import * as remapper from "https://deno.land/x/remapper@3.1.1/src/mod.ts" // MAKE SURE THIS IS ON THE LATEST REMAPPER VERSION!!!!!!!!!
import * as ty from "file:///F:/ModModChart/types.ts"
import * as ef from "file:///F:/ModModChart/effects.ts"
import * as eff from "file:///F:/ModModChart/effectslibrary.ts"
import * as fn from "file:///F:/ModModChart/functions.ts"
import * as fl from "file:///F:/ModModChart/filters.ts"
import * as gs from "file:///F:/ModModChart/groups.ts"
import * as cr from "file:///F:/ModModChart/creation.ts"

const map = new remapper.Difficulty("HardStandard.dat", "ExpertPlusLawless.dat");
const mapHJD = 1.25

const allnotes: remapper.Note[] = fn.selectAllNotes()
const allwalls: remapper.Wall[] = fn.selectAllWalls()

// All streamVariation elements
const streamVariation_hjd_diff = -0.3
const streamVariation_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("streamVariation"))
const streamVariation_pop: ty.NoteEffect = eff.popObject()
const streamVariation_hjd: ty.NoteEffect = ef.addHJD(streamVariation_hjd_diff)
const streamVariation_effs: ty.NoteEffect = ef.combineEffects([streamVariation_hjd,streamVariation_pop])
fn.mapEffect(streamVariation_effs)(streamVariation_notes)

// Group by beat on the initial stream
const initialStream_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.beatFilter(0,60))
const initialStream_ef = eff.spawnGroups()
fn.mapEffect(initialStream_ef)(initialStream_notes)

// Specific groups
const predrop1_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("pregroup1"))
const predrop1_ef = eff.spawnGroups()
fn.mapEffect(predrop1_ef)(predrop1_notes)

// Interpolate NJS at beginning of drop
const dropNJS = 13
const dropExtraHJD = 0.5

const interpolate_drop_notes_1: remapper.Note[] = fn.filterObjects(allnotes, fl.beatFilter(91,92.05))
const interpolate_drop_njs_1: ty.Effect<ty.BSObject> = eff.interpolateNJS(91,map.NJS,92,dropNJS)
const interpolate_drop_hjd_1: ty.Effect<ty.BSObject> = eff.interpolateHJD(91,mapHJD,92,mapHJD+dropExtraHJD)
const interpolate_drop_ef_1: ty.Effect<ty.BSObject> = ef.combineEffects([interpolate_drop_njs_1,interpolate_drop_hjd_1])
fn.mapEffect(interpolate_drop_ef_1)(interpolate_drop_notes_1)

// And at the end
const interpolate_drop_notes_2: remapper.Note[] = fn.filterObjects(allnotes, fl.beatFilter(156,157.05))
const interpolate_drop_njs_2: ty.Effect<ty.BSObject> = eff.interpolateNJS(156,dropNJS,157,map.NJS)
const interpolate_drop_hjd_2: ty.Effect<ty.BSObject> = eff.interpolateHJD(156,mapHJD+dropExtraHJD,157,mapHJD)
const interpolate_drop_ef_2: ty.Effect<ty.BSObject> = ef.combineEffects([interpolate_drop_njs_2,interpolate_drop_hjd_2])
fn.mapEffect(interpolate_drop_ef_2)(interpolate_drop_notes_2)

const drop_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.beatFilter(92,156.5))
const drop_njs_slow: ty.Effect<ty.BSObject> = ef.setNJS(dropNJS)
const drop_hjd_increase: ty.Effect<ty.BSObject> = ef.addHJD(dropExtraHJD)
const drop_efs: ty.Effect<ty.BSObject> = ef.combineEffects([drop_njs_slow,drop_hjd_increase])
fn.mapEffect(drop_efs)(drop_notes)

const drop_group_three_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("dropthree"))
const drop_groups_three_ef = eff.spawnGroups(0.8,4,92)
const drop_groups_three_total_ef = ef.combineEffects([drop_groups_three_ef])
fn.mapEffect(drop_groups_three_total_ef)(drop_group_three_notes)

const drop_group_four_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("dropfour"))
const drop_groups_four_ef = eff.spawnGroups(0.8,4,93.75)
const drop_groups_four_total_ef = ef.combineEffects([drop_groups_four_ef])
fn.mapEffect(drop_groups_four_total_ef)(drop_group_four_notes)

// Drop wall NJS
const dropWallNJS = 22
const drop_walls = fn.filterObjects(allwalls, fl.beatFilter(92,157))
const drop_wall_njs_ef: ty.Effect<remapper.Wall> = ef.setNJS(dropWallNJS)
fn.mapEffect(drop_wall_njs_ef)(drop_walls)

// And second "drop"
const interpolate_drop_notes_3: remapper.Note[] = fn.filterObjects(allnotes, fl.beatFilter(219,220.05))
const interpolate_drop_njs_3: ty.Effect<ty.BSObject> = eff.interpolateNJS(219,map.NJS,220,dropNJS)
const interpolate_drop_hjd_3: ty.Effect<ty.BSObject> = eff.interpolateHJD(219,mapHJD,220,mapHJD+dropExtraHJD)
const interpolate_drop_ef_3: ty.Effect<ty.BSObject> = ef.combineEffects([interpolate_drop_njs_3,interpolate_drop_hjd_3])
fn.mapEffect(interpolate_drop_ef_3)(interpolate_drop_notes_3)

// And at the end
const prefinalNJS = 14
const prefinalHJD = 0.5

const interpolate_drop_notes_4: remapper.Note[] = fn.filterObjects(allnotes, fl.beatFilter(284,285.05))
const interpolate_drop_njs_4: ty.Effect<ty.BSObject> = eff.interpolateNJS(284,dropNJS,285,prefinalNJS)
const interpolate_drop_hjd_4: ty.Effect<ty.BSObject> = eff.interpolateHJD(284,mapHJD+dropExtraHJD,285,mapHJD+prefinalHJD)
const interpolate_drop_ef_4: ty.Effect<ty.BSObject> = ef.combineEffects([interpolate_drop_njs_4,interpolate_drop_hjd_4])
fn.mapEffect(interpolate_drop_ef_4)(interpolate_drop_notes_4)

const drop_notes_2: remapper.Note[] = fn.filterObjects(allnotes,fl.beatFilter(220,284.5))
const drop_njs_slow_2: ty.Effect<ty.BSObject> = ef.setNJS(dropNJS)
const drop_hjd_increase_2: ty.Effect<ty.BSObject> = ef.addHJD(dropExtraHJD)
const drop_efs_2: ty.Effect<ty.BSObject> = ef.combineEffects([drop_njs_slow_2,drop_hjd_increase_2])
fn.mapEffect(drop_efs_2)(drop_notes_2)

// Groups themselves are already affected by the first pass.

// Drop wall NJS
const drop_walls_2 = fn.filterObjects(allwalls, fl.beatFilter(220,285))
const drop_wall_njs_ef_2: ty.Effect<remapper.Wall> = ef.setNJS(dropWallNJS)
fn.mapEffect(drop_wall_njs_ef_2)(drop_walls_2)

// Prefinal section
const prefinal_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.beatFilter(285,316))
const prefinal_slow: ty.Effect<ty.BSObject> = ef.setNJS(prefinalNJS)
const prefinal_hjd_increase: ty.Effect<ty.BSObject> = ef.addHJD(prefinalHJD)
const prefinal_efs_2: ty.Effect<ty.BSObject> = ef.combineEffects([prefinal_slow,prefinal_hjd_increase])
fn.mapEffect(prefinal_efs_2)(prefinal_notes)

const prefinal_group_three_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("prefinalthree"))
const prefinal_groups_three_ef = eff.spawnGroups(0.8,4,284)
const prefinal_groups_three_total_ef = ef.combineEffects([prefinal_groups_three_ef])
fn.mapEffect(prefinal_groups_three_total_ef)(prefinal_group_three_notes)

const prefinal_group_five_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("prefinalfive"))
const prefinal_groups_five_ef = eff.spawnGroups(0.8,4,285.5)
const prefinal_groups_five_total_ef = ef.combineEffects([prefinal_groups_five_ef])
fn.mapEffect(prefinal_groups_five_total_ef)(prefinal_group_five_notes)

// Prefinal wall NJS
const prefinalWallNJS = 16
const prefinal_walls = fn.filterObjects(allwalls, fl.beatFilter(285,316))
const prefinal_wall_njs_ef: ty.Effect<remapper.Wall> = ef.setNJS(prefinalWallNJS)
fn.mapEffect(prefinal_wall_njs_ef)(prefinal_walls)

const zoomWallNJS = 50
const zoomWallHJD = 4
const zoom_walls: remapper.Wall[] = fn.filterObjects(allwalls,fl.labelFilter("zoomWall"))
const zoom_fast: ty.Effect<remapper.Wall> = ef.setNJS(zoomWallNJS)
const zoom_hjd_increase: ty.Effect<remapper.Wall> = ef.setHJD(zoomWallHJD)
//const zoom_easydodge: ty.Effect<remapper.Wall> = eff.easyDodge()
const zoom_wall_efs: ty.Effect<remapper.Wall> = ef.combineEffects([zoom_fast,zoom_hjd_increase])
fn.mapEffect(zoom_wall_efs)(zoom_walls)

// Final NJS
const finalNJS = 19.9
const final_notes: remapper.Note[] = fn.filterObjects(allnotes, fl.beatFilter(316,344))
const final_walls: remapper.Wall[] = fn.filterObjects(allwalls, fl.beatFilter(316,344))
const interpolate_final_njs: ty.Effect<ty.BSObject> = eff.interpolateNJS(316,prefinalNJS,344,finalNJS)
const final_real_njs: ty.Effect<ty.BSObject> = ef.setNJS(prefinalNJS)
const final_groups: ty.Effect<ty.BSObject> = eff.spawnGroups(0.8,2,316)
const final_ef: ty.Effect<ty.BSObject> = ef.combineEffects([interpolate_final_njs, final_groups])
const fake_cr: ty.Creator<ty.NoteOrBomb> = eff.fakeEffect(final_ef)
const final_hidden_ef: ty.Effect<remapper.Note> = ef.combineEffects([final_real_njs])
fn.mapCreate(fake_cr)(final_notes)
fn.mapEffect(final_hidden_ef)(final_notes)
fn.mapEffect(final_ef)(final_walls)

const veryfinal_notes: remapper.Note[] = fn.filterObjects(allnotes, fl.beatFilter(344,500))
const veryfinal_walls: remapper.Wall[] = fn.filterObjects(allwalls, fl.beatFilter(344,500))
const veryfinal_njs: ty.Effect<ty.BSObject> = ef.setNJS(finalNJS)
fn.mapEffect(veryfinal_njs)(veryfinal_notes)
fn.mapEffect(veryfinal_njs)(veryfinal_walls)

// Left push
const leftpush_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.groupFilter("leftpush"))
const leftpush_walls: remapper.Wall[] = fn.filterObjects(allwalls,fl.groupFilter("leftpush"))
const leftpush_initialize_position = ef.initializePosition()
const leftpush_initialize_scale = ef.initializeScale()
const leftpush_pushin = eff.pushIn("leftpush",-1)
const leftpush_effs_notes = ef.combineEffects([leftpush_initialize_position,leftpush_pushin])
const leftpush_effs_walls = ef.combineEffects([leftpush_initialize_position,leftpush_initialize_scale,leftpush_pushin])
fn.mapEffect(leftpush_effs_notes)(leftpush_notes)
fn.mapEffect(leftpush_effs_walls)(leftpush_walls)

// Right push
const rightpush_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.groupFilter("rightpush"))
const rightpush_walls: remapper.Wall[] = fn.filterObjects(allwalls,fl.groupFilter("rightpush"))
const rightpush_initialize_position = ef.initializePosition()
const rightpush_initialize_scale = ef.initializeScale()
const rightpush_pushin = eff.pushIn("rightpush",1)
const rightpush_effs_notes = ef.combineEffects([rightpush_initialize_position,rightpush_pushin])
const rightpush_effs_walls = ef.combineEffects([rightpush_initialize_position,rightpush_initialize_scale,rightpush_pushin])
fn.mapEffect(rightpush_effs_notes)(rightpush_notes)
fn.mapEffect(rightpush_effs_walls)(rightpush_walls)

// Chonky
const chonky_notes = fn.filterObjects(allnotes,fl.labelFilter("chonky"))
const chonky_ef = eff.chonky()
fn.mapEffect(chonky_ef)(chonky_notes)

// Increasing walls
const increasing_walls : remapper.Wall[] = fn.filterObjects(allwalls,fl.groupFilter("increasingWall"))
//console.log("Increasing walls:" + increasing_walls.length)
const increasing_walls_cf: ty.CustomDataField = fn.customDataField("increasingWall",fn.customDataField("dir"))
const increasing_walls_cr: ty.Creator<remapper.Wall> = cr.parameterizeCreationByCustomData(increasing_walls_cf,function(dir: number) { return eff.increasingWall(dir,0.1,0.5)})
fn.mapCreate(increasing_walls_cr)(increasing_walls)

const prerotation_drum_roll_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("prerotationdrumroll"))
const prerotation_drum_roll_ef = eff.spawnGroups(0.8,1,184)
const prerotation_drum_roll_total_ef = ef.combineEffects([prerotation_drum_roll_ef])
fn.mapEffect(prerotation_drum_roll_total_ef)(prerotation_drum_roll_notes)

// Easy dodge walls
const easy_dodge_walls: remapper.Wall[] = fn.filterObjects(allwalls,fl.labelFilter("easyDodge"))
const easy_dodge_init: ty.Effect<remapper.Wall> = ef.initializePosition()
const easy_dodge_ef: ty.Effect<remapper.Wall> = eff.easyDodge()
const easy_dodge_total_ef: ty.Effect<remapper.Wall> = ef.combineEffects([easy_dodge_init,easy_dodge_ef])
fn.mapEffect(easy_dodge_total_ef)(easy_dodge_walls)

// Shotgun
const shotgun_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("shotgun"))
const shotgun_ef: ty.Effect<remapper.Note> = eff.queueObject(7.5,0.3,2,0.3)
const shotgun_ef_njs: ty.Effect<remapper.Note> = ef.setNJS(map.NJS)
const shotgun_ef_cr: ty.Creator<remapper.Note> = eff.fakeEffect(ef.combineEffects([shotgun_ef,shotgun_ef_njs]))
fn.mapCreate(shotgun_ef_cr)(shotgun_notes)
const shotgun_njs = 13
const shotgun_njs_ef = ef.setNJS(shotgun_njs)
fn.mapEffect(shotgun_njs_ef)(shotgun_notes)

const intermachinegunHJDinc = 0.5
const intermachinegunHJD_ef = ef.addHJD(intermachinegunHJDinc)

const premachinegun_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("premachinegun"))
const premachinegun_ef= eff.spawnGroups(0.8,1,189.75)
const premachinegun_total_ef = ef.combineEffects([intermachinegunHJD_ef,premachinegun_ef])
fn.mapEffect(premachinegun_total_ef)(premachinegun_notes)

// Closing walls
const closingWallHJD = 0.5
const closing_walls: remapper.Wall[] = fn.filterObjects(allwalls,fl.labelFilter("closingWall"))
const closing_wall_init_pos: ty.Effect<remapper.Wall> = ef.initializePosition()
const closing_wall_init_scale: ty.Effect<remapper.Wall> = ef.initializeScale()
const closing_wall_ef: ty.Effect<remapper.Wall> = eff.closingWall(200.5,3,203,0.6,0.25)
const closing_wall_hjd: ty.Effect<remapper.Wall> = ef.setHJD(closingWallHJD)
const closing_wall_full_ef = ef.combineEffects([closing_wall_init_pos,closing_wall_init_scale,closing_wall_ef,closing_wall_hjd])
fn.mapEffect(closing_wall_full_ef)(closing_walls)

// Machinegun effect.
const machinegun_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("machinegun"))
const machinegun_ef: ty.Effect<remapper.Note> = eff.zoomIn(35,12,0.15)
const machinegun_total_ef: ty.Effect<remapper.Note> = ef.combineEffects([intermachinegunHJD_ef,machinegun_ef])
fn.mapEffect(machinegun_total_ef)(machinegun_notes)

const intermachinegun_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("intermachinegun"))
const intermachinegun_ef= eff.spawnGroups(0.8,0.5,192.5)
const intermachinegun_total_ef = ef.combineEffects([intermachinegunHJD_ef,intermachinegun_ef])
fn.mapEffect(intermachinegun_total_ef)(intermachinegun_notes)

const intermachinegun2_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.labelFilter("intermachinegun2"))
const intermachinegun2_ef = eff.spawnGroups(0.8,1,193.75)
const intermachinegun2_total_ef = ef.combineEffects([intermachinegunHJD_ef,intermachinegun2_ef])
fn.mapEffect(intermachinegun2_total_ef)(intermachinegun2_notes)

const open_up_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.beatFilter(200,202.1))
const open_up_init = ef.initializePosition()
const open_up_ef = eff.openOrClose(200,202,0,0.9)
const open_up_efs = ef.combineEffects([open_up_init,open_up_ef])
fn.mapEffect(open_up_efs)(open_up_notes)

const close_up_notes: remapper.Note[] = fn.filterObjects(allnotes,fl.beatFilter(202,204.1))
const close_up_init = ef.initializePosition()
const close_up_ef = eff.openOrClose(202,204,0.9,0)
const close_up_efs = ef.combineEffects([close_up_init,close_up_ef])
fn.mapEffect(close_up_efs)(close_up_notes)

const surge_walls: remapper.Wall[] = fn.filterObjects(allwalls,fl.groupFilter("surge"))
const surge_ef = eff.surge()
fn.mapEffect(surge_ef)(surge_walls)

// Disable wrong colour badcuts on all notes!
const nowrongcolor: ty.Effect<remapper.Note> = ef.disableBadCutSaberType()
fn.mapEffect(nowrongcolor)(allnotes)

const n = new remapper.Note()
const w = new remapper.Wall()

map.save();
