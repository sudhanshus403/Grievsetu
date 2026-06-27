from ai_models.text_model import text_model
from services.routing import route_grievance
from services.priority import assign_priority
from services.sla import assign_sla
from ai_models.image_model import predict_image
from database.database import SessionLocal
from models.grievance import Grievance
import random

#NORMALIZE MAP 
NORMALIZE_MAP = {
    "water": "Water Supply",
    "water supply": "Water Supply",
    "road": "Roads & Infrastructure",
    "road & infra": "Roads & Infrastructure",
    "roads": "Roads & Infrastructure",
    "roads & infrastructure": "Roads & Infrastructure",
    "sanitation": "Sanitation",
    "electricity": "Electricity"
}


def process_grievance(text="",img_path="", user_id = None, address = ""):
    category, text_confidence = text_model(text) if text else (None, 0)
    predicted_label, image_confidence = predict_image(img_path) if img_path else (None, 0)

    text_confidence = float(text_confidence)
    image_confidence = float(image_confidence)

    norm_text = NORMALIZE_MAP.get(category.lower().strip(), category.strip()) if category else None
    norm_image = NORMALIZE_MAP.get(predicted_label.lower().strip(), predicted_label.strip()) if predicted_label else None
    
    print("RAW:", category, predicted_label)
    print("NORMALIZED:", norm_text, norm_image)

    CONF_THRESHOLD = 0.8
    conflict = False
    if norm_text and norm_image:
        if norm_text != norm_image:
            if text_confidence > CONF_THRESHOLD and image_confidence > CONF_THRESHOLD:
                conflict = True
                print(f"⚠️ CONFLICT: Text={norm_text}({text_confidence:.2%}) vs Image={norm_image}({image_confidence:.2%}) — flagging for manual review")
    print(f"Text confidence: {text_confidence}, Image confidence: {image_confidence}")

    # Use the model with the HIGHEST raw confidence score
    if text_confidence >= image_confidence:
        final_category = category
        confidence = text_confidence
        print(f"→ Using TEXT model prediction: {category} ({text_confidence:.2%})")
    else:
        final_category = predicted_label
        confidence = image_confidence
        print(f"→ Using IMAGE model prediction: {predicted_label} ({image_confidence:.2%})")

    department = route_grievance(final_category)
    priority = assign_priority(text)
    sla = assign_sla(priority)

    db = SessionLocal()

    while True:
        new_id = random.randint(10000, 99999)
        if not db.query(Grievance).filter(Grievance.id == new_id).first():
            break

    new_grievance = Grievance(
        id = new_id,
        user_id = user_id,
        text = text,
        category = final_category,
        status = "needs_review" if conflict else "pending",
        priority = priority,
        department = department,
        image_path = img_path,
        confidence_score = round(float(confidence), 4),
        address = address,
    )

    db.add(new_grievance)
    db.commit()
    db.refresh(new_grievance) # to get the id of the new grievance

    response = {
        "grievance_id": new_grievance.id,
        "input_text": text,
        "input_image": img_path,
        "predicted_category": final_category,
        "confidence": round(float(confidence), 2),
        "assigned_department": department,
        "priority": priority,
        "sla": sla
    }

    if conflict:
        response["conflict"] = True
        response["text_prediction"] = {"category": norm_text, "confidence": round(text_confidence, 2)}
        response["image_prediction"] = {"category": norm_image, "confidence": round(image_confidence, 2)}

    return response


