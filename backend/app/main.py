from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .database import engine, get_db

# Cria as tabelas no banco de dados automaticamente quando a API ligar
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Pedidos")

# Rota para Listar todos os pedidos
@app.get("/pedidos", response_model=List[schemas.Pedido])
def ler_pedidos(db: Session = Depends(get_db)):
    return db.query(models.Pedido).all()

# Rota para Criar um pedido novo
@app.post("/pedidos", response_model=schemas.Pedido)
def criar_pedido(pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    db_pedido = models.Pedido(cliente=pedido.cliente, status=pedido.status)
    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)
    return db_pedido

# Rota para Editar (Atualizar) um pedido
@app.put("/pedidos/{pedido_id}", response_model=schemas.Pedido)
def atualizar_pedido(pedido_id: int, pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    db_pedido = db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    db_pedido.cliente = pedido.cliente
    db_pedido.status = pedido.status
    db.commit()
    db.refresh(db_pedido)
    return db_pedido

# Rota para Deletar um pedido
@app.delete("/pedidos/{pedido_id}")
def deletar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    db_pedido = db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    db.delete(db_pedido)
    db.commit()
    return {"message": "Deletado com sucesso"}

# Rota para Criar um item dentro de um pedido específico
@app.post("/pedidos/{pedido_id}/itens", response_model=schemas.ItemPedido)
def criar_item_para_pedido(pedido_id: int, item: schemas.ItemPedidoCreate, db: Session = Depends(get_db)):
    db_pedido = db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    db_item = models.ItemPedido(**item.model_dump(), pedido_id=pedido_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item