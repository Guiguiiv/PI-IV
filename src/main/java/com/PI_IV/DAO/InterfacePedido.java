package com.PI_IV.DAO;


import com.PI_IV.model.Pedido   ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InterfacePedido extends JpaRepository<Pedido, Integer> {
    // Métodos adicionais de consulta podem ser adicionados aqui

    @Query("SELECT MAX(p.numeroPedido) FROM Pedido p")
    Integer findMaxNumeroPedido();

}
