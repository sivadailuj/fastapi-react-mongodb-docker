import pytest

from httpx import AsyncClient
from uuid import UUID
from app.config.config import settings

from datetime import datetime
from app.schemas import InventoryCreate as Create
from app.schemas import InventoryUpdate as Update
from app.schemas import Inventory as Schema

from ..utils import verify_update_data

PREFIX = "/inventory"

create_data = Create(
    area="01234",
    gauge="18",
    mill_no="456789-00",
    nwt_lbs=1234.56,
    osf_no="123456",
    position="1",
    receipt_date=datetime.now().replace(microsecond=0),
    row="1",
    supplier_uuid=UUID(int=1),
    status="in_inventory",
    width_inches="10",
    bay="1",
    bl="12345",
    pl="12345",
    po="123456-01",
)

update_data = Update(
    area="43210",
    # gauge="12",
    mill_no="654872-08",
    nwt_lbs=3214.26,
    osf_no="654321",
    position="2",
    receipt_date=datetime.now().replace(microsecond=0),
    row="2",
    supplier_uuid=UUID(int=2),
    status="in_inventory",
    width_inches="20",
    bay="2",
    bl="43215",
    pl="54321",
    po="654321-10",
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
