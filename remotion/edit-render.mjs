import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import {readFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
mkdirSync('out',{recursive:true});
const inputProps=JSON.parse(readFileSync('edit-props.json','utf8'));
const serveUrl=await bundle({entryPoint:path.resolve('src/edit.tsx'),publicDir:path.resolve('public')});
const composition=await selectComposition({serveUrl,id:'TashVideo',inputProps});
await renderMedia({composition,serveUrl,codec:'h264',crf:18,outputLocation:'out/picture.mp4',inputProps,concurrency:2});
execFileSync('ffmpeg',['-v','error','-y','-i','out/picture.mp4','-i','public/sound-bed.wav','-filter_complex','[0:a]highpass=f=70,loudnorm=I=-16:TP=-2:LRA=8[voice];[voice][1:a]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.94[a]','-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart','out/Tash-Seedmediaa-Full-Edit.mp4'],{stdio:'inherit'});
for(const [i,t] of [1,7.9,10,13.3,16.8,20.9].entries()){
 await renderStill({serveUrl,composition,inputProps,frame:Math.min(composition.durationInFrames-1,Math.round(t*30)),output:'out/frame-'+i+'.png'});
}
console.log('EDIT_RENDERED',composition.durationInFrames,'frames');
