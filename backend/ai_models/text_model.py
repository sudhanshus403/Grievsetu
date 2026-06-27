import re
import os
import requests

MODEL_SERVICE_URL = os.getenv("MODEL_SERVICE_URL")

# Lazy load local model only if needed (saves memory in production)
bilstm = None
tokenizer = None
label_encoder = None

def load_local_model():
    global bilstm, tokenizer, label_encoder
    if bilstm is None:
        from tensorflow.keras.models import load_model
        import pickle
        BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'saved_models')
        bilstm = load_model(os.path.join(BASE_DIR, 'bilstm_model.keras'))
        with open(os.path.join(BASE_DIR, 'tokenizer.pkl'), 'rb') as f:
            tokenizer = pickle.load(f)
        with open(os.path.join(BASE_DIR, 'label_encoder.pkl'), 'rb') as f:
            label_encoder = pickle.load(f)

def text_model(text):
    cleaned_text = re.sub(r'^\[.*?\]\s*', '', text)
    
    if MODEL_SERVICE_URL:
        try:
            url = f"{MODEL_SERVICE_URL.rstrip('/')}/predict_text"
            response = requests.post(url, json={"text": cleaned_text}, timeout=10)
            if response.status_code == 200:
                res_data = response.json()
                return res_data["category"], res_data["confidence"]
        except Exception as e:
            print(f"⚠️ API prediction failed, attempting local fallback: {e}")
            
    # Fallback to local prediction
    load_local_model()
    from tensorflow.keras.preprocessing.sequence import pad_sequences
    seq = tokenizer.texts_to_sequences([cleaned_text])
    padded_seq = pad_sequences(seq, maxlen=100)
    prediction = bilstm.predict(padded_seq)
    prediction_class = prediction.argmax(axis=1)
    category = label_encoder.inverse_transform([prediction_class[0]])
    confidence = prediction[0][prediction_class[0]]
    return category[0], float(confidence)




