import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
import {mkdirSync,existsSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
mkdirSync('out',{recursive:true});
const source=existsSync('public/source.mp4')?'source.mp4':'';
let props={source,duration:60,width:1080,height:1920,words:[]};
if(source){
 const metadata=JSON.parse(execFileSync('ffprobe',['-v','quiet','-print_format','json','-show_format','-show_streams','public/source.mp4'],{encoding:'utf8'}));
 const stream=metadata.streams.find(s=>s.codec_type==='video');
 if(!stream)throw Error('No video stream in source');
 const seconds=Number(metadata.format.duration);
 if(!Number.isFinite(seconds)||seconds<=0)throw Error('Invalid source duration');
 const rotation=Number(stream.tags?.rotate??stream.side_data_list?.find(x=>x.rotation!==undefined)?.rotation??0);
 const swap=Math.abs(rotation)%180===90;
 props={...props,duration:Math.ceil(seconds*30),width:Math.round((swap?stream.height:stream.width)/2)*2,height:Math.round((swap?stream.width:stream.height)/2)*2};
 if(existsSync('captions.json'))props.words=JSON.parse(readFileSync('captions.json','utf8'));
}
const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx'),publicDir:path.resolve('public')});
const composition=await selectComposition({serveUrl,id:'TashVideo',inputProps:props});
await renderMedia({composition,serveUrl,codec:'h264',outputLocation:source?'out/source-preview.mp4':'out/setup-test.mp4',inputProps:props,concurrency:2});
console.log(source?'Source preview rendered. Editorial graphics and captions need a transcript.':'Setup test rendered; no source footage was edited.');
