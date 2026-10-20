# Tash cloud video workspace
Remotion runs in GitHub Actions; no desktop installation is required.
The initial push runs TypeScript checking and renders a two-second setup slate.
This slate is an installation test, not the edited video.

## Source intake
Open Actions → Remotion cloud → Run workflow.
Set a direct HTTPS video URL, or store it as repository Actions secret SOURCE_VIDEO_URL.
The runner downloads it into temporary storage, never commits it.
The repository is public: workflow artifacts and any manually committed media should be treated as public. Do not use confidential footage here; use a private repository for that.

A supplied source renders a framing/audio preview preserving its aspect ratio.
This does not auto-create an editorial edit. Illustrations, cut choices, music and motion graphics need content review.
Optional captions.json contains word timestamps in seconds:
[{"text":"Example","start":0.2,"end":0.6}]
Do not invent captions before transcription.
Download the ZIP named remotion-output from the completed workflow run.
Artifacts expire after three days.
