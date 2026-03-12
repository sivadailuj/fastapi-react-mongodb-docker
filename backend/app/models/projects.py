from typing import Annotated
from uuid import UUID, uuid4

from ..schemas import Address
from beanie import Document, Indexed
from pydantic import Field
import datetime


class Project(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    name: str
    client_uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed()]
    category: str
    address: Address
    sow: str
    type: str
    construction_type: str
    models: str
    phase_volleys: str
    stories: str
    units: str
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.now)

    class Settings:
        name = "projects"
