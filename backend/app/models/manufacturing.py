from typing import Annotated
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import Field
import datetime

from ..schemas.manufacturing import ManufacturingStatus


class Manufacturing(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    client_uuid: UUID
    project_uuid: UUID
    ppo_id: str
    job_no: str
    rfy_file: str
    material_uuid: UUID
    status: Annotated[
        ManufacturingStatus, Field(default=ManufacturingStatus.QUEUED), Indexed()
    ]
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.now)

    class Settings:
        name = "manufacturing"
