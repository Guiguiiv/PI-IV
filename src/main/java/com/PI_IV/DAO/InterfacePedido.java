package com.PI_IV.DAO;


import com.PI_IV.model.Pedido   ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InterfacePedido extends JpaRepository<Pedido, Integer> {
    // Métodos adicionais de consulta podem ser adicionados aqui
    List<Pedido> findByClienteId(Integer clienteId);

    @Query("SELECT MAX(p.numeroPedido) FROM Pedido p")
    Integer findMaxNumeroPedido();
    List<Pedido> findAllByOrderByDtPedidoDesc();



}
