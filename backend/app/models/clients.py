from typing import Annotated, Optional
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import EmailStr, Field
import pymongo
import datetime

from ..schemas import Address


class Client(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    company: str | None = None
    category: str | None = None
    address: Address | None = None
    mobile: str | None = None
    email: EmailStr
    fax: Annotated[Optional[str], Field(default=None)]
    extension: Annotated[Optional[str], Field(default=None)]
    web_page: Annotated[Optional[str], Field(default=None)]
    notes: Annotated[Optional[str], Field(default=None)]
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.now)

    class Settings:
        name = "clients"
