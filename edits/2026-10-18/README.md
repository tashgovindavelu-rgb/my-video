# Cinematic short-form edit — 18 October 2026

This repository tracks the edit recipe for the uploaded 26.28-second vertical ComfyUI talking-head video.

## Editorial decisions
- Keep full source voiceover and full 26.28-second duration.
- Full-screen illustrated cards at 4.4–7.4s, 11.5–14.5s, 19.1–22.1s to conceal exaggerated facial expressions.
- Subtle purple and lime palette, bold graphic hierarchy and restrained lower thirds during talking-head portions.
- Original synthesized ambient chords and soft percussion, ducked under source dialogue.
- Export H.264 MP4, AAC, 480x832, 25 fps with faststart.

## Reproduce locally
Place original source at `source.mp4`, illustrated PNG overlays named `lower.png`, `card1.png`, `card2.png`, `card3.png`, and a rights-cleared instrumental `music.wav` in this directory. Then run:

```bash
ffmpeg -i source.mp4 -loop 1 -framerate 25 -i lower.png -loop 1 -framerate 25 -i card1.png -loop 1 -framerate 25 -i card2.png -loop 1 -framerate 25 -i card3.png -i music.wav \
-filter_complex "[0:v]eq=contrast=1.045:saturation=1.11[base];[base][1:v]overlay=0:0:enable='between(t,0.5,3.9)+between(t,8.3,11.4)+between(t,16.1,18.9)+between(t,23.4,26.1)'[v1];[v1][2:v]overlay=0:0:enable='between(t,4.4,7.4)'[v2];[v2][3:v]overlay=0:0:enable='between(t,11.5,14.5)'[v3];[v3][4:v]overlay=0:0:enable='between(t,19.1,22.1)'[vout];[0:a]highpass=f=80,lowpass=f=11500,volume=1.15[voice];[5:a]volume=0.37,afade=t=in:st=0:d=1,afade=t=out:st=24.5:d=1.7[bed];[voice][bed]amix=inputs=2:duration=first:dropout_transition=0[aout]" \
-map "[vout]" -map "[aout]" -c:v libx264 -preset veryfast -crf 19 -pix_fmt yuv420p -c:a aac -b:a 160k -t 26.28 -movflags +faststart edited.mp4
```

## Notes
Source video and audio are not committed to this public repository. The downloadable finished export is available in the ChatGPT conversation. Graphics are editorial placeholders based on abstract concepts, not verified word-by-word transcription.
