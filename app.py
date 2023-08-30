import os
import speech_recognition as sr
from pydub import AudioSegment
import pyaudio
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start-recording')
def start_recording():
    recognizer = sr.Recognizer()
    
    try:
        with sr.Microphone() as source:
            print("Say something...")
            audio = recognizer.listen(source)
        
        text = recognizer.recognize_google(audio)
        print("You said:", text)
        return jsonify({"text": text})
    except sr.UnknownValueError:
        print("Sorry, I could not understand what you said.")
        return jsonify({"text": "Unknown value error"})
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
        return jsonify({"text": "Request error"})

@app.route('/upload-and-convert', methods=['POST'])
def upload_and_convert():
    try:
        uploaded_file = request.files['file']
        
        # Handle file conversion, transcription, and task generation here
        file_extension = os.path.splitext(uploaded_file.filename)[1]
        
        if file_extension.lower() in ('.mp3', '.mp4', '.wav', '.flac', '.ogg', '.webm'):
            audio = AudioSegment.from_file(uploaded_file)
            recognizer = sr.Recognizer()
            transcribed_text = recognizer.recognize_google(audio)
            
            return jsonify({"transcribed_text": transcribed_text})
            
        else:
            return jsonify({"error": "Unsupported file format"})
    except sr.UnknownValueError:
        return jsonify({"error": "Sorry, could not transcribe audio"})
    except sr.RequestError as e:
        return jsonify({"error": f"Could not request results; {e}"})
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)