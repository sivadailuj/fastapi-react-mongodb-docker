from typing import Annotated, Optional
from uuid import UUID, uuid4

from ..schemas import Address
from beanie import Document, Indexed
from pydantic import EmailStr, Field
import datetime


class Client(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    company: str
    category: str
    address: Address
    mobile: str
    email: EmailStr
    fax: Annotated[Optional[str], Field(default=None)]
    extension: Annotated[Optional[str], Field(default=None)]
    web_page: Annotated[Optional[str], Field(default=None)]
    notes: Annotated[Optional[str], Field(default=None)]
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.now)

    class Settings:
        name = "clients"
