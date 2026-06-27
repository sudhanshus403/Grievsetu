from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str
    
    @field_validator("confirm_password")
    def passwords_match(cls, confirm_password, info):
        if "password" in info.data and confirm_password != info.data["password"]:
            raise ValueError("Passwords do not match")
        return confirm_password

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GrievanceRequest(BaseModel):
    text: str = ""
    img_path: str = ""
    user_id: str
    address: str = ""

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class NotificationCreate(BaseModel):
    user_id: str
    title: str
    description: str
    type: str = "info"

class SupportRequest(BaseModel):
    name: str
    email: str
    phone: str
    issue: str

class DeleteAccountRequest(BaseModel):
    password: str
