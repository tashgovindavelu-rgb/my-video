import json,subprocess,wave,math,random,struct,os
os.makedirs('public',exist_ok=True)
cuts=[(0,2.78),(3.22,7.64),(7.92,10.28),(10.55,12.32),(12.64,14.06),(14.38,20.36),(20.66,24.35)]
def mapped(t):
    offset=0
    for a,b in cuts:
        if a<=t<=b:return offset+t-a
        if t<a:return offset
        offset+=b-a
    return offset
filters=[]
for i,(a,b) in enumerate(cuts):
    filters += [f'[0:v]trim=start={a}:end={b},setpts=PTS-STARTPTS,fps=30,scale=720:1248:flags=lanczos,setsar=1[v{i}]',f'[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={b-a-.008}:d=0.008[a{i}]']
filters.append(''.join(f'[v{i}][a{i}]' for i in range(len(cuts)))+f'concat=n={len(cuts)}:v=1:a=1[v][a]')
subprocess.run(['ffmpeg','-v','error','-y','-i','public/source.mp4','-filter_complex',';'.join(filters),'-map','[v]','-map','[a]','-c:v','libx264','-crf','17','-preset','fast','-c:a','aac','-b:a','192k','public/edited-source.mp4'],check=True)
raw=json.load(open('captions.json'))
words=[dict(text=w['text'],start=round(mapped(w['start']),3),end=round(mapped(w['end']),3)) for w in raw if w['text'] and any(a<=w['start']<b for a,b in cuts)]
cues=[]
for start,end,kind,title,subtitle in [
(.3,2.7,'timer','',''),
(8.4,10.25,'bad','OUTDATED?\\nCONFUSING?','Visitors leave before they call.'),
(10.7,12.28,'competitor','',''),
(14.5,16.85,'name','',''),
(17.5,19.9,'good','BUILT TO WIN.','Make the first impression count.'),
(20.8,24.35,'cta','','')]:
    cues.append(dict(start=mapped(start),end=mapped(end),kind=kind,title=title,subtitle=subtitle))
duration=sum(b-a for a,b in cuts)
props=dict(source='edited-source.mp4',duration=round(duration*30),width=720,height=1248,words=words,cues=cues)
json.dump(props,open('edit-props.json','w'))
json.dump({'source_seconds':26.28,'edited_seconds':duration,'cuts':cuts,'cues':cues},open('out/edit-notes.json','w'),indent=2)
# Original, quiet instrumental pulse with short cues. No sampled copyrighted music.
rate=24000;n=int((duration+.1)*rate);audio=[0.0]*n;random.seed(7)
def tone(at,length,freq,amp):
    p=int(at*rate); count=int(length*rate)
    for j in range(count):
        k=p+j
        if k>=n:break
        t=j/rate; envelope=min(1,t/.02)*math.exp(-t*4/max(.1,length))
        audio[k]+=amp*envelope*(math.sin(2*math.pi*freq*t)+.18*math.sin(4*math.pi*freq*t))
notes=[130.81,196,261.63,311.13,130.81,196,233.08,261.63]
for step in range(int(duration/.4)):
    tone(step*.4,.55,notes[step%8],.009)
    if step%4==0:tone(step*.4,.7,65.41,.009)
for c in cues:
    at=c['start']
    if c['kind']=='timer':
        for j in range(3):tone(at+j*.65,.08,900,.045)
    elif c['kind']=='cta':
        tone(at,.4,523.25,.035);tone(at+.09,.5,659.25,.025)
    elif c['kind']=='competitor':
        tone(at,.18,110,.05)
    else:
        p=int(max(0,at-.07)*rate); count=int(.22*rate)
        for j in range(count):
            if p+j<n:audio[p+j]+=(random.random()*2-1)*.022*math.sin(math.pi*j/count)**2
with wave.open('public/sound-bed.wav','wb') as w:
    w.setparams((1,2,rate,0,'NONE','not compressed'))
    for i,x in enumerate(audio):
        fade=min(1,i/(rate*.4),max(0,(n-i)/(rate*.6)))
        w.writeframesraw(struct.pack('<h',int(max(-1,min(1,x*fade))*32767)))
print('EDIT_READY',duration,len(words),'words',len(cues),'graphics')
