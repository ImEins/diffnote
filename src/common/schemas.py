from pydantic import BaseModel


class BaseSchema(BaseModel):
    """Base schema class with ORM mode enabled for all schemas."""

    model_config = {'from_attributes': True}
