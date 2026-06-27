import os
import requests

MODEL_SERVICE_URL = os.getenv("MODEL_SERVICE_URL")

# Lazy load local model only if needed (saves memory in production)
model = None
IMG_SIZE = 224  
class_labels = ["Electricity", "Road", "Sanitation", "Water"]

def load_local_model():
    global model
    if model is None:
        import tensorflow as tf
        BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'saved_models')
        model = tf.keras.models.load_model(
            os.path.join(BASE_DIR, 'CBAM_Model_olddatafinal.keras'),
            compile=False
        )

def predict_image(img_path):
    if MODEL_SERVICE_URL:
        try:
            url = f"{MODEL_SERVICE_URL.rstrip('/')}/predict_image"
            with open(img_path, "rb") as f:
                response = requests.post(url, files={"file": f}, timeout=15)
            if response.status_code == 200:
                res_data = response.json()
                return res_data["category"], res_data["confidence"]
        except Exception as e:
            print(f"⚠️ API prediction failed, attempting local fallback: {e}")

    # Fallback to local prediction
    load_local_model()
    import tensorflow as tf
    from tensorflow.keras.preprocessing import image
    import numpy as np
    
    img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    preds = model.predict(img_array, verbose=0)
    pred_class = np.argmax(preds)
    confidence = preds[0][pred_class]
    predicted_label = class_labels[pred_class]
    return predicted_label, float(confidence)

