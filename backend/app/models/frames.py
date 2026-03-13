from typing import Annotated
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import Field
import datetime

from ..schemas.frames import FrameStatus


class Frame(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    client_uuid: UUID
    project_uuid: UUID
    package_uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed()]
    ppo_id: str
    name: str
    type: str
    nwt: float
    assembly_file: str
    machine: str
    status: Annotated[FrameStatus, Field(default=FrameStatus.QUEUED), Indexed()]
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.now)

    class Settings:
        name = "frames"
