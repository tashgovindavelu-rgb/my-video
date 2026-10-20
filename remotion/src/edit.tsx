import React from 'react';
import {AbsoluteFill,Composition,OffthreadVideo,registerRoot,staticFile,useCurrentFrame,interpolate,spring,useVideoConfig} from 'remotion';
type Word={text:string;start:number;end:number};
type Cue={start:number;end:number;kind:string;title:string;subtitle:string};
type Props={source:string;duration:number;width:number;height:number;words:Word[];cues:Cue[]};
const lime='#c6ff45',ink='#101112';
const Browser:React.FC<{bad?:boolean;progress:number}>=({bad,progress})=><div style={{background:bad?'#27292b':'#f5f5ee',borderRadius:24,overflow:'hidden',width:800,height:340,boxShadow:'0 30px 80px #0008',transform:'rotate('+ (bad?-3:2)+'deg)'}}>
 <div style={{height:42,background:bad?'#3b3d40':'#dbddd3',display:'flex',gap:10,alignItems:'center',paddingLeft:22}}>{[0,1,2].map(i=><div key={i} style={{width:10,height:10,borderRadius:10,background:bad?'#ff736d':'#a1a796'}}/>)}</div>
 <div style={{display:'flex',padding:34,gap:26}}>
 <div style={{flex:1}}><div style={{height:18,width:'70%',background:bad?'#808080':'#1e2220',marginBottom:20}}/>
 {[0,1,2].map(i=><div key={i} style={{height:10,width:bad?(85-i*10)+'%':'85%',background:bad?'#535456':'#b0b4a9',marginBottom:14}}/>)}
 <div style={{marginTop:22,background:bad?'#ff736d':lime,width:200,height:48,borderRadius:bad?0:12}}/></div>
 <div style={{width:240,height:200,background:bad?'#545358':'#152a20',borderRadius:bad?0:20,display:'flex',alignItems:'center',justifyContent:'center'}}>
 <svg width="190" height="150" viewBox="0 0 190 150"><path d={bad?'M10 40 L55 90 L95 65 L145 130 L180 138':'M10 130 L55 104 L95 110 L145 48 L180 18'} fill="none" stroke={bad?'#ff736d':lime} strokeWidth="10" strokeLinecap="round" strokeDasharray="300" strokeDashoffset={300*(1-progress)}/></svg>
 </div></div></div>;
