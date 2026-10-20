import React from 'react';
import {registerRoot,Composition,AbsoluteFill,OffthreadVideo,staticFile,useCurrentFrame,interpolate} from 'remotion';
type Word = {text:string;start:number;end:number};
type Props = {source:string;duration:number;width:number;height:number;words:Word[]};
const Video:React.FC<Props> = ({source,words})=>{
 const f=useCurrentFrame(),t=f/30;
 const current=words.findIndex(w=>t>=w.start&&t<w.end);
 const group=current<0?[]:words.slice(Math.floor(current/3)*3,Math.floor(current/3)*3+3);
 return <AbsoluteFill style={{background:'#111',fontFamily:'Arial, sans-serif'}}>
 {source?<OffthreadVideo src={staticFile(source)} style={{width:'100%',height:'100%',objectFit:'contain'}}/>:
 <AbsoluteFill style={{justifyContent:'center',alignItems:'center',color:'white',fontSize:68,fontWeight:900}}>
 <div style={{opacity:interpolate(f,[0,12],[0,1],{extrapolateRight:'clamp'})}}>REMOTION READY</div>
 <div style={{fontSize:24,color:'#c6ff45',marginTop:20}}>Cloud setup test · footage not loaded</div>
 </AbsoluteFill>}
 {group.length>0&&<div style={{position:'absolute',bottom:'16%',width:'86%',left:'7%',textAlign:'center',fontSize:Math.round(0.052*Math.min(1080,1080)),fontWeight:900,lineHeight:1.18,textShadow:'0 3px 9px black',color:'white'}}>
 {group.map((w,i)=><span key={i} style={{color:t>=w.start&&t<w.end?'#c6ff45':'white',display:'inline-block',margin:'0 7px'}}>{w.text}</span>)}
 </div>}
 </AbsoluteFill>;
};
const Root:React.FC=()=> <Composition id="TashVideo" component={Video} fps={30} width={1080} height={1920} durationInFrames={60}
 defaultProps={{source:'',duration:60,width:1080,height:1920,words:[] as Word[]}}
 calculateMetadata={({props})=>({durationInFrames:props.duration,width:props.width,height:props.height})}/>;
registerRoot(Root);
