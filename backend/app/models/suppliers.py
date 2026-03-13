from typing import Annotated
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import EmailStr, Field
import datetime

from ..schemas import Address


class Supplier(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    company: str
    contact_person: str
    short_name: str
    address: Address
    email: EmailStr
    mobile: str
    office: str
    position: str
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.now)

    class Settings:
        name = "suppliers"
