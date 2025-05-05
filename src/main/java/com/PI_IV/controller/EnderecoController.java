package com.PI_IV.controller;

import com.PI_IV.DAO.InterfaceEndereco;
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
    private InterfaceEndereco dao;

    @Autowired
    private EnderecoService enderecoService;

    // Listar todos os endereços
    @GetMapping
    public ResponseEntity<List<Endereco>> listarEnderecos() {
        return ResponseEntity.ok((List<Endereco>) dao.findAll());
    }

    @GetMapping("/{idCliente}")
    public ResponseEntity<List<Endereco>> listarEnderecosPorCliente(@PathVariable int idCliente) {
        List<Endereco> enderecos = enderecoService.buscarEnderecosPorIdCliente(idCliente);
        return ResponseEntity.ok(enderecos);
    }

    // Criar um novo endereço
    @PostMapping
    public ResponseEntity<Endereco> criarEndereco(@RequestBody Endereco endereco) {
        return ResponseEntity.status(201).body(dao.save(endereco));
    }

    // Atualizar um endereço
    @PutMapping("/{id}")
    public ResponseEntity<Endereco> atualizarEndereco(@PathVariable Integer id, @RequestBody Endereco enderecoAtualizado) {
        Optional<Endereco> enderecoOpt = dao.findById(id);

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

            return ResponseEntity.ok(dao.save(endereco));
        }

        return ResponseEntity.notFound().build();
    }

    // Buscar endereço por ID
    @GetMapping("/{id}")
    public ResponseEntity<Endereco> buscarPorId(@PathVariable Integer id) {
        return dao.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscar endereços por cliente
    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Endereco>> buscarPorCliente(@PathVariable int idCliente) {
        List<Endereco> enderecos = dao.findByClienteId(idCliente);
        return ResponseEntity.ok(enderecos);
    }

    // Deletar endereço
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEndereco(@PathVariable Integer id) {
        if (dao.existsById(id)) {
            dao.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
