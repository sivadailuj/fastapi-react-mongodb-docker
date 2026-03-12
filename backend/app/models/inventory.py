from typing import Annotated
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import Field
import datetime


class Inventory(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    area: str
    gauge: str
    mill_no: str
    nwt_lbs: float
    osf_no: str
    position: str
    receipt_date: datetime.datetime
    row: str
    supplier_uuid: Annotated[UUID, Indexed()]
    status: str
    width_inches: str
    bay: str
    bl: str
    pl: str
    po: str
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.now)

    class Settings:
        name = "inventory"
