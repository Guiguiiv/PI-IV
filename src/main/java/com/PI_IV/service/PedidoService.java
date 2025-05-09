package com.PI_IV.service;


import com.PI_IV.model.Pedido;
import com.PI_IV.DAO.InterfacePedido;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private InterfacePedido pedidoRepository;


    public Integer gerarNumeroPedidoSequencial() {
        Integer max = pedidoRepository.findMaxNumeroPedido();
        return (max != null) ? max + 1 : 10000; // Começa do 10000
    }


    public Pedido criarPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> buscarPedidoPorId(Integer idPedido) {
        return pedidoRepository.findById(idPedido);
    }

    public void deletarPedido(Integer idPedido) {
        pedidoRepository.deleteById(idPedido);
    }
}

