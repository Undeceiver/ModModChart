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

const curscript: string = "enhancedtech"
//const curscript: string = "modcharttech"
const ismodcharttech = function(){ return curscript == "modcharttech" }

let map
if(ismodcharttech())
{
    map = new remapper.Difficulty("EasyStandard.dat", "EasyLawless.dat");
}
else
{
    map = new remapper.Difficulty("NormalStandard.dat", "ExpertPlusStandard.dat");
    settings.forceJumpsForNoodle = false
}
const mapHJD = 1.25
const mapBPM = 125
const mapNJS = 16

let allnotes: remapper.Note[] = fn.selectAllNotes()
let allbombs: remapper.Bomb[] = fn.selectAllBombs()
let allwalls: remapper.Wall[] = fn.selectAllWalls()

if(ismodcharttech())
{
    const beginning_dissolve_start = 0.4
    const beginning_dissolve_end = 0.05
    const beginning_dissolve_start_value = 0.5
    const beginning_dissolve_notes = fn.filterObjects(allnotes,fl.beatFilter(4,24))
    const beginning_dissolve_group_effect = 
        function(v: number)
        {
            const dissolve = ef.animateDissolve([[beginning_dissolve_start_value,0],[1,v]])
            const dissolve_arrow = ef.animateDissolveArrow([[beginning_dissolve_start_value,0],[1,v]])

            return ef.combineEffects([dissolve,dissolve_arrow])
        }
    const beginning_dissolve_effect = eff.interpolateEffect(4,beginning_dissolve_start,24,beginning_dissolve_end,beginning_dissolve_group_effect)
    fn.mapEffect(beginning_dissolve_effect)(beginning_dissolve_notes)
}
else
{

}

const player_track:remapper.TrackValue = eff.playerTrack()
eff.initializePlayerTrack()

// Player rotation
//const initial_player_rotation_value = -5
//eff.initializePlayerRotation([[0,0,0,0],[0,initial_player_rotation_value,0,2]])
// Motion sickness!!
//eff.oscillateYaw(4,52,8,5)

// Curve in intro
if(ismodcharttech())
{
    const curveInIntroAngle = 10
    const curveIn_notes_1 = fn.filterObjects(allnotes, fl.beatFilter(4,52,true,true))
    const curveIn_ef_1 = eff.oscillateCurveIn(4,8,curveInIntroAngle)
    fn.mapEffect(curveIn_ef_1)(curveIn_notes_1)
    const curveIn_notes_2 = fn.filterObjects(allnotes, fl.beatFilter(52,84,true,true))
    const curveIn_ef_2 = eff.oscillateCurveIn(48,8,curveInIntroAngle)
    fn.mapEffect(curveIn_ef_2)(curveIn_notes_2)
}
else
{

}

// Groups in intro
if(ismodcharttech())
{
    const intro_group_filter_1 = fl.andFilter([fl.beatFilter(4,52,true,true),fl.beatModuloFilter(4,0,2.5,1.5)])
    const intro_group_notes_1 = fn.filterObjects(allnotes, intro_group_filter_1)
    const intro_group_ef = eff.spawnGroups(0.6,4,1.5)
    fn.mapEffect(intro_group_ef)(intro_group_notes_1)
    const intro_group_filter_2 = fl.andFilter([fl.beatFilter(52,84,true,true),fl.beatModuloFilter(4,0,2.5,1.5)])
    const intro_group_notes_2 = fn.filterObjects(allnotes, intro_group_filter_2)
    fn.mapEffect(intro_group_ef)(intro_group_notes_2)
}
else
{

}

// Main curve in notes in build up
const curveInBuildUpAngle = 5    
const curveInGroupEffect = 
    function(angle: number)
    {
        return eff.curveIn(angle)
    }
