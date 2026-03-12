from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class InventoryBase(BaseModel):
    """
    Shared properties for inventory models. Visible by anyone.
    """

    area: str = Field(..., description="The area of the inventory item.")
    gauge: str = Field(..., description="The gauge of the inventory item.")
    mill_no: str = Field(..., description="The mill number of the inventory item.")
    nwt_lbs: float = Field(..., description="The NWT in pounds of the inventory item.")
    osf_no: str = Field(..., description="The OSF number of the inventory item.")
    position: str = Field(..., description="The position of the inventory item.")
    receipt_date: datetime = Field(
        ..., description="The receipt date of the inventory item."
    )
    row: str = Field(..., description="The row of the inventory item.")
    supplier_uuid: UUID = Field(
        ..., description="The supplier associated with the inventory item."
    )
    status: str = Field(..., description="The status of the inventory item.")
    width_inches: str = Field(
        ..., description="The width in inches of the inventory item."
    )
    bay: str = Field(..., description="The bay of the inventory item.")
    bl: str = Field(..., description="The BL of the inventory item.")
    pl: str = Field(..., description="The PL of the inventory item.")
    po: str = Field(..., description="The PO of the inventory item.")


class InventoryCreate(InventoryBase):
    """
    Properties to create a new inventory item. Visible by anyone.
    """

    pass


class InventoryUpdate(BaseModel):
    """
    Properties to update an inventory item. Visible by anyone.
    """

    area: str | None = Field(default=None, description="The area of the inventory item.")
    gauge: str | None = Field(
        default=None, description="The gauge of the inventory item."
    )
    mill_no: str | None = Field(
        default=None, description="The mill number of the inventory item."
    )
    nwt_lbs: float | None = Field(
        default=None, description="The NWT in pounds of the inventory item."
    )
    osf_no: str | None = Field(
        default=None, description="The OSF number of the inventory item."
    )
    position: str | None = Field(
        default=None, description="The position of the inventory item."
    )
    receipt_date: datetime | None = Field(
        default=None, description="The receipt date of the inventory item."
    )
    row: str | None = Field(default=None, description="The row of the inventory item.")
    supplier_uuid: UUID | None = Field(
        default=None, description="The supplier associated with the inventory item."
    )
    status: str | None = Field(
        default=None, description="The status of the inventory item."
    )
    width_inches: str | None = Field(
        default=None, description="The width in inches of the inventory item."
    )
    bay: str | None = Field(default=None, description="The bay of the inventory item.")
    bl: str | None = Field(default=None, description="The BL of the inventory item.")
    pl: str | None = Field(default=None, description="The PL of the inventory item.")
    po: str | None = Field(default=None, description="The PO of the inventory item.")


class Inventory(InventoryBase):
    """
    Properties shared by models stored in the database. Visible by anyone.
    """

    uuid: UUID = Field(..., description="Unique identifier for the inventory item.")
    last_updated: datetime = Field(
        ..., description="Last updated timestamp for the inventory item."
    )
