from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from .address import Address


class ShipmentBase(BaseModel):
    """
    Shared properties for shipment models. Visible by anyone.
    """

    name: str = Field(..., description="The name of the shipment.")
    client_uuid: UUID = Field(..., description="The client associated with the shipment.")
    project_uuid: UUID = Field(
        ..., description="The project associated with the shipment."
    )
    ppo_id: str = Field(..., description="The PPO ID of the shipment.")
    consignee: str = Field(..., description="The consignee of the shipment.")
    po_quotation: str = Field(..., description="The PO quotation of the shipment.")
    carrier: str = Field(..., description="The carrier of the shipment.")
    phone: str = Field(..., description="The phone number for the shipment.")
    truck: str = Field(..., description="The truck information for the shipment.")
    driver: str = Field(..., description="The driver information for the shipment.")
    attn: str = Field(..., description="The attn information for the shipment.")
    trailer: str = Field(..., description="The trailer information for the shipment.")
    emergency_contact: str = Field(
        ..., description="The emergency contact for the shipment."
    )
    emergency_contact_phone: str = Field(
        ..., description="The emergency contact phone number for the shipment."
    )
    osfc_address: Address = Field(
        ..., description="The OSFC address associated with the shipment."
    )
    delivery_terms: str = Field(
        ..., description="The delivery terms associated with the shipment."
    )
    status: str = Field(..., description="The status of the shipment.")


class ShipmentCreate(ShipmentBase):
    """
    Properties to create a new shipment. Visible by anyone.
    """

    pass


class ShipmentUpdate(BaseModel):
    """
    Properties to update a shipment. Visible by anyone.
    """

    name: str | None = Field(default=None, description="The name of the shipment.")
    client_uuid: UUID | None = Field(
        default=None, description="The client associated with the shipment."
    )
    project_uuid: UUID | None = Field(
        default=None, description="The project associated with the shipment."
    )
    ppo_id: str | None = Field(default=None, description="The PPO ID of the shipment.")
    consignee: str | None = Field(
        default=None, description="The consignee of the shipment."
    )
    po_quotation: str | None = Field(
        default=None, description="The PO quotation of the shipment."
    )
    carrier: str | None = Field(default=None, description="The carrier of the shipment.")
    phone: str | None = Field(
        default=None, description="The phone number for the shipment."
    )
    truck: str | None = Field(
        default=None, description="The truck information for the shipment."
    )
    driver: str | None = Field(
        default=None, description="The driver information for the shipment."
    )
    attn: str | None = Field(
        default=None, description="The attn information for the shipment."
    )
    trailer: str | None = Field(
        default=None, description="The trailer information for the shipment."
    )
    emergency_contact: str | None = Field(
        default=None, description="The emergency contact for the shipment."
    )
    emergency_contact_phone: str | None = Field(
        default=None, description="The emergency contact phone number for the shipment."
    )
    osfc_address: Address | None = Field(
        default=None, description="The OSFC address associated with the shipment."
    )
    delivery_terms: str | None = Field(
        default=None, description="The delivery terms associated with the shipment."
    )
    status: str | None = Field(default=None, description="The status of the shipment.")


class Shipment(ShipmentBase):
    """
    Properties shared by models stored in the database. Visible by anyone.
    """

    uuid: UUID = Field(..., description="Unique identifier for the shipment.")
    last_updated: datetime = Field(
        ..., description="Last updated timestamp for the shipment."
    )
