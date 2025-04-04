import sys
from faster_whisper import WhisperModel

# Path to audio file
audio_path = sys.argv[1]

# Load model (change "tiny" to "base", "medium", "large" if you want better quality)
model = WhisperModel("tiny", compute_type="int8")

segments, info = model.transcribe(audio_path)

full_text = ""
for segment in segments:
    full_text += segment.text + " "

print(full_text.strip())
