from typing import Annotated
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import Field
import datetime

from ..schemas import Address
from ..schemas.shipments import ShipmentStatus


class Shipment(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    client_uuid: UUID
    project_uuid: UUID
    ppo_id: str
    name: str
    consignee: str
    po_quotation: str
    carrier: str
    phone: str
    truck: str
    driver: str
    attn: str
    trailer: str
    emergency_contact: str
    emergency_contact_phone: str
    osfc_address: Address
    delivery_terms: str
    status: Annotated[ShipmentStatus, Field(default=ShipmentStatus.QUEUED), Indexed()]
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.now)

    class Settings:
        name = "shipments"
