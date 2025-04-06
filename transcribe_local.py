from faster_whisper import WhisperModel
import sys

# Load audio file path from CLI args
audio_path = sys.argv[1]

# Initialize model (can be moved to faster models like 'base' or 'tiny')
model = WhisperModel("base", compute_type="auto")

# Transcribe
segments, _ = model.transcribe(audio_path)

# Combine transcribed segments
transcription = " ".join(segment.text for segment in segments)

# Print to stdout for NestJS to capture
print(transcription)
