package com.PI_IV.controller;



import com.PI_IV.model.Pedido;
import com.PI_IV.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // Criar um pedido
    @PostMapping
    public ResponseEntity<?> criarPedido(@RequestBody Pedido pedido) {
        try {
            // Define a data atual do pedido
            pedido.setDtPedido(new Date());

            // Define o status inicial como "aguardando pagamento"
            pedido.setStatus("aguardando pagamento");

            // Gera número sequencial do pedido
            Integer numero = pedidoService.gerarNumeroPedidoSequencial();
            pedido.setNumeroPedido(numero);

            // Salva o pedido no banco
            Pedido salvo = pedidoService.criarPedido(pedido);

            // Retorna uma resposta customizada para o frontend
            return ResponseEntity.ok(Map.of(
                    "mensagem", "Pedido criado com sucesso!",
                    "numeroPedido", salvo.getNumeroPedido(),
                    "valorTotal", salvo.getValorTotal(),
                    "status", salvo.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("erro", "Erro ao salvar o pedido")
            );
        }
    }



    // Listar todos os pedidos
    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos() {
        List<Pedido> pedidos = pedidoService.listarPedidos();
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }

    // Buscar pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPedidoPorId(@PathVariable Integer id) {
        Optional<Pedido> pedido = pedidoService.buscarPedidoPorId(id);
        return pedido.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }



    // Deletar um pedido
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPedido(@PathVariable Integer id) {
        pedidoService.deletarPedido(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
