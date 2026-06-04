from pydantic import BaseModel, Field
from typing import Optional


class Address(BaseModel):
    street: Optional[str] = Field(None, example="123 Main St")
    city: Optional[str] = Field(None, example="Anytown")
    state: Optional[str] = Field(None, example="FL")
    zip_code: Optional[str] = Field(None, example="12345")
    country: Optional[str] = Field("US", example="US")
