package com.PI_IV.controller;

import com.PI_IV.model.Cliente;
import com.PI_IV.model.Endereco;
import com.PI_IV.model.Pedido;
import com.PI_IV.service.PedidoService;
import com.PI_IV.DAO.InterfaceCliente;
import com.PI_IV.DAO.InterfaceEndereco;

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

    @Autowired
    private InterfaceCliente clienteRepository;

    @Autowired
    private InterfaceEndereco enderecoRepository;

    @PostMapping
    public ResponseEntity<?> criarPedido(@RequestBody Map<String, Object> pedidoData) {
        try {
            Pedido pedido = new Pedido();

            // Data e status
            pedido.setDtPedido(new Date());
            pedido.setStatus("aguardando pagamento");

            // Gera número sequencial do pedido
            Integer numero = pedidoService.gerarNumeroPedidoSequencial();
            pedido.setNumeroPedido(numero);

            // Mapeia cliente e endereço a partir dos dados recebidos
            Map<String, Object> clienteMap = (Map<String, Object>) pedidoData.get("cliente");
            Map<String, Object> enderecoMap = (Map<String, Object>) pedidoData.get("endereco");

            // Buscar cliente e endereço do banco de dados
            Integer idCliente = (Integer) clienteMap.get("id");
            Integer idEndereco = (Integer) enderecoMap.get("id");

            Cliente cliente = clienteRepository.findById(idCliente)
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            Endereco endereco = enderecoRepository.findById(idEndereco)
                    .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

            pedido.setCliente(cliente);
            pedido.setEndereco(endereco);

            // Forma pagamento, frete, valor total
            pedido.setFormaPagamento((String) pedidoData.get("formaPagamento"));
            pedido.setValorFrete(Double.parseDouble(pedidoData.get("valorFrete").toString()));
            pedido.setValorTotal(Double.parseDouble(pedidoData.get("valorTotal").toString()));

            // Salva pedido
            Pedido salvo = pedidoService.criarPedido(pedido);

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Pedido criado com sucesso!",
                    "numeroPedido", salvo.getNumeroPedido(),
                    "valorTotal", salvo.getValorTotal(),
                    "status", salvo.getStatus()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("erro", "Erro ao salvar o pedido: " + e.getMessage())
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
    // Buscar pedidos por ID do cliente
    @GetMapping("/cliente/{id}")
    public ResponseEntity<List<Pedido>> buscarPedidosPorCliente(@PathVariable Integer id) {
        List<Pedido> pedidos = pedidoService.buscarPedidosPorCliente(id);
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> atualizarStatus(@PathVariable Integer id, @RequestBody Pedido pedidoAtualizado) {
        Optional<Pedido> pedidoExistente = pedidoService.buscarPedidoPorId(id);
        if (pedidoExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Pedido pedido = pedidoExistente.get();
        pedido.setStatus(pedidoAtualizado.getStatus());

        Pedido atualizado = pedidoService.salvarPedido(pedido);
        return ResponseEntity.ok(atualizado);
    }


}
