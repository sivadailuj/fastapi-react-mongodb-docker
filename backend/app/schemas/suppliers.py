from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from .address import Address


class SupplierBase(BaseModel):
    """
    Shared Supplier properties. Visible by anyone.
    """

    company: str = Field(..., description="Name of the supplier company.")
    contact_person: str = Field(
        ..., description="Name of the contact person for the supplier."
    )
    short_name: str = Field(
        ..., description="Short name or abbreviation for the supplier."
    )
    address: Address = Field(..., description="Address of the supplier.")
    email: EmailStr = Field(..., description="Email address of the supplier.")
    mobile: str = Field(..., description="Mobile phone number of the supplier.")
    office: str = Field(..., description="Office phone number of the supplier.")
    position: str = Field(..., description="Position or title of the contact person.")


class SupplierCreate(SupplierBase):
    """
    Properties to create a new supplier. Visible by anyone.
    """

    pass


class SupplierUpdate(BaseModel):
    """
    Properties to update a supplier. Visible by anyone.
    """

    company: str | None = Field(default=None, description="Name of the supplier company.")
    contact_person: str | None = Field(
        default=None, description="Name of the contact person for the supplier."
    )
    short_name: str | None = Field(
        default=None, description="Short name or abbreviation for the supplier."
    )
    address: Address | None = Field(default=None, description="Address of the supplier.")
    email: EmailStr | None = Field(
        default=None, description="Email address of the supplier."
    )
    mobile: str | None = Field(
        default=None, description="Mobile phone number of the supplier."
    )
    office: str | None = Field(
        default=None, description="Office phone number of the supplier."
    )
    position: str | None = Field(
        default=None, description="Position or title of the contact person."
    )


class Supplier(SupplierBase):
    """
    Properties shared by models stored in the database. Visible by anyone.
    """

    uuid: UUID = Field(..., description="Unique identifier for the supplier.")
    last_updated: datetime = Field(
        ..., description="Last updated timestamp for the supplier."
    )
