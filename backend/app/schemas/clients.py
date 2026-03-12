from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from .address import Address


class ClientBase(BaseModel):
    """
    Shared Client properties. Visible by anyone.
    """

    company: str = Field(..., description="Company name of the client.")
    category: str = Field(..., description="Category of the client.")
    address: Address = Field(..., description="Address of the client.")
    mobile: str = Field(..., description="Mobile number of the client.")
    email: EmailStr = Field(..., description="Email address of the client.")
    fax: str | None = Field(default=None, description="Fax number of the client.")
    extension: str | None = Field(
        default=None, description="Extension number of the client."
    )
    web_page: str | None = Field(default=None, description="Web page of the client.")
    notes: str | None = Field(
        default=None, description="Additional notes about the client."
    )


class ClientCreate(ClientBase):
    """
    Properties to create a new client. Visible by anyone.
    """

    pass


class ClientUpdate(BaseModel):
    """
    Properties to update a client. Visible by anyone.
    """

    company: str | None = Field(default=None, description="Company name of the client.")
    category: str | None = Field(default=None, description="Category of the client.")
    address: Address | None = Field(default=None, description="Address of the client.")
    mobile: str | None = Field(default=None, description="Mobile number of the client.")
    email: EmailStr | None = Field(
        default=None, description="Email address of the client."
    )
    fax: str | None = Field(default=None, description="Fax number of the client.")
    extension: str | None = Field(
        default=None, description="Extension number of the client."
    )
    web_page: str | None = Field(default=None, description="Web page of the client.")
    notes: str | None = Field(
        default=None, description="Additional notes about the client."
    )


class Client(ClientBase):
    """
    Properties shared by models stored in the database. Visible by anyone.
    """

    uuid: UUID = Field(..., description="Unique identifier for the client.")
    last_updated: datetime = Field(
        ..., description="Last updated timestamp for the client."
    )