const Graphic:React.FC<{cue:Cue}>=({cue})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();const local=f-cue.start*fps;
 const p=spring({frame:local,fps,config:{damping:17,stiffness:150}});
 const alpha=interpolate(f,[cue.start*fps,cue.start*fps+6,cue.end*fps-5,cue.end*fps],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const full=cue.kind==='bad'||cue.kind==='competitor'||cue.kind==='good';
 return <AbsoluteFill style={{opacity:alpha,background:full?'rgba(10,12,11,.98)':'transparent',justifyContent:'center',alignItems:'center'}}>
 <div style={{position:'absolute',top:full?490:1020,width:940,textAlign:'center',transform:'translateY('+(1-p)*55+'px) scale('+(0.93+p*.07)+')'}}>
 {cue.kind==='timer'?<><div style={{display:'inline-flex',alignItems:'center',gap:30,padding:'20px 42px',background:ink+'ed',border:'2px solid '+lime,borderRadius:28}}><span style={{fontSize:142,fontWeight:900,color:lime,lineHeight:1}}>3</span><div style={{textAlign:'left',fontSize:38,fontWeight:800}}>SECONDS<br/><span style={{fontSize:25,color:'#b2b6ac'}}>TO EARN TRUST</span></div></div><div style={{height:7,background:lime,width:500*(1-Math.min(1,local/68)),margin:'18px auto'}}/></>:
 cue.kind==='bad'||cue.kind==='good'?<><div style={{fontSize:23,letterSpacing:7,color:lime,marginBottom:35}}>FIRST IMPRESSIONS</div><div style={{fontWeight:900,fontSize:74,lineHeight:1.05,marginBottom:55}}>{cue.title}</div><div style={{display:'flex',justifyContent:'center'}}><Browser bad={cue.kind==='bad'} progress={Math.min(1,local/20)}/></div><div style={{fontSize:32,marginTop:50,color:cue.kind==='bad'?'#ff8c85':lime}}>{cue.subtitle}</div></>:
 cue.kind==='competitor'?<><div style={{fontSize:70,fontWeight:900,marginBottom:60}}>ONE CLICK.<br/><span style={{color:'#ff8c85'}}>LOST CUSTOMER.</span></div><div style={{display:'flex',gap:20,alignItems:'center',justifyContent:'center'}}><div style={{padding:35,border:'2px solid #656565',borderRadius:25,fontSize:35,color:'#aaa'}}>YOUR SITE</div><span style={{color:lime,fontSize:80}}>→</span><div style={{padding:35,background:lime,borderRadius:25,fontSize:35,fontWeight:900,color:ink}}>COMPETITOR</div></div></>:
 cue.kind==='name'?<div style={{textAlign:'left',display:'inline-block',padding:'25px 40px',background:'#111e',borderLeft:'8px solid '+lime,borderRadius:15}}><div style={{fontSize:47,fontWeight:900}}>TASH</div><div style={{fontSize:27,color:lime,marginTop:8}}>CO-FOUNDER · SEEDMEDIAA</div></div>:
 <div style={{background:ink+'ef',padding:'30px 45px',borderRadius:28,border:'2px solid '+lime}}><div style={{fontSize:24,letterSpacing:4,color:'#ddd'}}>COMMENT BELOW</div><div style={{fontSize:85,fontWeight:900,color:lime,margin:'12px 0'}}>“WEBSITE”</div><div style={{fontSize:29}}>LET’S BOOK YOUR WEBSITE AUDIT</div></div>}
 </div></AbsoluteFill>;
};
const Video:React.FC<Props>=({source,words,cues})=>{
 const f=useCurrentFrame(),{width,height}=useVideoConfig(),t=f/30,scale=width/1080,H=height/scale;
 const current=words.findIndex(w=>t>=w.start-.025&&t<w.end+.045);
 const base=current<0?-1:Math.floor(current/3)*3,group=base<0?[]:words.slice(base,base+3);
 const start=group[0]?.start??0;const pop=spring({frame:Math.max(0,f-start*30),fps:30,config:{damping:19,stiffness:260}});
 const zoom=1+.025*Math.sin(Math.PI*(f%150)/150)**2;
 return <AbsoluteFill style={{background:ink,color:'white'}}>
 {source?<OffthreadVideo src={staticFile(source)} style={{width:'100%',height:'100%',objectFit:'contain',transform:'scale('+zoom+')',filter:'contrast(1.035) saturate(1.03)'}}/>:null}
 <div style={{position:'absolute',width:1080,height:H,transform:'scale('+scale+')',transformOrigin:'top left',fontFamily:'Arial, sans-serif'}}>
 <AbsoluteFill style={{background:'linear-gradient(0deg,rgba(0,0,0,.66),transparent 39%)'}}/>
 {cues.filter(c=>t>=c.start&&t<c.end).map((c,i)=><Graphic cue={c} key={i}/>)}
 {group.length>0&&<div style={{position:'absolute',left:60,right:60,top:H-370,textAlign:'center',fontSize:64,fontWeight:900,lineHeight:1.16,transform:'scale('+(0.94+pop*.06)+')',textShadow:'0 4px 4px #000,0 0 20px #000',WebkitTextStroke:'1px rgba(0,0,0,.3)'}}>
 {group.map((w,i)=><span key={i} style={{color:base+i===current?lime:'white',display:'inline-block',margin:'0 9px'}}>{w.text.toUpperCase()}</span>)}
 </div>}
 <div style={{position:'absolute',left:65,top:55,fontSize:23,fontWeight:800,letterSpacing:5,color:'#ffffffc0'}}>SEEDMEDIAA<span style={{color:lime}}> /</span></div>
 <div style={{position:'absolute',left:0,bottom:0,width:(f/Math.max(1,words.at(-1)?.end??24)/30)*1080,height:5,background:lime}}/>
 </div>
 </AbsoluteFill>;
};
const Root:React.FC=()=> <Composition id="TashVideo" component={Video} fps={30} width={720} height={1248} durationInFrames={60}
 defaultProps={{source:'',duration:60,width:720,height:1248,words:[] as Word[],cues:[] as Cue[]}}
 calculateMetadata={({props})=>({durationInFrames:props.duration,width:props.width,height:props.height})}/>;
registerRoot(Root);
