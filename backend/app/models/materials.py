from typing import Annotated
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import Field
import datetime

from ..schemas.materials import MaterialStatus


class Material(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    client_uuid: UUID
    project_uuid: UUID
    order_uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed()]
    manufacturing_uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed()]
    ppo_id: str
    machine: str
    required_nwt: float
    available_nwt: float
    status: Annotated[MaterialStatus, Field(default=MaterialStatus.QUEUED), Indexed()]
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.now)

    class Settings:
        name = "materials"
