import pytest

from httpx import AsyncClient
from uuid import UUID
from app.config.config import settings

from app.schemas import Address
from app.schemas import ShipmentCreate as Create
from app.schemas import ShipmentUpdate as Update
from app.schemas import Shipment as Schema

from ..utils import verify_update_data

PREFIX = "/shipments"

create_address = Address(
    street="123 Main St",
    city="City",
    state="FL",
    zip_code="12345",
    country="US",
)

create_data = Create(
    client_uuid=UUID(int=1),
    project_uuid=UUID(int=2),
    ppo_id="123456",
    name="name",
    consignee="cons",
    po_quotation="1",
    carrier="carr",
    phone="1234567890",
    truck="1",
    driver="Test Driver",
    attn="1",
    trailer="1",
    emergency_contact="Test Emergency",
    emergency_contact_phone="1234567809",
    osfc_address=create_address,
    delivery_terms="123",
    status="queued",
)

update_address = Address(
    street="456 Main St",
    city="UpdateCity",
    state="GA",
    zip_code="54321",
    country="USA",
)

update_data = Update(
    client_uuid=UUID(int=3),
    project_uuid=UUID(int=4),
    ppo_id="654321",
    name="name2",
    consignee="cons2",
    po_quotation="2",
    carrier="carr2",
    phone="0987654321",
    truck="2",
    driver="Update Driver",
    attn="2",
    trailer="2",
    emergency_contact="Update Emergency",
    emergency_contact_phone="9876543210",
    osfc_address=update_address,
    delivery_terms="321",
    status="delivered",
)


@pytest.mark.anyio
async def test_create(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    ret_json = response.json()
    assert create_data == Create.model_validate(ret_json)


@pytest.mark.anyio
async def test_get(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    create_json = response.json()
    response = await client.get(f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}")
    assert response.status_code == 200
    ret_json = response.json()
    assert Schema.model_validate(create_json) == Schema.model_validate(ret_json)


@pytest.mark.anyio
async def test_update(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    create_json = response.json()
    response = await client.patch(
        f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}",
        json=update_data.model_dump(exclude_unset=True, mode="json"),
    )
    assert response.status_code == 200
    ret_json = response.json()
    verify_update_data(create_data, update_data, Schema.model_validate(ret_json))


@pytest.mark.anyio
async def test_delete(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    create_json = response.json()
    response = await client.delete(f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}")
    assert response.status_code == 204
    response = await client.get(f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}")
    assert response.status_code == 404
