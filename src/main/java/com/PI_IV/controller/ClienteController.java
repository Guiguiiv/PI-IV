package com.PI_IV.controller;

import com.PI_IV.DAO.InterfaceCliente;
import com.PI_IV.model.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private InterfaceCliente dao;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Listar todos os clientes
    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        List<Cliente> lista = (List<Cliente>) dao.findAll();
        return ResponseEntity.status(200).body(lista);
    }

    // Criar novo cliente
    @PostMapping
    public ResponseEntity<Cliente> criarCliente(@RequestBody Cliente cliente) {
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        Cliente clienteNovo = dao.save(cliente);
        return ResponseEntity.status(201).body(clienteNovo);
    }

    // Editar cliente por ID (nome, data de nascimento, genero e senha)
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> editarCliente(@PathVariable Integer id, @RequestBody Cliente clienteAtualizado) {
        Optional<Cliente> clienteOpt = dao.findById(id);

        if (clienteOpt.isPresent()) {
            Cliente clienteExistente = clienteOpt.get();

            clienteExistente.setNome(clienteAtualizado.getNome());
            clienteExistente.setDataNascimento(clienteAtualizado.getDataNascimento());
            clienteExistente.setGenero(clienteAtualizado.getGenero());

            if (clienteAtualizado.getSenha() != null && !clienteAtualizado.getSenha().isEmpty()) {
                clienteExistente.setSenha(passwordEncoder.encode(clienteAtualizado.getSenha()));
            }

            Cliente clienteSalvo = dao.save(clienteExistente);
            return ResponseEntity.ok(clienteSalvo);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    // Login do cliente
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Cliente cliente) {
        Optional<Cliente> clienteOpt = dao.findByEmail(cliente.getEmail());

        if (clienteOpt.isPresent()) {
            Cliente clienteEncontrado = clienteOpt.get();

            if (passwordEncoder.matches(cliente.getSenha(), clienteEncontrado.getSenha())) {
                return ResponseEntity.ok(clienteEncontrado);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta");
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cliente não encontrado");
    }

    // Buscar cliente por ID
    @GetMapping("/id/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Integer id) {
        Optional<Cliente> cliente = dao.findById(id);
        return cliente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Buscar cliente por email
    @GetMapping("/email/{email}")
    public ResponseEntity<Cliente> buscarPorEmail(@PathVariable String email) {
        Optional<Cliente> cliente = dao.findByEmail(email);
        return cliente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Buscar cliente por CPF
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Cliente> buscarPorCpf(@PathVariable String cpf) {
        Optional<Cliente> cliente = dao.findByCpf(cpf);
        return cliente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }
}
