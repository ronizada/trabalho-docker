from pydantic import BaseModel
from typing import List, Optional

class ItemPedidoBase(BaseModel):
    produto: str
    quantidade: int

class ItemPedidoCreate(ItemPedidoBase):
    pass

class ItemPedido(ItemPedidoBase):
    id: int
    pedido_id: int
    class Config:
        from_attributes = True

class PedidoBase(BaseModel):
    cliente: str
    status: Optional[str] = "Pendente"

class PedidoCreate(PedidoBase):
    pass

class Pedido(PedidoBase):
    id: int
    itens: List[ItemPedido] = []
    class Config:
        from_attributes = True