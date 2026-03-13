from typing import Annotated
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import Field
import datetime

from ..schemas.orders import OrderStatus


class Order(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    client_uuid: UUID
    project_uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed()]
    job_no: str
    purchase_order: str
    phase: str
    batch: str
    area: str
    level: str
    planned_start_date: datetime.date = Field(default_factory=datetime.date.today)
    planned_end_date: datetime.date = Field(default_factory=datetime.date.today)
    status: Annotated[OrderStatus, Field(default=OrderStatus.QUEUED), Indexed()]
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.now)

    class Settings:
        name = "orders"