if(ismodcharttech())
{    
    const curveIn_buildup_ef_left_1 = eff.oscillateEffect(96,8,curveInBuildUpAngle,curveInGroupEffect)
    const curveIn_buildup_ef_left_filter_1 = fl.orFilter([fl.beatFilter(96,98,false,true),fl.beatFilter(120,122,false,true),fl.beatFilter(136,138,false,true),fl.beatFilter(152,154,false,true)])
    const curveIn_buildup_ef_left_notes_1 = fn.filterObjects(allnotes,curveIn_buildup_ef_left_filter_1)
    fn.mapEffect(curveIn_buildup_ef_left_1)(curveIn_buildup_ef_left_notes_1)
    const curveIn_buildup_ef_right_1 = eff.oscillateEffect(100,8,curveInBuildUpAngle,curveInGroupEffect)
    const curveIn_buildup_ef_right_filter_1 = fl.orFilter([fl.beatFilter(104,106,false,true),fl.beatFilter(112,114,false,true),fl.beatFilter(128,130,false,true),fl.beatFilter(144,146,false,true)])
    const curveIn_buildup_ef_right_notes_1 = fn.filterObjects(allnotes,curveIn_buildup_ef_right_filter_1)
    fn.mapEffect(curveIn_buildup_ef_right_1)(curveIn_buildup_ef_right_notes_1)

    const curveIn_buildup_ef_left_2 = eff.oscillateEffect(108,8,curveInBuildUpAngle,curveInGroupEffect)
    const curveIn_buildup_ef_left_filter_2 = fl.orFilter([fl.beatFilter(108,110,false,true),fl.beatFilter(116,118,false,true),fl.beatFilter(132,134,false,true),fl.beatFilter(148,150,false,true)])
    const curveIn_buildup_ef_left_notes_2 = fn.filterObjects(allnotes,curveIn_buildup_ef_left_filter_2)
    fn.mapEffect(curveIn_buildup_ef_left_2)(curveIn_buildup_ef_left_notes_2)
    const curveIn_buildup_ef_right_2 = eff.oscillateEffect(96,8,curveInBuildUpAngle,curveInGroupEffect)
    const curveIn_buildup_ef_right_filter_2 = fl.orFilter([fl.beatFilter(100,102,false,true),fl.beatFilter(124,126,false,true),fl.beatFilter(140,142,false,true),fl.beatFilter(156,158,false,true)])
    const curveIn_buildup_ef_right_notes_2 = fn.filterObjects(allnotes,curveIn_buildup_ef_right_filter_2)
    fn.mapEffect(curveIn_buildup_ef_right_2)(curveIn_buildup_ef_right_notes_2)

    // Groups in build up
    const buildup_group_ef = eff.spawnGroups(0.6,2,0.5)
    fn.mapEffect(buildup_group_ef)(curveIn_buildup_ef_left_notes_1)
    fn.mapEffect(buildup_group_ef)(curveIn_buildup_ef_left_notes_2)
    fn.mapEffect(buildup_group_ef)(curveIn_buildup_ef_right_notes_1)
    fn.mapEffect(buildup_group_ef)(curveIn_buildup_ef_right_notes_2)

    // Walls in build up    
    const spiral_1_startAngle = -60
    const spiral_period = 5.5
    const spiral_1_1_cr = eff.wallSpiralPlace(98.5,100,spiral_1_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_1_1_cr,curveIn_buildup_ef_left_1)(undefined as unknown as remapper.Wall)
    const spiral_2_startAngle = 120
    const spiral_1_2_cr = eff.wallSpiralPlace(98.5,100,spiral_2_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_1_2_cr,curveIn_buildup_ef_left_1)(undefined as unknown as remapper.Wall)
    const spiral_2_1_cr = eff.wallSpiralPlace(106.5,108,spiral_1_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_2_1_cr,curveIn_buildup_ef_right_1)(undefined as unknown as remapper.Wall)
    const spiral_2_2_cr = eff.wallSpiralPlace(106.5,108,spiral_2_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_2_2_cr,curveIn_buildup_ef_right_1)(undefined as unknown as remapper.Wall)

    const spiral_3_1_cr = eff.wallSpiralPlace(114.5,116,spiral_1_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_3_1_cr,curveIn_buildup_ef_right_1)(undefined as unknown as remapper.Wall)
    const spiral_3_2_cr = eff.wallSpiralPlace(114.5,116,spiral_2_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_3_2_cr,curveIn_buildup_ef_right_1)(undefined as unknown as remapper.Wall)
    const spiral_4_1_cr = eff.wallSpiralPlace(122.5,124,spiral_1_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_4_1_cr,curveIn_buildup_ef_left_1)(undefined as unknown as remapper.Wall)
    const spiral_4_2_cr = eff.wallSpiralPlace(122.5,124,spiral_2_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_4_2_cr,curveIn_buildup_ef_left_1)(undefined as unknown as remapper.Wall)

    const spiral_5_1_cr = eff.wallSpiralPlace(130.5,132,spiral_1_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_5_1_cr,curveIn_buildup_ef_right_1)(undefined as unknown as remapper.Wall)
    const spiral_5_2_cr = eff.wallSpiralPlace(130.5,132,spiral_2_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_5_2_cr,curveIn_buildup_ef_right_1)(undefined as unknown as remapper.Wall)
    const spiral_6_1_cr = eff.wallSpiralPlace(138.5,140,spiral_1_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_6_1_cr,curveIn_buildup_ef_left_1)(undefined as unknown as remapper.Wall)
    const spiral_6_2_cr = eff.wallSpiralPlace(138.5,140,spiral_2_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_6_2_cr,curveIn_buildup_ef_left_1)(undefined as unknown as remapper.Wall)

    const spiral_7_1_cr = eff.wallSpiralPlace(146.5,148,spiral_1_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_7_1_cr,curveIn_buildup_ef_right_1)(undefined as unknown as remapper.Wall)
    const spiral_7_2_cr = eff.wallSpiralPlace(146.5,148,spiral_2_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_7_2_cr,curveIn_buildup_ef_right_1)(undefined as unknown as remapper.Wall)
    const spiral_8_1_cr = eff.wallSpiralPlace(154.5,156,spiral_1_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_8_1_cr,curveIn_buildup_ef_left_1)(undefined as unknown as remapper.Wall)
    const spiral_8_2_cr = eff.wallSpiralPlace(154.5,156,spiral_2_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_8_2_cr,curveIn_buildup_ef_left_1)(undefined as unknown as remapper.Wall)
}
else
{
    // Walls in build up
    const spiral_1_startAngle = -60
    const spiral_period = 5.5
    const spiral_1_1_cr = eff.wallSpiralPlace(98.5,100,spiral_1_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_1_1_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_2_startAngle = 120
    const spiral_1_2_cr = eff.wallSpiralPlace(98.5,100,spiral_2_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_1_2_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_2_1_cr = eff.wallSpiralPlace(106.5,108,spiral_1_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_2_1_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_2_2_cr = eff.wallSpiralPlace(106.5,108,spiral_2_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_2_2_cr,ef.noEffect())(undefined as unknown as remapper.Wall)

    const spiral_3_1_cr = eff.wallSpiralPlace(114.5,116,spiral_1_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_3_1_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_3_2_cr = eff.wallSpiralPlace(114.5,116,spiral_2_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_3_2_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_4_1_cr = eff.wallSpiralPlace(122.5,124,spiral_1_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_4_1_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_4_2_cr = eff.wallSpiralPlace(122.5,124,spiral_2_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_4_2_cr,ef.noEffect())(undefined as unknown as remapper.Wall)

    const spiral_5_1_cr = eff.wallSpiralPlace(130.5,132,spiral_1_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_5_1_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_5_2_cr = eff.wallSpiralPlace(130.5,132,spiral_2_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_5_2_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_6_1_cr = eff.wallSpiralPlace(138.5,140,spiral_1_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_6_1_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_6_2_cr = eff.wallSpiralPlace(138.5,140,spiral_2_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_6_2_cr,ef.noEffect())(undefined as unknown as remapper.Wall)

    const spiral_7_1_cr = eff.wallSpiralPlace(146.5,148,spiral_1_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_7_1_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_7_2_cr = eff.wallSpiralPlace(146.5,148,spiral_2_startAngle,spiral_period,-1)
    fn.createWithIndividualEffect(spiral_7_2_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_8_1_cr = eff.wallSpiralPlace(154.5,156,spiral_1_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_8_1_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
    const spiral_8_2_cr = eff.wallSpiralPlace(154.5,156,spiral_2_startAngle,spiral_period,1)
    fn.createWithIndividualEffect(spiral_8_2_cr,ef.noEffect())(undefined as unknown as remapper.Wall)
}


if(ismodcharttech())
{
    // Push back time pattern
    const pushback1_start = 112
    const pushback1_end = 113
    const pushback1_notes = fn.filterObjects(allnotes,fl.beatFilter(pushback1_start,pushback1_end,true,false))

    // Increase HJD
    const pushback1_hjd_inc = 1.5
    const pushback1_hjd_ef = ef.addHJD(pushback1_hjd_inc)
    const pushback1_start_delay = 2

    // Start closer and move backwards
    const pushback1_closer_hjd = 1.25
    const pushback1_closer_dist = (pushback1_closer_hjd*60*mapNJS)/(mapBPM*0.6)

    const pushback1_animation_start = pushback1_start - mapHJD - pushback1_hjd_inc - pushback1_start_delay // Before the first one spawns.
    const pushback1_push_time = 110 // When the push begins
    const pushback1_push_end_time = 112 // When the push ends
    const pushback1_animation_def : remapper.KeyframesVec3 = [[0,0,-pushback1_closer_dist,0],[0,0,-pushback1_closer_dist,pushback1_push_time-pushback1_animation_start],[0,0,0,pushback1_push_end_time-pushback1_animation_start,"easeInOutQuad"]]
    const pushback1_animation_trackdef = ef.animatePositionTrack(pushback1_animation_def)
    const pushback1_animation_duration = pushback1_push_end_time - pushback1_animation_start
    const pushback1_animation = ef.animateTrack(pushback1_animation_duration,pushback1_animation_trackdef)
    const pushback1_track = util.randomTrackName()

    // Fake notes that spawn earlier
    /*const pushback1_closer_spawn = ef.addTime(-pushback1_hjd_inc)
    const pushback1_dissolve_fake = eff.invisible()
    const pushback1_fake_efs = ef.combineEffects([pushback1_closer_spawn,pushback1_dissolve_fake])
    const pushback1_closer_creator = cr.effectOnFake(pushback1_fake_efs)
    fn.mapCreate(pushback1_closer_creator)(pushback1_notes)

    // Pop effect on note
    const pushback1_nospawn = eff.noSpawn()*/

    const pushback1_full_ef = ef.combineEffects([pushback1_hjd_ef,ef.addTrack(pushback1_track)])
    fn.mapEffect(pushback1_full_ef)(pushback1_notes)

    pushback1_animation(pushback1_animation_start)(pushback1_track)
}
else
{

}



// Bomb fields in drop
const bombFreq = 0.125
const bombScale = 0.75
const bombAngleStep = 15
const bombScale_ef = ef.animateScale([[bombScale,bombScale,bombScale,0]])
const bombnograv_ef = ef.disableNoteGravity()
const bomb_ef = ef.combineEffects([bombScale_ef,bombnograv_ef])

const bombfield1 = eff.bombFieldEllipse(util.interpolateFunction(160.2,-60,161.5,-90),util.interpolateFunction(160.2,120,161.5,90))
const bombfield1_sampler = geo.timeSampler(160.2,bombFreq)
const bombfield1_samples = geo.sampleTimeLinePattern(bombfield1,geo.basicLineSampler(180/bombAngleStep),bombfield1_sampler,160.2,161.5)

const bombfield1_cr = geo.placeBombs(bombfield1_samples)
fn.createWithIndividualEffect(bombfield1_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield2 = eff.bombFieldEllipse(util.interpolateFunction(162.2,45,163.5,120),util.interpolateFunction(162.2,135,163.5,210))
const bombfield2_sampler = geo.timeSampler(162.2,bombFreq)
const bombfield2_samples = geo.sampleTimeLinePattern(bombfield2,geo.basicLineSampler((135-45)/bombAngleStep),bombfield2_sampler,162.2,163.5)

const bombfield2_cr = geo.placeBombs(bombfield2_samples)
fn.createWithIndividualEffect(bombfield2_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield3 = eff.bombFieldEllipse(util.interpolateFunction(168.2,240,169.5,270),util.interpolateFunction(168.2,60,169.5,90))
const bombfield3_sampler = geo.timeSampler(168.2,bombFreq)
const bombfield3_samples = geo.sampleTimeLinePattern(bombfield3,geo.basicLineSampler(180/bombAngleStep),bombfield3_sampler,168.2,169.5)

const bombfield3_cr = geo.placeBombs(bombfield3_samples)
fn.createWithIndividualEffect(bombfield3_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield4 = eff.bombFieldEllipse(util.interpolateFunction(170.2,135,171.5,75),util.interpolateFunction(170.2,45,171.5,-15))
const bombfield4_sampler = geo.timeSampler(170.2,bombFreq)
const bombfield4_samples = geo.sampleTimeLinePattern(bombfield4,geo.basicLineSampler((135-45)/bombAngleStep),bombfield4_sampler,170.2,171.5)

const bombfield4_cr = geo.placeBombs(bombfield4_samples)
fn.createWithIndividualEffect(bombfield4_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield5 = eff.bombFieldEllipse(util.interpolateFunction(176.2,0,177.5,-15),util.interpolateFunction(176.2,90,177.5,75))
const bombfield5_sampler = geo.timeSampler(176.2,bombFreq)
const bombfield5_samples = geo.sampleTimeLinePattern(bombfield5,geo.basicLineSampler((90-0)/bombAngleStep),bombfield5_sampler,176.2,177.5)

const bombfield5_cr = geo.placeBombs(bombfield5_samples)
fn.createWithIndividualEffect(bombfield5_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield5_2 = eff.bombFieldEllipse(util.interpolateFunction(176.2,-120,177.5,-135),util.interpolateFunction(176.2,-135,177.5,-150))
const bombfield5_2_sampler = geo.timeSampler(176.2,bombFreq)
const bombfield5_2_samples = geo.sampleTimeLinePattern(bombfield5_2,geo.basicLineSampler((135-120)/bombAngleStep),bombfield5_2_sampler,176.2,177.5)

const bombfield5_2_cr = geo.placeBombs(bombfield5_2_samples)
fn.createWithIndividualEffect(bombfield5_2_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield6 = eff.bombFieldEllipse(util.interpolateFunction(178.2,45,179.5,90),util.interpolateFunction(178.2,135,179.5,180))
const bombfield6_sampler = geo.timeSampler(178.2,bombFreq)
const bombfield6_samples = geo.sampleTimeLinePattern(bombfield6,geo.basicLineSampler((135-45)/bombAngleStep),bombfield6_sampler,178.2,179.5)

const bombfield6_cr = geo.placeBombs(bombfield6_samples)
fn.createWithIndividualEffect(bombfield6_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield7 = eff.bombFieldEllipse(util.interpolateFunction(184.2,240,185.5,270),util.interpolateFunction(184.2,60,185.5,90))
const bombfield7_sampler = geo.timeSampler(184.2,bombFreq)
const bombfield7_samples = geo.sampleTimeLinePattern(bombfield7,geo.basicLineSampler(180/bombAngleStep),bombfield7_sampler,184.2,185.5)

const bombfield7_cr = geo.placeBombs(bombfield7_samples)
fn.createWithIndividualEffect(bombfield7_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield8 = eff.bombFieldEllipse(util.interpolateFunction(186.2,135,187.5,60),util.interpolateFunction(186.2,45,187.5,-30))
const bombfield8_sampler = geo.timeSampler(186.2,bombFreq)
const bombfield8_samples = geo.sampleTimeLinePattern(bombfield8,geo.basicLineSampler((135-45)/bombAngleStep),bombfield8_sampler,186.2,187.5)

const bombfield8_cr = geo.placeBombs(bombfield8_samples)
fn.createWithIndividualEffect(bombfield8_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield9 = eff.bombFieldEllipse(util.interpolateFunction(190.2,-105,191.5,-120),util.interpolateFunction(190.2,-75,191.5,-60))
const bombfield9_sampler = geo.timeSampler(190.2,bombFreq)
const bombfield9_samples = geo.sampleTimeLinePattern(bombfield9,geo.basicLineSampler((120-60)/bombAngleStep),bombfield9_sampler,190.2,191.5)

const bombfield9_cr = geo.placeBombs(bombfield9_samples)
fn.createWithIndividualEffect(bombfield9_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield9_2 = eff.bombFieldEllipse(util.interpolateFunction(190.2,120,191.5,105),util.interpolateFunction(190.2,60,191.5,75))
const bombfield9_2_sampler = geo.timeSampler(190.2,bombFreq)
const bombfield9_2_samples = geo.sampleTimeLinePattern(bombfield9_2,geo.basicLineSampler((120-60)/bombAngleStep),bombfield9_2_sampler,190.2,191.5)

const bombfield9_2_cr = geo.placeBombs(bombfield9_2_samples)
fn.createWithIndividualEffect(bombfield9_2_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield10 = eff.bombFieldEllipse(util.interpolateFunction(192.2,-100,193.5,-150),util.interpolateFunction(192.2,-80,193.5,-30))
const bombfield10_sampler = geo.timeSampler(192.2,bombFreq)
const bombfield10_samples = geo.sampleTimeLinePattern(bombfield10,geo.basicLineSampler((150-30)/bombAngleStep),bombfield10_sampler,192.2,193.5)

const bombfield10_cr = geo.placeBombs(bombfield10_samples)
fn.createWithIndividualEffect(bombfield10_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield11 = eff.bombFieldEllipse(util.interpolateFunction(194.2,45,195.5,0),util.interpolateFunction(194.2,0,195.5,-45))
const bombfield11_sampler = geo.timeSampler(194.2,bombFreq)
const bombfield11_samples = geo.sampleTimeLinePattern(bombfield11,geo.basicLineSampler((45-0)/bombAngleStep),bombfield11_sampler,194.2,195.5)

const bombfield11_cr = geo.placeBombs(bombfield11_samples)
fn.createWithIndividualEffect(bombfield11_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield12 = eff.bombFieldEllipse(util.interpolateFunction(198.2,90,199.5,90),util.interpolateFunction(198.2,270,199.5,270))
const bombfield12_sampler = geo.timeSampler(198.2,bombFreq)
const bombfield12_samples = geo.sampleTimeLinePattern(bombfield12,geo.basicLineSampler((270-90)/bombAngleStep),bombfield12_sampler,198.2,199.5)

const bombfield12_cr = geo.placeBombs(bombfield12_samples)
fn.createWithIndividualEffect(bombfield12_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield13 = eff.bombFieldEllipse(util.interpolateFunction(200.2,-60,201.5,30),util.interpolateFunction(200.2,120,201.5,210))
const bombfield13_sampler = geo.timeSampler(200.2,bombFreq)
const bombfield13_samples = geo.sampleTimeLinePattern(bombfield13,geo.basicLineSampler((120+60)/bombAngleStep),bombfield13_sampler,200.2,201.5)

const bombfield13_cr = geo.placeBombs(bombfield13_samples)
fn.createWithIndividualEffect(bombfield13_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield14 = eff.bombFieldEllipse(util.interpolateFunction(202.2,135,203.5,210),util.interpolateFunction(202.2,180,203.5,255))
const bombfield14_sampler = geo.timeSampler(202.2,bombFreq)
const bombfield14_samples = geo.sampleTimeLinePattern(bombfield14,geo.basicLineSampler((165-120)/bombAngleStep),bombfield14_sampler,202.2,203.5)

const bombfield14_cr = geo.placeBombs(bombfield14_samples)
fn.createWithIndividualEffect(bombfield14_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield15 = eff.bombFieldEllipse(util.interpolateFunction(206.2,120,207.5,120),util.interpolateFunction(206.2,270,207.5,270))
const bombfield15_sampler = geo.timeSampler(206.2,bombFreq)
const bombfield15_samples = geo.sampleTimeLinePattern(bombfield15,geo.basicLineSampler((270-120)/bombAngleStep),bombfield15_sampler,206.2,207.5)

const bombfield15_cr = geo.placeBombs(bombfield15_samples)
fn.createWithIndividualEffect(bombfield15_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield16 = eff.bombFieldEllipse(util.interpolateFunction(208.2,45,209.5,-45),util.interpolateFunction(208.2,-90,209.5,-180))
const bombfield16_sampler = geo.timeSampler(208.2,bombFreq)
const bombfield16_samples = geo.sampleTimeLinePattern(bombfield16,geo.basicLineSampler((180-45)/bombAngleStep),bombfield16_sampler,208.2,209.5)

const bombfield16_cr = geo.placeBombs(bombfield16_samples)
fn.createWithIndividualEffect(bombfield16_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield17 = eff.bombFieldEllipse(util.interpolateFunction(210.2,30,211.5,-15),util.interpolateFunction(210.2,-45,211.5,-90))
const bombfield17_sampler = geo.timeSampler(210.2,bombFreq)
const bombfield17_samples = geo.sampleTimeLinePattern(bombfield17,geo.basicLineSampler((45+30)/bombAngleStep),bombfield17_sampler,210.2,211.5)

const bombfield17_cr = geo.placeBombs(bombfield17_samples)
fn.createWithIndividualEffect(bombfield17_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield18 = eff.bombFieldEllipse(util.interpolateFunction(214.2,-120,215.5,-45),util.interpolateFunction(214.2,0,215.5,75))
const bombfield18_sampler = geo.timeSampler(214.2,bombFreq)
const bombfield18_samples = geo.sampleTimeLinePattern(bombfield18,geo.basicLineSampler((120-0)/bombAngleStep),bombfield18_sampler,214.2,215.5)

const bombfield18_cr = geo.placeBombs(bombfield18_samples)
fn.createWithIndividualEffect(bombfield18_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield19 = eff.bombFieldEllipse(util.interpolateFunction(216.2,90,217.5,15),util.interpolateFunction(216.2,180,217.5,105))
const bombfield19_sampler = geo.timeSampler(216.2,bombFreq)
const bombfield19_samples = geo.sampleTimeLinePattern(bombfield19,geo.basicLineSampler((180-90)/bombAngleStep),bombfield19_sampler,216.2,217.5)

const bombfield19_cr = geo.placeBombs(bombfield19_samples)
fn.createWithIndividualEffect(bombfield19_cr,bomb_ef)(undefined as unknown as remapper.Bomb)








// Bomb spirals in drop
/*const xoffset = -0.5
const yoffset = 1.25
const bombFreq = 0.125
const bombScale = 0.75
const wallspiraldropDist = bombFreq/2
const wallspiraldropSide = 0.5
const xoffsetw = -wallspiraldropSide/2
const yoffsetw = yoffset-xoffset+xoffsetw
const bombScale_ef = ef.animateScale([[bombScale,bombScale,bombScale,0]])
const bombnograv_ef = ef.disableNoteGravity()
const bomb_ef = ef.combineEffects([bombScale_ef,bombnograv_ef])
const wallunint_ef = ef.setUninteractable()

const bombspiral1_def: ty.TimePointPatternDefinition = [
    [160,Math.PI/4,1,2,xoffset-1,yoffset+0.5],
    [161,-Math.PI/4,1,2,xoffset-1,yoffset],
    [161.5,-Math.PI/4,1,2,xoffset-1,yoffset]
]
const bombspiral1 : ty.TimePointPattern = geo.drawPath(bombspiral1_def)
const bombspiral1_sampler = geo.timeSampler(160,bombFreq)
const bombspiral1_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral1,bombspiral1_sampler,160,161.5)

const bombspiral1_cr = geo.placeBombs(bombspiral1_samples)
fn.createWithIndividualEffect(bombspiral1_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral2_def: ty.TimePointPatternDefinition = [
    [162,Math.PI-Math.PI/4,0.2,2,xoffset+0.75,yoffset+0.5],
    [163,Math.PI*7/4,1,2,xoffset+0.75,yoffset],
    [163.5,Math.PI*2,2,2,xoffset+0.5,yoffset]
]
const bombspiral2 : ty.TimePointPattern = geo.drawPath(bombspiral2_def)
const bombspiral2_sampler = geo.timeSampler(162,bombFreq)
const bombspiral2_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral2,bombspiral2_sampler,162,163.5)

const bombspiral2_cr = geo.placeBombs(bombspiral2_samples)
fn.createWithIndividualEffect(bombspiral2_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral3_def: ty.TimePointPatternDefinition = [
    [168,Math.PI-Math.PI/4,1,2,xoffset+1,yoffset+0.5],
    [169,Math.PI+Math.PI/4,1,2,xoffset+1,yoffset],
    [169.5,Math.PI+Math.PI/4,1,2,xoffset+1,yoffset]
]
const bombspiral3 : ty.TimePointPattern = geo.drawPath(bombspiral3_def)
const bombspiral3_sampler = geo.timeSampler(168,bombFreq)
const bombspiral3_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral3,bombspiral3_sampler,168,169.5)

const bombspiral3_cr = geo.placeBombs(bombspiral3_samples)
fn.createWithIndividualEffect(bombspiral3_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral4_def: ty.TimePointPatternDefinition = [
    [170,Math.PI/4,0.2,2,xoffset-0.75,yoffset+0.5],
    [171,Math.PI-Math.PI*7/4,1,2,xoffset-0.75,yoffset],
    [171.5,Math.PI-Math.PI*2,2,2,xoffset-0.5,yoffset]
]
const bombspiral4 : ty.TimePointPattern = geo.drawPath(bombspiral4_def)
const bombspiral4_sampler = geo.timeSampler(170,bombFreq)
const bombspiral4_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral4,bombspiral4_sampler,170,171.4)

const bombspiral4_cr = geo.placeBombs(bombspiral4_samples)
fn.createWithIndividualEffect(bombspiral4_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral5_def: ty.TimePointPatternDefinition = [
    [176,0,1,1.5,xoffset-0.5,yoffset+0.5],
    [177,-Math.PI/2,1,1.25,xoffset-1.25,yoffset+0.25],
    [177.5,-Math.PI,2,1,xoffset-1.75,yoffset]
]
const bombspiral5 : ty.TimePointPattern = geo.drawPath(bombspiral5_def)
const bombspiral5_sampler = geo.timeSampler(176,bombFreq)
const bombspiral5_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral5,bombspiral5_sampler,176,177.5)

const bombspiral5_cr = geo.placeBombs(bombspiral5_samples)
fn.createWithIndividualEffect(bombspiral5_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral6_def: ty.TimePointPatternDefinition = [
    [178,Math.PI-Math.PI/4,0.2,2,xoffset+0.75,yoffset+0.5],
    [179,Math.PI*7/4,1,0.75,xoffset+1.25,yoffset],
    [179.5,Math.PI*2,2,0.5,xoffset+0.75,yoffset]
]
const bombspiral6 : ty.TimePointPattern = geo.drawPath(bombspiral6_def)
const bombspiral6_sampler = geo.timeSampler(178,bombFreq)
const bombspiral6_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral6,bombspiral6_sampler,178,179.5)

const bombspiral6_cr = geo.placeBombs(bombspiral6_samples)
fn.createWithIndividualEffect(bombspiral6_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral7_def: ty.TimePointPatternDefinition = [
    [184,Math.PI-Math.PI/4,1,2,xoffset+1,yoffset+0.5],
    [185,Math.PI+Math.PI/4,1,2,xoffset+1,yoffset],
    [185.5,Math.PI+Math.PI/4,1,2,xoffset+1,yoffset]
]
const bombspiral7 : ty.TimePointPattern = geo.drawPath(bombspiral7_def)
const bombspiral7_sampler = geo.timeSampler(184,bombFreq)
const bombspiral7_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral7,bombspiral7_sampler,184,185.5)

const bombspiral7_cr = geo.placeBombs(bombspiral7_samples)
fn.createWithIndividualEffect(bombspiral7_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral8_def: ty.TimePointPatternDefinition = [
    [186,Math.PI/4,0.2,2,xoffset-0.75,yoffset+0.5],
    [187,Math.PI-Math.PI*7/4,1,2,xoffset-0.75,yoffset],
    [187.5,Math.PI-Math.PI*2,2,2,xoffset-0.5,yoffset]
]
const bombspiral8 : ty.TimePointPattern = geo.drawPath(bombspiral8_def)
const bombspiral8_sampler = geo.timeSampler(186,bombFreq)
const bombspiral8_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral8,bombspiral8_sampler,186,187.4)

const bombspiral8_cr = geo.placeBombs(bombspiral8_samples)
fn.createWithIndividualEffect(bombspiral8_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const wallspiraldrop1_def: ty.TimePointPatternDefinition = [
    [190,Math.PI/4,0.75,2,xoffsetw-0.5,yoffsetw+0.5],
    [191,-Math.PI/3,0.75,2,xoffsetw-1,yoffsetw],
    [191.5,-Math.PI/2,1.5,2,xoffsetw-1.5,yoffsetw]
]
const wallspiraldrop1 : ty.TimePointPattern = geo.drawPath(wallspiraldrop1_def)
const wallspiraldrop1_sampler = geo.timeSampler(190,bombFreq)
const wallspiraldrop1_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop1,wallspiraldrop1_sampler,190,191.5)

const wallspiraldrop1_cr = geo.placeWalls(wallspiraldrop1_samples,wallspiraldropDist,wallspiraldropSide)
fn.createWithIndividualEffect(wallspiraldrop1_cr, wallunint_ef)(undefined as unknown as remapper.Wall)

const bombspiralwall1_def: ty.TimePointPatternDefinition = [
    [190,Math.PI/4,0.75,2,xoffset-0.5,yoffset+0.5],
    [191,-Math.PI/3,0.75,2,xoffset-1,yoffset],
    [191.5,-Math.PI/2,1.5,2,xoffset-1.5,yoffset]
]
const bombspiralwall1 : ty.TimePointPattern = geo.drawPath(bombspiralwall1_def)
const bombspiralwall1_sampler = geo.timeSampler(190,bombFreq)
const bombspiralwall1_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiralwall1,bombspiralwall1_sampler,190,191.5)

const bombspiralwall1_cr = geo.placeBombs(bombspiralwall1_samples)
fn.createWithIndividualEffect(bombspiralwall1_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const wallspiraldrop2_def: ty.TimePointPatternDefinition = [
    [190,Math.PI-Math.PI/4,0.75,2,xoffsetw+0.5,yoffsetw+0.5],
    [191,Math.PI+Math.PI/3,0.75,2,xoffsetw+1,yoffsetw],
    [191.5,Math.PI+Math.PI/2,1.5,2,xoffsetw+1.5,yoffsetw]
]
const wallspiraldrop2 : ty.TimePointPattern = geo.drawPath(wallspiraldrop2_def)
const wallspiraldrop2_sampler = geo.timeSampler(190,bombFreq)
const wallspiraldrop2_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop2,wallspiraldrop2_sampler,190,191.5)

const wallspiraldrop2_cr = geo.placeWalls(wallspiraldrop2_samples,wallspiraldropDist,wallspiraldropSide)
fn.createWithIndividualEffect(wallspiraldrop2_cr, wallunint_ef)(undefined as unknown as remapper.Wall)

const bombspiralwall2_def: ty.TimePointPatternDefinition = [
    [190,Math.PI-Math.PI/4,0.75,2,xoffset+0.5,yoffset+0.5],
    [191,Math.PI+Math.PI/3,0.75,2,xoffset+1,yoffset],
    [191.5,Math.PI+Math.PI/2,1.5,2,xoffset+1.5,yoffset]
]
const bombspiralwall2 : ty.TimePointPattern = geo.drawPath(bombspiralwall2_def)
const bombspiralwall2_sampler = geo.timeSampler(190,bombFreq)
const bombspiralwall2_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiralwall2,bombspiralwall2_sampler,190,191.5)

const bombspiralwall2_cr = geo.placeBombs(bombspiralwall2_samples)
fn.createWithIndividualEffect(bombspiralwall2_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral9_def: ty.TimePointPatternDefinition = [
    [192.2,Math.PI-Math.PI/4,1,2,xoffset,yoffset],
    [193,Math.PI*3/2,0,2,xoffset,yoffset],
    [193.5,Math.PI*2-Math.PI/3,3,2,xoffset,yoffset]
]
const bombspiral9 : ty.TimePointPattern = geo.drawPath(bombspiral9_def)
const bombspiral9_sampler = geo.timeSampler(192,bombFreq)
const bombspiral9_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral9,bombspiral9_sampler,192.2,193.5)

const bombspiral9_cr = geo.placeBombs(bombspiral9_samples)
fn.createWithIndividualEffect(bombspiral9_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral10_def: ty.TimePointPatternDefinition = [
    [192.2,Math.PI-Math.PI+Math.PI/4,1,2,xoffset,yoffset],
    [193,Math.PI-Math.PI*3/2,0,2,xoffset,yoffset],
    [193.5,Math.PI-Math.PI*2+Math.PI/3,3,2,xoffset,yoffset]
]
const bombspiral10 : ty.TimePointPattern = geo.drawPath(bombspiral10_def)
const bombspiral10_sampler = geo.timeSampler(192,bombFreq)
const bombspiral10_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral10,bombspiral10_sampler,192.2,193.5)

const bombspiral10_cr = geo.placeBombs(bombspiral10_samples)
fn.createWithIndividualEffect(bombspiral10_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral11_def: ty.TimePointPatternDefinition = [
    [194.2,Math.PI*5/12,3,2,xoffset,yoffset],
    [195,0,3,2,xoffset,yoffset],
    [195.5,-Math.PI/8,3,2,xoffset,yoffset]
]
const bombspiral11 : ty.TimePointPattern = geo.drawPath(bombspiral11_def)
const bombspiral11_sampler = geo.timeSampler(194,bombFreq)
const bombspiral11_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral11,bombspiral11_sampler,194.2,195.5)

const bombspiral11_cr = geo.placeBombs(bombspiral11_samples)
fn.createWithIndividualEffect(bombspiral11_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const wallspiraldrop3_def: ty.TimePointPatternDefinition = [
    [198.2,Math.PI*2/3,2.5,2.5,xoffset,yoffset],
    [198.85,Math.PI*2/3,4,2.5,xoffset,yoffset],
    [199.5,Math.PI*2/3,2.5,2.5,xoffset,yoffset]
]
const wallspiraldrop3 : ty.TimePointPattern = geo.drawPath(wallspiraldrop3_def,"easeInOutCirc")
const wallspiraldrop3_sampler = geo.timeSampler(198,bombFreq)
const wallspiraldrop3_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop3,wallspiraldrop3_sampler,198.2,199.5)

const wallspiraldrop3_cr = geo.placeWalls(wallspiraldrop3_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop3_cr(undefined as unknown as remapper.Wall)

const wallspiraldrop4_def: ty.TimePointPatternDefinition = [
    [198.2,Math.PI+Math.PI/3,2.5,2.5,xoffset,yoffset],
    [198.85,Math.PI+Math.PI/3,4,2.5,xoffset,yoffset],
    [199.5,Math.PI+Math.PI/3,2.5,2.5,xoffset,yoffset],
]
const wallspiraldrop4 : ty.TimePointPattern = geo.drawPath(wallspiraldrop4_def,"easeInOutCirc")
const wallspiraldrop4_sampler = geo.timeSampler(198,bombFreq)
const wallspiraldrop4_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop4,wallspiraldrop4_sampler,198.2,199.5)

const wallspiraldrop4_cr = geo.placeWalls(wallspiraldrop4_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop4_cr(undefined as unknown as remapper.Wall)

const bombspiral12_def: ty.TimePointPatternDefinition = [
    [200.2,0,3,2,xoffset,yoffset],
    [201,Math.PI/4,3,2,xoffset,yoffset],
    [201.5,Math.PI/2,3,2,xoffset,yoffset]
]
const bombspiral12 : ty.TimePointPattern = geo.drawPath(bombspiral12_def)
const bombspiral12_sampler = geo.timeSampler(200,bombFreq)
const bombspiral12_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral12,bombspiral12_sampler,200.2,201.5)

const bombspiral12_cr = geo.placeBombs(bombspiral12_samples)
fn.createWithIndividualEffect(bombspiral12_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral13_def: ty.TimePointPatternDefinition = [
    [202.2,-Math.PI-Math.PI/6,1.5,1.5,xoffset+1,yoffset-0.2],
    [203,0,1.5,0,xoffset+1,yoffset],
    [203.4,Math.PI/6,3,2,xoffset,yoffset]
]
const bombspiral13 : ty.TimePointPattern = geo.drawPath(bombspiral13_def)
const bombspiral13_sampler = geo.timeSampler(202,bombFreq)
const bombspiral13_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral13,bombspiral13_sampler,202.2,203.4)

const bombspiral13_cr = geo.placeBombs(bombspiral13_samples)
fn.createWithIndividualEffect(bombspiral13_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const wallspiraldrop5_def: ty.TimePointPatternDefinition = [
    [206.2,Math.PI*3/4,4,2.5,xoffset,yoffset],
    [207,Math.PI*5/4,4,2.5,xoffset,yoffset],
    [207.5,Math.PI+Math.PI/2,4,2.5,xoffset,yoffset]
]
const wallspiraldrop5: ty.TimePointPattern = geo.drawPath(wallspiraldrop5_def)
const wallspiraldrop5_sampler = geo.timeSampler(206,bombFreq)
const wallspiraldrop5_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop5,wallspiraldrop5_sampler,206,207.5)

const wallspiraldrop5_cr = geo.placeWalls(wallspiraldrop5_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop5_cr(undefined as unknown as remapper.Wall)

const wallspiraldrop6_def: ty.TimePointPatternDefinition = [
    [206.2,Math.PI+Math.PI/2,4,2.5,xoffset,yoffset],
    [207,Math.PI*5/4,4,2.5,xoffset,yoffset],
    [207.5,Math.PI*3/4,4,2.5,xoffset,yoffset],
]
const wallspiraldrop6 : ty.TimePointPattern = geo.drawPath(wallspiraldrop6_def)
const wallspiraldrop6_sampler = geo.timeSampler(206,bombFreq)
const wallspiraldrop6_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop6,wallspiraldrop6_sampler,206.2,207.5)

const wallspiraldrop6_cr = geo.placeWalls(wallspiraldrop6_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop6_cr(undefined as unknown as remapper.Wall)

const bombspiral14_def: ty.TimePointPatternDefinition = [
    [208.2,Math.PI/6,3,2,xoffset,yoffset],
    [209,-Math.PI/2,3,2,xoffset,yoffset],
    [209.5,-Math.PI+Math.PI/4,3,2,xoffset,yoffset]
]
const bombspiral14 : ty.TimePointPattern = geo.drawPath(bombspiral14_def)
const bombspiral14_sampler = geo.timeSampler(208,bombFreq)
const bombspiral14_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral14,bombspiral14_sampler,208.2,209.5)

const bombspiral14_cr = geo.placeBombs(bombspiral14_samples)
fn.createWithIndividualEffect(bombspiral14_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral15_def: ty.TimePointPatternDefinition = [
    [210.2,0,3,2,xoffset,yoffset],
    [211,-Math.PI+Math.PI/3,3,2,xoffset,yoffset],
    [211.5,-Math.PI+Math.PI/5,3,2,xoffset,yoffset]
]
const bombspiral15 : ty.TimePointPattern = geo.drawPath(bombspiral15_def)
const bombspiral15_sampler = geo.timeSampler(210,bombFreq)
const bombspiral15_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral15,bombspiral15_sampler,210.2,211.5)

const bombspiral15_cr = geo.placeBombs(bombspiral15_samples)
fn.createWithIndividualEffect(bombspiral15_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const wallspiraldrop7_def: ty.TimePointPatternDefinition = [
    [214.2,Math.PI+Math.PI/4,4,2.5,xoffset,yoffset],
    [215,Math.PI+Math.PI*3/4,4,2.5,xoffset,yoffset],
    [215.5,Math.PI*2,4,2.5,xoffset,yoffset]
]
const wallspiraldrop7: ty.TimePointPattern = geo.drawPath(wallspiraldrop7_def)
const wallspiraldrop7_sampler = geo.timeSampler(214,bombFreq)
const wallspiraldrop7_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop7,wallspiraldrop7_sampler,214.2,215.5)

const wallspiraldrop7_cr = geo.placeWalls(wallspiraldrop7_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop7_cr(undefined as unknown as remapper.Wall)

const wallspiraldrop8_def: ty.TimePointPatternDefinition = [
    [214.2,Math.PI+Math.PI/2,4,2.5,xoffset,yoffset],
    [215,Math.PI*2,4,2.5,xoffset,yoffset],
    [215.5,Math.PI*2+Math.PI/4,4,2.5,xoffset,yoffset],
]
const wallspiraldrop8 : ty.TimePointPattern = geo.drawPath(wallspiraldrop8_def)
const wallspiraldrop8_sampler = geo.timeSampler(214,bombFreq)
const wallspiraldrop8_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop8,wallspiraldrop8_sampler,214.2,215.5)

const wallspiraldrop8_cr = geo.placeWalls(wallspiraldrop8_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop8_cr(undefined as unknown as remapper.Wall)

const bombspiral16_def: ty.TimePointPatternDefinition = [
    [216.2,Math.PI,3,2,xoffset,yoffset],
    [217,Math.PI-Math.PI/4,3,2,xoffset,yoffset],
    [217.5,Math.PI-Math.PI/2,3,2,xoffset,yoffset]
]
const bombspiral16 : ty.TimePointPattern = geo.drawPath(bombspiral16_def)
const bombspiral16_sampler = geo.timeSampler(216,bombFreq)
const bombspiral16_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral16,bombspiral16_sampler,216.2,217.5)

const bombspiral16_cr = geo.placeBombs(bombspiral16_samples)
fn.createWithIndividualEffect(bombspiral16_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral17_def: ty.TimePointPatternDefinition = [
    [218.7,-Math.PI/4,3,2,xoffset,yoffset],
    [219,-Math.PI/2,3,2,xoffset,yoffset],
    [219.4,-Math.PI,3,2,xoffset,yoffset]
]
const bombspiral17 : ty.TimePointPattern = geo.drawPath(bombspiral17_def)
const bombspiral17_sampler = geo.timeSampler(218.5,bombFreq)
const bombspiral17_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral17,bombspiral17_sampler,218.7,219.4)

const bombspiral17_cr = geo.placeBombs(bombspiral17_samples)
fn.createWithIndividualEffect(bombspiral17_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const wallspiraldrop9_def: ty.TimePointPatternDefinition = [
    [222.2,Math.PI-Math.PI/4,4,2.5,xoffset,yoffset],
    [223.5,Math.PI+Math.PI/4,4,2.5,xoffset,yoffset]
]
const wallspiraldrop9: ty.TimePointPattern = geo.drawPath(wallspiraldrop9_def)
const wallspiraldrop9_sampler = geo.timeSampler(222,bombFreq)
const wallspiraldrop9_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop9,wallspiraldrop9_sampler,222.2,223.5)

const wallspiraldrop9_cr = geo.placeWalls(wallspiraldrop9_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop9_cr(undefined as unknown as remapper.Wall)

const wallspiraldrop10_def: ty.TimePointPatternDefinition = [
    [222.2,Math.PI+Math.PI/4,4,2.5,xoffset,yoffset],
    [223.5,Math.PI-Math.PI/4,4,2.5,xoffset,yoffset],
]
const wallspiraldrop10 : ty.TimePointPattern = geo.drawPath(wallspiraldrop10_def)
const wallspiraldrop10_sampler = geo.timeSampler(222,bombFreq)
const wallspiraldrop10_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop10,wallspiraldrop10_sampler,222.2,223.5)

const wallspiraldrop10_cr = geo.placeWalls(wallspiraldrop10_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop10_cr(undefined as unknown as remapper.Wall)
*/


// Post-drop side walls
//const postDropSideWallHJDPush = mapHJD
//const postDropSideWallHJD_ef = ef.addTime(postDropSideWallHJDPush)
//const postDropSideWallsFilter = fl.andFilter([fl.beatFilter(224,288,true,false),fl.orFilter([fl.laneFilter(-1),fl.laneFilter(4)])])
//const postDropSideWalls = fn.filterObjects(allwalls,postDropSideWallsFilter)

//fn.mapEffect(postDropSideWallHJD_ef)(postDropSideWalls)

// Post-drop bubble walls
if(ismodcharttech())
{
    const bubbleWallSize = 0.4
    const bubbleWallBaseHeight = 0.5
    const bubbleWallLevelHeight = 1

    const bubbleWall_group_ef: ty.NumberGroupEffect<remapper.Wall> = function(v: number)
    {    
        const side_ef = ef.setScale([bubbleWallSize,bubbleWallSize,bubbleWallSize])
        
        const init_pos = ef.initializePosition()
        const add_pos = ef.addPosition([0,bubbleWallBaseHeight+bubbleWallLevelHeight*v])

        return ef.combineEffects([side_ef,init_pos,add_pos])
    }

    const bubbleWalls = fn.filterObjects(allwalls,fl.groupFilter("bubblewall"))

    fn.mapEffect(gs.groupEffect(gs.customDataGrouper("bubblewall"),bubbleWall_group_ef))(bubbleWalls)
}
else
{

}


// Hold time pattern
if(ismodcharttech())
{
    const holdback1_start = 278.5
    const holdback1_end = 281
    const holdback1_notes = fn.filterObjects(allnotes,fl.beatFilter(holdback1_start,holdback1_end,true,false))
    const holdback1_walls = fn.filterObjects(allwalls,fl.beatFilter(holdback1_start,holdback1_end,true,false))

    // Increase HJD
    const holdback1_hjd_inc = 1.5
    const holdback1_hjd_ef = ef.addHJD(holdback1_hjd_inc)
    const holdback1_start_delay = 2

    // Start closer and move backwards
    const holdback1_closer_hjd = 1.25
    const holdback1_closer_adjust_factor = 0.95
    const holdback1_closer_dist = (holdback1_closer_hjd*60*mapNJS)/(mapBPM*0.6) * holdback1_closer_adjust_factor
    const holdback1_nogravity = ef.disableNoteGravity()

    const holdback1_animation_start = holdback1_start - mapHJD - holdback1_hjd_inc - holdback1_start_delay // Before the first one spawns.
    const holdback1_push_time = 278 // When the push begins
    const holdback1_push_end_time = 279.25 // When the push ends
    const holdback1_animation_def : remapper.KeyframesVec3 = [[0,0,-holdback1_closer_dist,0],[0,0,-holdback1_closer_dist,holdback1_push_time-holdback1_animation_start],[0,0,0,holdback1_push_end_time-holdback1_animation_start]]
    const holdback1_animation_trackdef = ef.animatePositionTrack(holdback1_animation_def)
    const holdback1_animation_duration = holdback1_push_end_time - holdback1_animation_start
    const holdback1_animation = ef.animateTrack(holdback1_animation_duration,holdback1_animation_trackdef)
    const holdback1_track = util.randomTrackName()

    const holdback1_dissolve = ef.animateDissolveTrack([[1,0],[0,holdback1_push_time-holdback1_animation_start,"easeStep"],[1,holdback1_push_end_time-holdback1_animation_start,"easeStep"]])
    const holdback1_dissolve_arrow = ef.animateDissolveArrowTrack([[1,0],[0,holdback1_push_time-holdback1_animation_start,"easeStep"],[1,holdback1_push_end_time-holdback1_animation_start,"easeStep"]])
    const holdback1_dissolve_animation = ef.animateTrack(holdback1_animation_duration,holdback1_dissolve)
    const holdback1_dissolve_arrow_animation = ef.animateTrack(holdback1_animation_duration,holdback1_dissolve_arrow)

    const holdback1_full_ef = ef.combineEffects([holdback1_hjd_ef,ef.addTrack(holdback1_track),holdback1_nogravity])
    const holdback1_full_ef_walls = ef.combineEffects([holdback1_hjd_ef,ef.addTrack(holdback1_track)])
    fn.mapEffect(holdback1_full_ef)(holdback1_notes)
    fn.mapEffect(holdback1_full_ef_walls)(holdback1_walls)

    holdback1_animation(holdback1_animation_start)(holdback1_track)
    holdback1_dissolve_animation(holdback1_animation_start)(holdback1_track)
    holdback1_dissolve_arrow_animation(holdback1_animation_start)(holdback1_track)
}
else
{

}


// Raindrops
if(ismodcharttech())
{
    const raindrop_notes = fn.filterObjects(allnotes,fl.beatFilter(288,320))
    const raindrop_hjd = 4
    const raindrop_extra_height = 20

    const raindrop_hjd_ef = ef.setHJD(raindrop_hjd)
    const raindrop_init_pos_ef = ef.initializePosition()
    const raindrop_height_ef = ef.animatePosition([[0,raindrop_extra_height,0,0,],[0,0,0,0.45,"easeOutSine"]])
    const raindrop_pop = eff.popObject()

    const raindrop_full_ef = ef.combineEffects([raindrop_hjd_ef,raindrop_init_pos_ef,raindrop_height_ef,raindrop_pop])

    fn.mapEffect(raindrop_full_ef)(raindrop_notes)

    const raindrop_notes_2 = fn.filterObjects(allnotes,fl.labelFilter("raindrop"))

    fn.mapEffect(raindrop_full_ef)(raindrop_notes_2)
}
else
{

}

// "Be free"
if(ismodcharttech())
{
    const befree_notes = fn.filterObjects(allnotes,fl.labelFilter("befree"))
    const befree_walls = fn.filterObjects(allwalls,fl.labelFilter("befree"))
    const befree_start = 440
    const befree_end = 448
    const befree_total_mult = 10

    const befree_init_position = ef.initializePosition()
    const befree_hjd = ef.parameterizeEffect(function(t: ty.BSObject)
    {
        return ef.setHJD(t.time - befree_start)
    })
    const befree_move = ef.parameterizeEffect(function(t: ty.BSObject)
    {
        const finalx = util.signedsqrt(t.position[0]+0.5)*befree_total_mult*(t.time-befree_start)/(befree_end-befree_start)
        const finaly = util.signedsqrt(t.position[1])*befree_total_mult*(t.time-befree_start)/(befree_end-befree_start)

        return ef.animatePosition([[0,0,0,0],[finalx,finaly,0,0.5]])
    })
    const befree_move_walls = ef.parameterizeEffect(function(t: remapper.Wall)
    {
        const finalx = util.signedsqrt(t.position[0]+0.5)*befree_total_mult
        const finaly = util.signedsqrt(t.position[1])*befree_total_mult

        const prop = util.getWallReachProp(t)

        return ef.animatePosition([[0,0,0,prop],[finalx,finaly,0,1]])
    })
    const befree_fake = ef.makeFakeNote(map)
    const befree_rotation = eff.randomRotate(120,720,120,720,0,0)
    const befree_rotation_wall = ef.parameterizeEffect(function(t: remapper.Wall)
    {
        return eff.randomRotate(30,240,30,240,0,0,util.getWallReachProp(t),1)
    })
    const befree_uninteractable = ef.setUninteractable()

    const befree_total_ef_notes = ef.combineEffects([befree_init_position,befree_hjd,befree_move,befree_fake,befree_rotation,befree_uninteractable])
    const befree_total_ef_walls = ef.combineEffects([befree_init_position,befree_move_walls,befree_rotation_wall,befree_uninteractable])

    fn.mapEffect(befree_total_ef_notes)(befree_notes)
    fn.mapEffect(befree_total_ef_walls)(befree_walls)
}
else
{

}

// Dies (end)

if(ismodcharttech())
{
    const dies_hjd = 5
    const dies_final_prop = 0.65
    const dies_drop = 12
    const dies_beat_extra = 4
    const dies_start_beat = 472
    //const dies_start_dist = dies_start_beats*60*mapNJS/(mapBPM*0.6)
    const dies_final_dissolve = 0.2

    const dies_hjd_ef = ef.setHJD(dies_hjd)
    const dies_init_pos = ef.initializePosition()
    const dies_drop_pos = ef.animatePosition([[0,0,0,0],[0,-dies_drop,0,dies_final_prop,"easeInQuad"]])
    const dies_slow_pos = ef.parameterizeEffect(function(note: remapper.Note)
    {
        const noteZ = (note.time-dies_beat_extra-dies_start_beat)*60*mapNJS/(mapBPM*0.6)
        return ef.animateDefinitePosition([[0,0,noteZ,0],[0,0,0,0.5,"easeLinear"]])
    })
    const dies_rotate = eff.randomRotate(200,540,200,540,0,0)
    const dies_dissolve = ef.animateDissolve([[1,0],[dies_final_dissolve,dies_final_prop]])
    const dies_dissolve_arrow = ef.animateDissolveArrow([[1,0],[dies_final_dissolve,dies_final_prop]])
    const dies_fake = ef.makeFakeNote(map)

    const dies_ef_total = ef.combineEffects([dies_hjd_ef,dies_init_pos,dies_drop_pos,dies_slow_pos,dies_rotate,dies_dissolve,dies_dissolve_arrow,dies_fake])

    const dies_notes = fn.filterObjects(allnotes,fl.labelFilter("dies"))

    fn.mapEffect(dies_ef_total)(dies_notes)
}
else
{

}



// Create towers
const tower_notes = fn.filterObjects(allnotes,fl.labelFilter("tower"))
const tower_init_pos = ef.initializePosition()
const tower_cr = eff.createTower()

fn.mapEffect(tower_init_pos)(tower_notes)
fn.mapCreate(tower_cr)(tower_notes)

// Build up 2 curve in

if(ismodcharttech())
{
    const curveIn_buildup_ef_left_3 = eff.oscillateEffect(324,8,curveInBuildUpAngle,curveInGroupEffect)
    const curveIn_buildup_ef_left_filter_3 = fl.orFilter([fl.beatFilter(324,326,false,true),fl.beatFilter(332,334,false,true),fl.beatFilter(340,342,false,true),fl.beatFilter(348,350,false,true)])
    const curveIn_buildup_ef_left_notes_3 = fn.filterObjects(allnotes,curveIn_buildup_ef_left_filter_3)
    fn.mapEffect(curveIn_buildup_ef_left_3)(curveIn_buildup_ef_left_notes_3)
    const curveIn_buildup_ef_right_3 = eff.oscillateEffect(316,8,curveInBuildUpAngle,curveInGroupEffect)
    const curveIn_buildup_ef_right_filter_3 = fl.orFilter([fl.beatFilter(320,322,false,true),fl.beatFilter(328,330,false,true),fl.beatFilter(336,338,false,true),fl.beatFilter(344,346,false,true)])
    const curveIn_buildup_ef_right_notes_3 = fn.filterObjects(allnotes,curveIn_buildup_ef_right_filter_3)
    fn.mapEffect(curveIn_buildup_ef_right_3)(curveIn_buildup_ef_right_notes_3)
}
else
{

}

// Growing notes in drop 2
// const grow_drop2_height_max = 2
// const grow_drop2_open_max_prop = 2.5

// const grow_drop2_height_group_ef : ty.NumberGroupEffect<remapper.Note> = function(height: number)
// {
//     return ef.addPosition([0,height])
// }

// const grow_drop2_width_group_ef : ty.NumberGroupEffect<remapper.Note> = function(widthprop: number)
// {
//     return ef.parameterizeEffectByField("position",function(position: remapper.Vec2)
//     {
//         return ef.setPosition([(position[0]+0.5)*widthprop-0.5,position[1]])
//     })
// }

// const grow_drop2_initpos_ef = ef.initializePosition()
// const grow_drop2_height_ef = eff.interpolateEffect(358,0,360,grow_drop2_height_max,grow_drop2_height_group_ef)
// const grow_drop2_width_ef = eff.interpolateEffect(358,1,360,grow_drop2_open_max_prop,grow_drop2_width_group_ef)

// const grow_drop2_total_ef = ef.combineEffects([grow_drop2_initpos_ef,grow_drop2_height_ef,grow_drop2_width_ef])

// const grow_drop2_notes = fn.filterObjects(allnotes,fl.beatFilter(358,360,true,false))

// fn.mapEffect(grow_drop2_total_ef)(grow_drop2_notes)

const grow_drop2_angle_min = 0
const grow_drop2_angle_max = 30
const grow_drop2_move_min = 0
const grow_drop2_move_max = 2

const grow_drop2_angle_group_ef : ty.NumberGroupEffect<remapper.Note> = function(angle: number)
{
    return ef.setAngle(angle)
}

const grow_drop2_move_group_ef : ty.NumberGroupEffect<remapper.Note> = function(move: number)
{
    return fn.filterEffect(fl.laneFilter(1),ef.addPosition([move,move/2]),ef.addPosition([move/2,0]))
}

const grow_drop2_initpos_ef = ef.initializePosition()
const grow_drop2_angle_ef = eff.interpolateEffect(358,grow_drop2_angle_min,360,grow_drop2_angle_max,grow_drop2_angle_group_ef)
const grow_drop2_move_ef = eff.interpolateEffect(358,grow_drop2_move_min,360,grow_drop2_move_max,grow_drop2_move_group_ef)

const grow_drop2_total_ef = ef.combineEffects([grow_drop2_initpos_ef,grow_drop2_angle_ef,grow_drop2_move_ef])

const grow_drop2_notes = fn.filterObjects(allnotes,fl.beatFilter(358,360,true,false))

fn.mapEffect(grow_drop2_total_ef)(grow_drop2_notes)


// Drop 2 fields
const bombfield20 = eff.bombFieldEllipse(util.interpolateFunction(350.2,-105,351.5,-45),util.interpolateFunction(350.2,0,351.5,60))
const bombfield20_sampler = geo.timeSampler(350.2,bombFreq)
const bombfield20_samples = geo.sampleTimeLinePattern(bombfield20,geo.basicLineSampler((105-0)/bombAngleStep),bombfield20_sampler,350.2,351.5)

const bombfield20_cr = geo.placeBombs(bombfield20_samples)
fn.createWithIndividualEffect(bombfield20_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield21 = eff.bombFieldEllipse(util.interpolateFunction(352.2,135,353.5,195),util.interpolateFunction(352.2,270,353.5,330))
const bombfield21_sampler = geo.timeSampler(352.2,bombFreq)
const bombfield21_samples = geo.sampleTimeLinePattern(bombfield21,geo.basicLineSampler((270-135)/bombAngleStep),bombfield21_sampler,352.2,353.5)

const bombfield21_cr = geo.placeBombs(bombfield21_samples)
fn.createWithIndividualEffect(bombfield21_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield22 = eff.bombFieldEllipse(util.interpolateFunction(354.2,60,355.5,15),util.interpolateFunction(354.2,15,355.5,-30))
const bombfield22_sampler = geo.timeSampler(354.2,bombFreq)
const bombfield22_samples = geo.sampleTimeLinePattern(bombfield22,geo.basicLineSampler((90-45)/bombAngleStep),bombfield22_sampler,354.2,355.5)

const bombfield22_cr = geo.placeBombs(bombfield22_samples)
fn.createWithIndividualEffect(bombfield22_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield23 = eff.bombFieldEllipse(util.interpolateFunction(360.2,-30,361.5,-120),util.interpolateFunction(360.2,-105,361.5,-195))
const bombfield23_sampler = geo.timeSampler(360.2,bombFreq)
const bombfield23_samples = geo.sampleTimeLinePattern(bombfield23,geo.basicLineSampler((105-30)/bombAngleStep),bombfield23_sampler,360.2,361.5)

const bombfield23_cr = geo.placeBombs(bombfield23_samples)
fn.createWithIndividualEffect(bombfield23_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield24 = eff.bombFieldEllipse(util.interpolateFunction(362.2,90,363.5,135),util.interpolateFunction(362.2,135,363.5,180))
const bombfield24_sampler = geo.timeSampler(362.2,bombFreq)
const bombfield24_samples = geo.sampleTimeLinePattern(bombfield24,geo.basicLineSampler((90-45)/bombAngleStep),bombfield24_sampler,362.2,363.5)

const bombfield24_cr = geo.placeBombs(bombfield24_samples)
fn.createWithIndividualEffect(bombfield24_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield25 = eff.bombFieldEllipse(util.interpolateFunction(368.2,-165,369.5,-30),util.interpolateFunction(368.2,-90,369.5,45))
const bombfield25_sampler = geo.timeSampler(368.2,bombFreq)
const bombfield25_samples = geo.sampleTimeLinePattern(bombfield25,geo.basicLineSampler((165-90)/bombAngleStep),bombfield25_sampler,368.2,369.5)

const bombfield25_cr = geo.placeBombs(bombfield25_samples)
fn.createWithIndividualEffect(bombfield25_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield26 = eff.bombFieldEllipse(util.interpolateFunction(370.2,60,371.5,15),util.interpolateFunction(370.2,15,371.5,-30))
const bombfield26_sampler = geo.timeSampler(370.2,bombFreq)
const bombfield26_samples = geo.sampleTimeLinePattern(bombfield26,geo.basicLineSampler((90-45)/bombAngleStep),bombfield26_sampler,370.2,371.5)

const bombfield26_cr = geo.placeBombs(bombfield26_samples)
fn.createWithIndividualEffect(bombfield26_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield27 = eff.bombFieldEllipse(util.interpolateFunction(376.2,-45,377.5,30),util.interpolateFunction(376.2,-105,377.5,-30))
const bombfield27_sampler = geo.timeSampler(376.2,bombFreq)
const bombfield27_samples = geo.sampleTimeLinePattern(bombfield27,geo.basicLineSampler((105-45)/bombAngleStep),bombfield27_sampler,376.2,377.5)

const bombfield27_cr = geo.placeBombs(bombfield27_samples)
fn.createWithIndividualEffect(bombfield27_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield28 = eff.bombFieldEllipse(util.interpolateFunction(378.2,270,379.5,225),util.interpolateFunction(378.2,195,379.5,150))
const bombfield28_sampler = geo.timeSampler(378.2,bombFreq)
const bombfield28_samples = geo.sampleTimeLinePattern(bombfield28,geo.basicLineSampler((240-165)/bombAngleStep),bombfield28_sampler,378.2,379.5)

const bombfield28_cr = geo.placeBombs(bombfield28_samples)
fn.createWithIndividualEffect(bombfield28_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield29 = eff.bombFieldEllipse(util.interpolateFunction(382.2,300,383.5,255),util.interpolateFunction(382.2,180,383.5,135))
const bombfield29_sampler = geo.timeSampler(382.2,bombFreq)
const bombfield29_samples = geo.sampleTimeLinePattern(bombfield29,geo.basicLineSampler((120-0)/bombAngleStep),bombfield29_sampler,382.2,383.5)

const bombfield29_cr = geo.placeBombs(bombfield29_samples)
fn.createWithIndividualEffect(bombfield29_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield30 = eff.bombFieldEllipse(util.interpolateFunction(384.2,-60,385.5,-90),util.interpolateFunction(384.2,120,385.5,90))
const bombfield30_sampler = geo.timeSampler(384.2,bombFreq)
const bombfield30_samples = geo.sampleTimeLinePattern(bombfield30,geo.basicLineSampler(180/bombAngleStep),bombfield30_sampler,384.2,385.5)

const bombfield30_cr = geo.placeBombs(bombfield30_samples)
fn.createWithIndividualEffect(bombfield30_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield31 = eff.bombFieldEllipse(util.interpolateFunction(386.2,45,387.5,120),util.interpolateFunction(386.2,135,387.5,210))
const bombfield31_sampler = geo.timeSampler(386.2,bombFreq)
const bombfield31_samples = geo.sampleTimeLinePattern(bombfield31,geo.basicLineSampler((135-45)/bombAngleStep),bombfield31_sampler,386.2,387.5)

const bombfield31_cr = geo.placeBombs(bombfield31_samples)
fn.createWithIndividualEffect(bombfield31_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield32 = eff.bombFieldEllipse(util.interpolateFunction(390.2,-105,391.5,-120),util.interpolateFunction(390.2,-75,391.5,-60))
const bombfield32_sampler = geo.timeSampler(390.2,bombFreq)
const bombfield32_samples = geo.sampleTimeLinePattern(bombfield32,geo.basicLineSampler((120-60)/bombAngleStep),bombfield32_sampler,390.2,391.5)

const bombfield32_cr = geo.placeBombs(bombfield32_samples)
fn.createWithIndividualEffect(bombfield32_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield32_2 = eff.bombFieldEllipse(util.interpolateFunction(390.2,120,391.5,105),util.interpolateFunction(390.2,60,391.5,75))
const bombfield32_2_sampler = geo.timeSampler(390.2,bombFreq)
const bombfield32_2_samples = geo.sampleTimeLinePattern(bombfield32_2,geo.basicLineSampler((120-60)/bombAngleStep),bombfield32_2_sampler,390.2,391.5)

const bombfield32_2_cr = geo.placeBombs(bombfield32_2_samples)
fn.createWithIndividualEffect(bombfield32_2_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield33 = eff.bombFieldEllipse(util.interpolateFunction(392.2,-100,393.5,-150),util.interpolateFunction(392.2,-80,393.5,-30))
const bombfield33_sampler = geo.timeSampler(392.2,bombFreq)
const bombfield33_samples = geo.sampleTimeLinePattern(bombfield33,geo.basicLineSampler((150-30)/bombAngleStep),bombfield33_sampler,392.2,393.5)

const bombfield33_cr = geo.placeBombs(bombfield33_samples)
fn.createWithIndividualEffect(bombfield33_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield34 = eff.bombFieldEllipse(util.interpolateFunction(394.2,135,395.5,180),util.interpolateFunction(394.2,180,395.5,225))
const bombfield34_sampler = geo.timeSampler(394.2,bombFreq)
const bombfield34_samples = geo.sampleTimeLinePattern(bombfield34,geo.basicLineSampler((45-0)/bombAngleStep),bombfield34_sampler,394.2,395.5)

const bombfield34_cr = geo.placeBombs(bombfield34_samples)
fn.createWithIndividualEffect(bombfield34_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield35 = eff.bombFieldEllipse(util.interpolateFunction(398.2,90,399.5,90),util.interpolateFunction(398.2,-90,399.5,-90))
const bombfield35_sampler = geo.timeSampler(398.2,bombFreq)
const bombfield35_samples = geo.sampleTimeLinePattern(bombfield35,geo.basicLineSampler((270-90)/bombAngleStep),bombfield35_sampler,398.2,399.5)

const bombfield35_cr = geo.placeBombs(bombfield35_samples)
fn.createWithIndividualEffect(bombfield35_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield36 = eff.bombFieldEllipse(util.interpolateFunction(400.2,240,401.5,150),util.interpolateFunction(400.2,60,401.5,-30))
const bombfield36_sampler = geo.timeSampler(400.2,bombFreq)
const bombfield36_samples = geo.sampleTimeLinePattern(bombfield36,geo.basicLineSampler((120+60)/bombAngleStep),bombfield36_sampler,400.2,401.5)

const bombfield36_cr = geo.placeBombs(bombfield36_samples)
fn.createWithIndividualEffect(bombfield36_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield37 = eff.bombFieldEllipse(util.interpolateFunction(402.2,45,403.5,-30),util.interpolateFunction(402.2,0,403.5,-75))
const bombfield37_sampler = geo.timeSampler(402.2,bombFreq)
const bombfield37_samples = geo.sampleTimeLinePattern(bombfield37,geo.basicLineSampler((165-120)/bombAngleStep),bombfield37_sampler,402.2,403.5)

const bombfield37_cr = geo.placeBombs(bombfield37_samples)
fn.createWithIndividualEffect(bombfield37_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield38 = eff.bombFieldEllipse(util.interpolateFunction(406.2,60,407.5,60),util.interpolateFunction(406.2,-90,407.5,-90))
const bombfield38_sampler = geo.timeSampler(406.2,bombFreq)
const bombfield38_samples = geo.sampleTimeLinePattern(bombfield38,geo.basicLineSampler((270-120)/bombAngleStep),bombfield38_sampler,406.2,407.5)

const bombfield38_cr = geo.placeBombs(bombfield38_samples)
fn.createWithIndividualEffect(bombfield38_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombfield39 = eff.bombFieldEllipse(util.interpolateFunction(408.2,135,409.5,225),util.interpolateFunction(408.2,270,409.5,360))
const bombfield39_sampler = geo.timeSampler(408.2,bombFreq)
const bombfield39_samples = geo.sampleTimeLinePattern(bombfield39,geo.basicLineSampler((180-45)/bombAngleStep),bombfield39_sampler,408.2,409.5)

const bombfield39_cr = geo.placeBombs(bombfield39_samples)
fn.createWithIndividualEffect(bombfield39_cr,bomb_ef)(undefined as unknown as remapper.Bomb)






// Drop 2 spirals
/*const bombspiral18_def: ty.TimePointPatternDefinition = [
    [352.2,Math.PI-Math.PI/3,3,2,xoffset,yoffset],
    [353,Math.PI+Math.PI/4,3,2,xoffset,yoffset],
    [353.5,Math.PI+Math.PI/2+Math.PI/6,3,2,xoffset,yoffset]
]
const bombspiral18 : ty.TimePointPattern = geo.drawPath(bombspiral18_def)
const bombspiral18_sampler = geo.timeSampler(352,bombFreq)
const bombspiral18_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral18,bombspiral18_sampler,352.2,353.5)

const bombspiral18_cr = geo.placeBombs(bombspiral18_samples)
fn.createWithIndividualEffect(bombspiral18_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral19_def: ty.TimePointPatternDefinition = [
    [354.2,Math.PI*5/12,3,2,xoffset,yoffset],
    [355,0,3,2,xoffset,yoffset],
    [355.5,-Math.PI/8,3,2,xoffset,yoffset]
]
const bombspiral19 : ty.TimePointPattern = geo.drawPath(bombspiral19_def)
const bombspiral19_sampler = geo.timeSampler(354,bombFreq)
const bombspiral19_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral19,bombspiral19_sampler,354.2,355.5)

const bombspiral19_cr = geo.placeBombs(bombspiral19_samples)
fn.createWithIndividualEffect(bombspiral19_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral20_def: ty.TimePointPatternDefinition = [
    [360.2,-Math.PI/4,3,2,xoffset,yoffset],
    [361,-Math.PI/2,3,2,xoffset,yoffset],
    [361.5,-Math.PI+Math.PI/6,3,2,xoffset,yoffset]
]
const bombspiral20 : ty.TimePointPattern = geo.drawPath(bombspiral20_def)
const bombspiral20_sampler = geo.timeSampler(360,bombFreq)
const bombspiral20_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral20,bombspiral20_sampler,360.2,361.5)

const bombspiral20_cr = geo.placeBombs(bombspiral20_samples)
fn.createWithIndividualEffect(bombspiral20_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral21_def: ty.TimePointPatternDefinition = [
    [362.2,Math.PI-Math.PI*5/12,3,2,xoffset,yoffset],
    [363,Math.PI,3,2,xoffset,yoffset],
    [363.5,Math.PI+Math.PI/8,3,2,xoffset,yoffset]
]
const bombspiral21 : ty.TimePointPattern = geo.drawPath(bombspiral21_def)
const bombspiral21_sampler = geo.timeSampler(362,bombFreq)
const bombspiral21_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral21,bombspiral21_sampler,362.2,363.5)

const bombspiral21_cr = geo.placeBombs(bombspiral21_samples)
fn.createWithIndividualEffect(bombspiral21_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral22_def: ty.TimePointPatternDefinition = [
    [368.2,Math.PI+Math.PI/4,3,2,xoffset,yoffset],
    [369,Math.PI+Math.PI/2,3,2,xoffset,yoffset],
    [369.5,Math.PI+Math.PI-Math.PI/6,3,2,xoffset,yoffset]
]
const bombspiral22 : ty.TimePointPattern = geo.drawPath(bombspiral22_def)
const bombspiral22_sampler = geo.timeSampler(368,bombFreq)
const bombspiral22_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral22,bombspiral22_sampler,368.2,369.5)

const bombspiral22_cr = geo.placeBombs(bombspiral22_samples)
fn.createWithIndividualEffect(bombspiral22_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral23_def: ty.TimePointPatternDefinition = [
    [370.2,Math.PI*5/12,3,2,xoffset,yoffset],
    [371,0,3,2,xoffset,yoffset],
    [371.5,-Math.PI/8,3,2,xoffset,yoffset]
]
const bombspiral23 : ty.TimePointPattern = geo.drawPath(bombspiral23_def)
const bombspiral23_sampler = geo.timeSampler(370,bombFreq)
const bombspiral23_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral23,bombspiral23_sampler,370.2,371.5)

const bombspiral23_cr = geo.placeBombs(bombspiral23_samples)
fn.createWithIndividualEffect(bombspiral23_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral24_def: ty.TimePointPatternDefinition = [
    [376.2,-Math.PI/2-Math.PI/12,3,2,xoffset,yoffset],
    [377,-Math.PI/4,3,2,xoffset,yoffset],
    [377.5,-Math.PI/8,3,2,xoffset,yoffset]
]
const bombspiral24 : ty.TimePointPattern = geo.drawPath(bombspiral24_def)
const bombspiral24_sampler = geo.timeSampler(376,bombFreq)
const bombspiral24_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral24,bombspiral24_sampler,376.2,377.5)

const bombspiral24_cr = geo.placeBombs(bombspiral24_samples)
fn.createWithIndividualEffect(bombspiral24_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral25_def: ty.TimePointPatternDefinition = [
    [378.2,Math.PI+Math.PI/4,3,2,xoffset,yoffset],
    [379,Math.PI/2+Math.PI/3,3,2,xoffset,yoffset],
    [379.5,Math.PI/2+Math.PI/5,3,2,xoffset,yoffset]
]
const bombspiral25 : ty.TimePointPattern = geo.drawPath(bombspiral25_def)
const bombspiral25_sampler = geo.timeSampler(378,bombFreq)
const bombspiral25_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral25,bombspiral25_sampler,378.2,379.5)

const bombspiral25_cr = geo.placeBombs(bombspiral25_samples)
fn.createWithIndividualEffect(bombspiral25_cr,bomb_ef)(undefined as unknown as remapper.Bomb)


const wallspiraldrop11_def: ty.TimePointPatternDefinition = [
    [382.2,-Math.PI/4,4,2.5,xoffset,yoffset],
    [383,-Math.PI*3/4,4,2.5,xoffset,yoffset],
    [383.5,-Math.PI,4,2.5,xoffset,yoffset]
]
const wallspiraldrop11 : ty.TimePointPattern = geo.drawPath(wallspiraldrop11_def)
const wallspiraldrop11_sampler = geo.timeSampler(382,bombFreq)
const wallspiraldrop11_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop11,wallspiraldrop11_sampler,382.2,383.5)

const wallspiraldrop11_cr = geo.placeWalls(wallspiraldrop11_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop11_cr(undefined as unknown as remapper.Wall)

const wallspiraldrop12_def: ty.TimePointPatternDefinition = [
    [382.2,-Math.PI/2,4,2.5,xoffset,yoffset],
    [383,-Math.PI,4,2.5,xoffset,yoffset],
    [383.5,-Math.PI-Math.PI/4,4,2.5,xoffset,yoffset]
]
const wallspiraldrop12 : ty.TimePointPattern = geo.drawPath(wallspiraldrop12_def)
const wallspiraldrop12_sampler = geo.timeSampler(382,bombFreq)
const wallspiraldrop12_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop12,wallspiraldrop12_sampler,382.2,383.5)

const wallspiraldrop12_cr = geo.placeWalls(wallspiraldrop12_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop12_cr(undefined as unknown as remapper.Wall)

const bombspiral26_def: ty.TimePointPatternDefinition = [
    [384.2,Math.PI/4,3,2,xoffset,yoffset],
    [385,-Math.PI/3,3,2,xoffset,yoffset],
    [385.5,-Math.PI/2,3,2,xoffset,yoffset]
]
const bombspiral26 : ty.TimePointPattern = geo.drawPath(bombspiral26_def)
const bombspiral26_sampler = geo.timeSampler(384,bombFreq)
const bombspiral26_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral26,bombspiral26_sampler,384.2,385.5)

const bombspiral26_cr = geo.placeBombs(bombspiral26_samples)
fn.createWithIndividualEffect(bombspiral26_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral27_def: ty.TimePointPatternDefinition = [
    [386.2,Math.PI-Math.PI/4,0.2,2,xoffset,yoffset],
    [387,Math.PI*7/4,1,2,xoffset,yoffset],
    [387.5,Math.PI*2,3,2,xoffset,yoffset]
]
const bombspiral27 : ty.TimePointPattern = geo.drawPath(bombspiral27_def)
const bombspiral27_sampler = geo.timeSampler(386,bombFreq)
const bombspiral27_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral27,bombspiral27_sampler,386.2,387.5)

const bombspiral27_cr = geo.placeBombs(bombspiral27_samples)
fn.createWithIndividualEffect(bombspiral27_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const wallspiraldrop13_def: ty.TimePointPatternDefinition = [
    [390.2,Math.PI/4,4,2.5,xoffset,yoffset],
    [391,-Math.PI/3+Math.PI/8,4,2,xoffset,yoffset],
    [391.5,-Math.PI/2,3,1.5,xoffset,yoffset]
]
const wallspiraldrop13 : ty.TimePointPattern = geo.drawPath(wallspiraldrop13_def)
const wallspiraldrop13_sampler = geo.timeSampler(390,bombFreq)
const wallspiraldrop13_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop13,wallspiraldrop13_sampler,390.2,391.5)

const wallspiraldrop13_cr = geo.placeWalls(wallspiraldrop13_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop13_cr(undefined as unknown as remapper.Wall)

const wallspiraldrop14_def: ty.TimePointPatternDefinition = [
    [390.2,Math.PI-Math.PI/4,4,2.5,xoffset,yoffset],
    [391,Math.PI+Math.PI/3-Math.PI/8,4,2.5,xoffset,yoffset],
    [391.5,Math.PI+Math.PI/2,3,1.5,xoffset,yoffset]
]
const wallspiraldrop14 : ty.TimePointPattern = geo.drawPath(wallspiraldrop14_def)
const wallspiraldrop14_sampler = geo.timeSampler(390,bombFreq)
const wallspiraldrop14_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop14,wallspiraldrop14_sampler,390.2,391.5)

const wallspiraldrop14_cr = geo.placeWalls(wallspiraldrop14_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop14_cr(undefined as unknown as remapper.Wall)

const bombspiral28_def: ty.TimePointPatternDefinition = [
    [392.2,Math.PI-Math.PI/4,1,2,xoffset,yoffset],
    [393,Math.PI*3/2,0,2,xoffset,yoffset],
    [393.5,Math.PI*2-Math.PI/3,3,2,xoffset,yoffset]
]
const bombspiral28 : ty.TimePointPattern = geo.drawPath(bombspiral28_def)
const bombspiral28_sampler = geo.timeSampler(392,bombFreq)
const bombspiral28_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral28,bombspiral28_sampler,392.2,393.5)

const bombspiral28_cr = geo.placeBombs(bombspiral28_samples)
fn.createWithIndividualEffect(bombspiral28_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral29_def: ty.TimePointPatternDefinition = [
    [392.2,Math.PI-Math.PI+Math.PI/4,1,2,xoffset,yoffset],
    [393,Math.PI-Math.PI*3/2,0,2,xoffset,yoffset],
    [393.5,Math.PI-Math.PI*2+Math.PI/3,3,2,xoffset,yoffset]
]
const bombspiral29 : ty.TimePointPattern = geo.drawPath(bombspiral29_def)
const bombspiral29_sampler = geo.timeSampler(392,bombFreq)
const bombspiral29_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral29,bombspiral29_sampler,392.2,393.5)

const bombspiral29_cr = geo.placeBombs(bombspiral29_samples)
fn.createWithIndividualEffect(bombspiral29_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral30_def: ty.TimePointPatternDefinition = [
    [394.2,Math.PI-Math.PI*5/12,3,2,xoffset,yoffset],
    [395,Math.PI,3,2,xoffset,yoffset],
    [395.5,Math.PI+Math.PI/8,3,2,xoffset,yoffset]
]
const bombspiral30 : ty.TimePointPattern = geo.drawPath(bombspiral30_def)
const bombspiral30_sampler = geo.timeSampler(394,bombFreq)
const bombspiral30_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral30,bombspiral30_sampler,394.2,395.5)

const bombspiral30_cr = geo.placeBombs(bombspiral30_samples)
fn.createWithIndividualEffect(bombspiral30_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const wallspiraldrop15_def: ty.TimePointPatternDefinition = [
    [398.2,Math.PI-Math.PI*2/3,2.5,2.5,xoffset,yoffset],
    [398.85,Math.PI-Math.PI*2/3,4,2.5,xoffset,yoffset],
    [399.5,Math.PI-Math.PI*2/3,2.5,2.5,xoffset,yoffset]
]
const wallspiraldrop15 : ty.TimePointPattern = geo.drawPath(wallspiraldrop15_def,"easeInOutCirc")
const wallspiraldrop15_sampler = geo.timeSampler(398,bombFreq)
const wallspiraldrop15_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop15,wallspiraldrop15_sampler,398.2,399.5)

const wallspiraldrop15_cr = geo.placeWalls(wallspiraldrop15_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop15_cr(undefined as unknown as remapper.Wall)

const wallspiraldrop16_def: ty.TimePointPatternDefinition = [
    [398.2,-Math.PI/3,2.5,2.5,xoffset,yoffset],
    [398.85,-Math.PI/3,4,2.5,xoffset,yoffset],
    [399.5,-Math.PI/3,2.5,2.5,xoffset,yoffset],
]
const wallspiraldrop16 : ty.TimePointPattern = geo.drawPath(wallspiraldrop16_def,"easeInOutCirc")
const wallspiraldrop16_sampler = geo.timeSampler(398,bombFreq)
const wallspiraldrop16_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop16,wallspiraldrop16_sampler,398.2,399.5)

const wallspiraldrop16_cr = geo.placeWalls(wallspiraldrop16_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop16_cr(undefined as unknown as remapper.Wall)

const bombspiral31_def: ty.TimePointPatternDefinition = [
    [400.2,Math.PI,3,2,xoffset,yoffset],
    [401,Math.PI-Math.PI/4,3,2,xoffset,yoffset],
    [401.5,Math.PI-Math.PI/2,3,2,xoffset,yoffset]
]
const bombspiral31 : ty.TimePointPattern = geo.drawPath(bombspiral31_def)
const bombspiral31_sampler = geo.timeSampler(400,bombFreq)
const bombspiral31_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral31,bombspiral31_sampler,400.2,401.5)

const bombspiral31_cr = geo.placeBombs(bombspiral31_samples)
fn.createWithIndividualEffect(bombspiral31_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral32_def: ty.TimePointPatternDefinition = [
    [402.2,Math.PI+Math.PI+Math.PI/6,1.5,1.5,xoffset+1,yoffset-0.2],
    [403,Math.PI,1.5,0,xoffset+1,yoffset],
    [403.4,Math.PI-Math.PI/6,3,2,xoffset,yoffset]
]
const bombspiral32 : ty.TimePointPattern = geo.drawPath(bombspiral32_def)
const bombspiral32_sampler = geo.timeSampler(402,bombFreq)
const bombspiral32_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral32,bombspiral32_sampler,402.2,403.4)

const bombspiral32_cr = geo.placeBombs(bombspiral32_samples)
fn.createWithIndividualEffect(bombspiral32_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const wallspiraldrop17_def: ty.TimePointPatternDefinition = [
    [406.2,Math.PI-Math.PI*3/4,4,2.5,xoffset,yoffset],
    [407,Math.PI-Math.PI*5/4,4,2.5,xoffset,yoffset],
    [407.5,-Math.PI/2,4,2.5,xoffset,yoffset]
]
const wallspiraldrop17: ty.TimePointPattern = geo.drawPath(wallspiraldrop17_def)
const wallspiraldrop17_sampler = geo.timeSampler(406,bombFreq)
const wallspiraldrop17_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop17,wallspiraldrop17_sampler,406,407.5)

const wallspiraldrop17_cr = geo.placeWalls(wallspiraldrop17_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop17_cr(undefined as unknown as remapper.Wall)

const wallspiraldrop18_def: ty.TimePointPatternDefinition = [
    [406.2,-Math.PI/2,4,2.5,xoffset,yoffset],
    [407,Math.PI-Math.PI*5/4,4,2.5,xoffset,yoffset],
    [407.5,Math.PI-Math.PI*3/4,4,2.5,xoffset,yoffset],
]
const wallspiraldrop18 : ty.TimePointPattern = geo.drawPath(wallspiraldrop18_def)
const wallspiraldrop18_sampler = geo.timeSampler(406,bombFreq)
const wallspiraldrop18_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(wallspiraldrop18,wallspiraldrop18_sampler,406.2,407.5)

const wallspiraldrop18_cr = geo.placeWalls(wallspiraldrop18_samples,wallspiraldropDist,wallspiraldropSide)
wallspiraldrop18_cr(undefined as unknown as remapper.Wall)

const bombspiral33_def: ty.TimePointPatternDefinition = [
    [408.2,Math.PI-Math.PI/6,3,2,xoffset,yoffset],
    [409,Math.PI+Math.PI/2,3,2,xoffset,yoffset],
    [409.5,Math.PI*2-Math.PI/4,3,2,xoffset,yoffset]
]
const bombspiral33 : ty.TimePointPattern = geo.drawPath(bombspiral33_def)
const bombspiral33_sampler = geo.timeSampler(408,bombFreq)
const bombspiral33_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral33,bombspiral33_sampler,408.2,409.5)

const bombspiral33_cr = geo.placeBombs(bombspiral33_samples)
fn.createWithIndividualEffect(bombspiral33_cr,bomb_ef)(undefined as unknown as remapper.Bomb)

const bombspiral34_def: ty.TimePointPatternDefinition = [
    [410.7,Math.PI,3,2,xoffset,yoffset],
    [411,Math.PI*2/3,3,2,xoffset,yoffset],
    [411.4,Math.PI/3,3,2,xoffset,yoffset]
]
const bombspiral34 : ty.TimePointPattern = geo.drawPath(bombspiral34_def)
const bombspiral34_sampler = geo.timeSampler(410.5,bombFreq)
const bombspiral34_samples : ty.PointTimeSamples = geo.sampleTimePointPattern(bombspiral34,bombspiral34_sampler,410.7,411.4)

const bombspiral34_cr = geo.placeBombs(bombspiral34_samples)
fn.createWithIndividualEffect(bombspiral34_cr,bomb_ef)(undefined as unknown as remapper.Bomb)
*/




// Oscillation in slow parts of drop
if(ismodcharttech())
{
    const drop_oscillation_delay = 0.05
    const drop_oscillation_easing = "easeLinear"

    /*const oscillation_group_effect = function(angle: number)
    {
        return ef.setWorldRotation([0,angle,0])
    }*/

    const oscillationTrack = util.randomTrackName()
    const oscillationTrack_add = ef.addTrack(oscillationTrack)

    const oscillation_right: remapper.KeyframesVec3 = [[0,0,0,0],[0,90,0,2,"easeOutCirc"],[0,0,0,8,"easeInCirc"]]
    const oscillation_left: remapper.KeyframesVec3 = [[0,0,0,0],[0,-90,0,2,"easeOutCirc"],[0,0,0,8,"easeInCirc"]]
    const oscillation_up: remapper.KeyframesVec3 = [[0,0,0,0],[-90,0,0,2,"easeOutCirc"],[0,0,0,8,"easeInCirc"]]
    const oscillation_down: remapper.KeyframesVec3 = [[0,0,0,0],[90,0,0,2,"easeOutCirc"],[0,0,0,8,"easeInCirc"]]
    const oscillation_rightdown: remapper.KeyframesVec3 = [[0,0,0,0],[15,60,0,2,"easeOutCirc"],[0,0,0,8,"easeInCirc"]]
    const oscillation_leftrotate: remapper.KeyframesVec3 = [[0,0,0,0],[0,-90,-90,2,"easeOutCirc"],[0,0,0,8,"easeInCirc"]]
    const oscillation_left_finish: remapper.KeyframesVec3 = [[0,0,0,0],[0,-90,0,2,"easeOutCirc"],[0,0,0,8,"easeInOutQuad"]]
    const oscillation_up_right: remapper.KeyframesVec3 = [[0,0,0,0],[-90,90,0,2,"easeOutCirc"],[0,0,0,8,"easeInCirc"]]
    const oscillation_leftrotate_finish: remapper.KeyframesVec3 = [[0,0,0,0],[0,-90,-90,2,"easeOutCirc"],[0,0,0,8,"easeInOutQuad"]]


    /*const oscillation_right: remapper.KeyframesVec3 = [[0,0,0,0],[0,drop_oscillation_max,0,2,"easeInOutQuad"],[0,0,0,4,"easeInOutQuad"]]
    const oscillation_left: remapper.KeyframesVec3 = [[0,0,0,0],[0,-drop_oscillation_max,0,2,"easeInOutQuad"],[0,0,0,4,"easeInOutQuad"]]
    const oscillation_up: remapper.KeyframesVec3 = [[0,0,0,0],[-drop_oscillation_max,0,0,2,"easeInOutQuad"],[0,0,0,4,"easeInOutQuad"]]
    const oscillation_down: remapper.KeyframesVec3 = [[0,0,0,0],[drop_oscillation_max,0,0,2,"easeInOutQuad"],[0,0,0,4,"easeInOutQuad"]]
    */
    const oscillation_right_player_def = ef.animateRotationTrack(oscillation_right)
    const oscillation_right_object_def = ef.animateWorldRotationTrack(oscillation_right)
    const oscillation_left_player_def = ef.animateRotationTrack(oscillation_left)
    const oscillation_left_object_def = ef.animateWorldRotationTrack(oscillation_left)
    const oscillation_up_player_def = ef.animateRotationTrack(oscillation_up)
    const oscillation_up_object_def = ef.animateWorldRotationTrack(oscillation_up)
    const oscillation_down_player_def = ef.animateRotationTrack(oscillation_down)
    const oscillation_down_object_def = ef.animateWorldRotationTrack(oscillation_down)
    const oscillation_rightdown_player_def = ef.animateRotationTrack(oscillation_rightdown)
    const oscillation_rightdown_object_def = ef.animateWorldRotationTrack(oscillation_rightdown)
    const oscillation_leftrotate_player_def = ef.animateRotationTrack(oscillation_leftrotate)
    const oscillation_leftrotate_object_def = ef.animateWorldRotationTrack(oscillation_leftrotate)
    const oscillation_left_finish_player_def = ef.animateRotationTrack(oscillation_left_finish)
    const oscillation_left_finish_object_def = ef.animateWorldRotationTrack(oscillation_left_finish)
    const oscillation_up_right_player_def = ef.animateRotationTrack(oscillation_up_right)
    const oscillation_up_right_object_def = ef.animateWorldRotationTrack(oscillation_up_right)
    const oscillation_leftrotate_finish_player_def = ef.animateRotationTrack(oscillation_leftrotate_finish)
    const oscillation_leftrotate_finish_object_def = ef.animateWorldRotationTrack(oscillation_leftrotate_finish)




    ef.animateTrack(8,oscillation_right_player_def,drop_oscillation_easing)(160)(eff.playerTrack())
    ef.animateTrack(8,oscillation_right_object_def,drop_oscillation_easing)(160+drop_oscillation_delay)(oscillationTrack)

    const oscillation1_filter = fl.beatFilter(160,168,false,true)
    const oscillation1_notes = fn.filterObjects(allnotes,oscillation1_filter)
    const oscillation1_bombs = fn.filterObjects(allbombs,oscillation1_filter)
    const oscillation1_walls = fn.filterObjects(allwalls,oscillation1_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation1_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation1_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation1_walls)

    ef.animateTrack(8,oscillation_left_player_def)(168)(eff.playerTrack())
    ef.animateTrack(8,oscillation_left_object_def)(168+drop_oscillation_delay)(oscillationTrack)

    const oscillation2_filter = fl.beatFilter(168,176,true,true)
    const oscillation2_notes = fn.filterObjects(allnotes,oscillation2_filter)
    const oscillation2_bombs = fn.filterObjects(allbombs,oscillation2_filter)
    const oscillation2_walls = fn.filterObjects(allwalls,oscillation2_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation2_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation2_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation2_walls)

    ef.animateTrack(8,oscillation_right_player_def)(176)(eff.playerTrack())
    ef.animateTrack(8,oscillation_right_object_def)(176+drop_oscillation_delay)(oscillationTrack)

    const oscillation3_filter = fl.beatFilter(176,184,true,true)
    const oscillation3_notes = fn.filterObjects(allnotes,oscillation3_filter)
    const oscillation3_bombs = fn.filterObjects(allbombs,oscillation3_filter)
    const oscillation3_walls = fn.filterObjects(allwalls,oscillation3_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation3_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation3_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation3_walls)


    ef.animateTrack(8,oscillation_left_player_def)(184)(eff.playerTrack())
    ef.animateTrack(8,oscillation_left_object_def)(184+drop_oscillation_delay)(oscillationTrack)

    const oscillation4_filter = fl.beatFilter(184,192,true,true)
    const oscillation4_notes = fn.filterObjects(allnotes,oscillation4_filter)
    const oscillation4_bombs = fn.filterObjects(allbombs,oscillation4_filter)
    const oscillation4_walls = fn.filterObjects(allwalls,oscillation4_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation4_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation4_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation4_walls)


    ef.animateTrack(8,oscillation_up_player_def)(192)(eff.playerTrack())
    ef.animateTrack(8,oscillation_up_object_def)(192+drop_oscillation_delay)(oscillationTrack)

    const oscillation5_filter = fl.beatFilter(192,200,true,true)
    const oscillation5_notes = fn.filterObjects(allnotes,oscillation5_filter)
    const oscillation5_bombs = fn.filterObjects(allbombs,oscillation5_filter)
    const oscillation5_walls = fn.filterObjects(allwalls,oscillation5_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation5_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation5_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation5_walls)


    ef.animateTrack(8,oscillation_left_player_def)(200)(eff.playerTrack())
    ef.animateTrack(8,oscillation_left_object_def)(200+drop_oscillation_delay)(oscillationTrack)

    const oscillation6_filter = fl.beatFilter(200,208,true,true)
    const oscillation6_notes = fn.filterObjects(allnotes,oscillation6_filter)
    const oscillation6_bombs = fn.filterObjects(allbombs,oscillation6_filter)
    const oscillation6_walls = fn.filterObjects(allwalls,oscillation6_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation6_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation6_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation6_walls)


    ef.animateTrack(8,oscillation_leftrotate_player_def)(208)(eff.playerTrack())
    ef.animateTrack(8,oscillation_leftrotate_object_def)(208+drop_oscillation_delay)(oscillationTrack)

    const oscillation7_filter = fl.beatFilter(208,216,true,true)
    const oscillation7_notes = fn.filterObjects(allnotes,oscillation7_filter)
    const oscillation7_bombs = fn.filterObjects(allbombs,oscillation7_filter)
    const oscillation7_walls = fn.filterObjects(allwalls,oscillation7_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation7_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation7_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation7_walls)


    ef.animateTrack(8,oscillation_left_finish_player_def)(216)(eff.playerTrack())
    ef.animateTrack(8,oscillation_left_finish_object_def)(216+drop_oscillation_delay)(oscillationTrack)

    const oscillation8_filter = fl.beatFilter(216,224,true,true)
    const oscillation8_notes = fn.filterObjects(allnotes,oscillation8_filter)
    const oscillation8_bombs = fn.filterObjects(allbombs,oscillation8_filter)
    const oscillation8_walls = fn.filterObjects(allwalls,oscillation8_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation8_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation8_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation8_walls)

    // Second drop

    ef.animateTrack(8,oscillation_left_player_def)(352)(eff.playerTrack())
    ef.animateTrack(8,oscillation_left_object_def)(352+drop_oscillation_delay)(oscillationTrack)

    const oscillation9_filter = fl.beatFilter(352,360,true,true)
    const oscillation9_notes = fn.filterObjects(allnotes,oscillation9_filter)
    const oscillation9_bombs = fn.filterObjects(allbombs,oscillation9_filter)
    const oscillation9_walls = fn.filterObjects(allwalls,oscillation9_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation9_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation9_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation9_walls)

    ef.animateTrack(8,oscillation_up_right_player_def)(360)(eff.playerTrack())
    ef.animateTrack(8,oscillation_up_right_object_def)(360+drop_oscillation_delay)(oscillationTrack)

    const oscillation10_filter = fl.beatFilter(360,368,true,true)
    const oscillation10_notes = fn.filterObjects(allnotes,oscillation10_filter)
    const oscillation10_bombs = fn.filterObjects(allbombs,oscillation10_filter)
    const oscillation10_walls = fn.filterObjects(allwalls,oscillation10_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation10_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation10_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation10_walls)

    ef.animateTrack(8,oscillation_up_player_def)(368)(eff.playerTrack())
    ef.animateTrack(8,oscillation_up_object_def)(368+drop_oscillation_delay)(oscillationTrack)

    const oscillation11_filter = fl.beatFilter(368,376,true,true)
    const oscillation11_notes = fn.filterObjects(allnotes,oscillation11_filter)
    const oscillation11_bombs = fn.filterObjects(allbombs,oscillation11_filter)
    const oscillation11_walls = fn.filterObjects(allwalls,oscillation11_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation11_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation11_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation11_walls)

    ef.animateTrack(8,oscillation_right_player_def)(376)(eff.playerTrack())
    ef.animateTrack(8,oscillation_right_object_def)(376+drop_oscillation_delay)(oscillationTrack)

    const oscillation12_filter = fl.beatFilter(376,384,true,true)
    const oscillation12_notes = fn.filterObjects(allnotes,oscillation12_filter)
    const oscillation12_bombs = fn.filterObjects(allbombs,oscillation12_filter)
    const oscillation12_walls = fn.filterObjects(allwalls,oscillation12_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation12_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation12_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation12_walls)

    ef.animateTrack(8,oscillation_right_player_def)(384)(eff.playerTrack())
    ef.animateTrack(8,oscillation_right_object_def)(384+drop_oscillation_delay)(oscillationTrack)

    const oscillation13_filter = fl.beatFilter(384,392,true,true)
    const oscillation13_notes = fn.filterObjects(allnotes,oscillation13_filter)
    const oscillation13_bombs = fn.filterObjects(allbombs,oscillation13_filter)
    const oscillation13_walls = fn.filterObjects(allwalls,oscillation13_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation13_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation13_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation13_walls)

    ef.animateTrack(8,oscillation_up_player_def)(392)(eff.playerTrack())
    ef.animateTrack(8,oscillation_up_object_def)(392+drop_oscillation_delay)(oscillationTrack)

    const oscillation14_filter = fl.beatFilter(392,400,true,true)
    const oscillation14_notes = fn.filterObjects(allnotes,oscillation14_filter)
    const oscillation14_bombs = fn.filterObjects(allbombs,oscillation14_filter)
    const oscillation14_walls = fn.filterObjects(allwalls,oscillation14_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation14_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation14_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation14_walls)

    ef.animateTrack(8,oscillation_left_player_def)(400)(eff.playerTrack())
    ef.animateTrack(8,oscillation_left_object_def)(400+drop_oscillation_delay)(oscillationTrack)

    const oscillation15_filter = fl.beatFilter(400,408,true,true)
    const oscillation15_notes = fn.filterObjects(allnotes,oscillation15_filter)
    const oscillation15_bombs = fn.filterObjects(allbombs,oscillation15_filter)
    const oscillation15_walls = fn.filterObjects(allwalls,oscillation15_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation15_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation15_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation15_walls)

    ef.animateTrack(8,oscillation_leftrotate_finish_player_def)(408)(eff.playerTrack())
    ef.animateTrack(8,oscillation_leftrotate_finish_object_def)(408+drop_oscillation_delay)(oscillationTrack)

    const oscillation16_filter = fl.beatFilter(408,416,true,true)
    const oscillation16_notes = fn.filterObjects(allnotes,oscillation16_filter)
    const oscillation16_bombs = fn.filterObjects(allbombs,oscillation16_filter)
    const oscillation16_walls = fn.filterObjects(allwalls,oscillation16_filter)
    fn.mapEffect(oscillationTrack_add)(oscillation16_notes)
    fn.mapEffect(oscillationTrack_add)(oscillation16_bombs)
    fn.mapEffect(oscillationTrack_add)(oscillation16_walls)
}
else
{

}

// Reselect stuff
allnotes = fn.selectAllNotes()
allbombs = fn.selectAllBombs()

// Disable wrong colour badcuts on all notes!
const nowrongcolor: ty.Effect<remapper.Note> = ef.disableBadCutSaberType()
fn.mapEffect(nowrongcolor)(allnotes)

// Make uninteractable after player for all bombs!
const uninteractable: ty.Effect<remapper.Bomb> = eff.uninteractableAfterPlayer()
fn.mapEffect(uninteractable)(allbombs)

map.save();
