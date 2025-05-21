package com.PI_IV.controller;

import com.PI_IV.model.Endereco;
import com.PI_IV.service.EnderecoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/endereco")
public class EnderecoController {

    @Autowired
    private EnderecoService enderecoService;

    // Listar todos os endereços
    @GetMapping
    public ResponseEntity<List<Endereco>> listarEnderecos() {
        return ResponseEntity.ok(enderecoService.listarEnderecos());
    }

    // Listar endereços por cliente
    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Endereco>> listarEnderecosPorCliente(@PathVariable int idCliente) {
        return ResponseEntity.ok(enderecoService.buscarEnderecosPorIdCliente(idCliente));
    }

    // Criar um novo endereço
    @PostMapping
    public ResponseEntity<Endereco> criarEndereco(@RequestBody Endereco endereco) {
        return ResponseEntity.status(201).body(enderecoService.criarEndereco(endereco));
    }

    // Definir endereço como principal
    @PutMapping("/{id}/definir-principal")
    public ResponseEntity<Void> definirEnderecoComoPrincipal(@PathVariable Integer id) {
        boolean sucesso = enderecoService.definirEnderecoPrincipal(id);
        return sucesso ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // Atualizar um endereço
    @PutMapping("/{id}")
    public ResponseEntity<Endereco> atualizarEndereco(@PathVariable Integer id, @RequestBody Endereco enderecoAtualizado) {
        Optional<Endereco> enderecoOpt = enderecoService.buscarEnderecoPorId(id);

        if (enderecoOpt.isPresent()) {
            Endereco endereco = enderecoOpt.get();

            endereco.setLogradouro(enderecoAtualizado.getLogradouro());
            endereco.setCep(enderecoAtualizado.getCep());
            endereco.setBairro(enderecoAtualizado.getBairro());
            endereco.setUf(enderecoAtualizado.getUf());
            endereco.setCidade(enderecoAtualizado.getCidade());
            endereco.setNumero(enderecoAtualizado.getNumero());
            endereco.setComplemento(enderecoAtualizado.getComplemento());
            endereco.setTipoEndereco(enderecoAtualizado.isTipoEndereco());
            endereco.setPrincipal(enderecoAtualizado.isPrincipal());
            endereco.setCliente(enderecoAtualizado.getCliente());

            return ResponseEntity.ok(enderecoService.editarEndereco(endereco));
        }

        return ResponseEntity.notFound().build();
    }

    // Buscar endereço por ID
    @GetMapping("/id/{id}")
    public ResponseEntity<Endereco> buscarPorId(@PathVariable Integer id) {
        return enderecoService.buscarEnderecoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Deletar endereço
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEndereco(@PathVariable Integer id) {
        boolean deletado = enderecoService.deletarEndereco(id);
        return deletado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
