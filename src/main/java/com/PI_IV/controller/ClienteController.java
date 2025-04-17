package com.PI_IV.controller;

import com.PI_IV.DAO.InterfaceCliente;
import com.PI_IV.model.Cliente;
import com.PI_IV.model.Endereco;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private InterfaceCliente dao;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        List<Cliente> clientes = StreamSupport.stream(dao.findAll().spliterator(), false)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clientes);
    }


    @PostMapping
    public ResponseEntity<?> criarCliente(@RequestBody Cliente cliente) {
        // Verifica se o e-mail já está cadastrado
        if (dao.findByEmail(cliente.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email já cadastrado.");
        }

        // Verifica se o CPF já está cadastrado
        if (dao.findByCpf(cliente.getCpf()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("CPF já cadastrado.");
        }

        // Criptografa a senha antes de salvar
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));

        // Garante que os endereços estão associados corretamente ao cliente
        if (cliente.getEnderecos() != null) {
            cliente.getEnderecos().forEach(endereco -> endereco.setCliente(cliente));
        }

        // Salva cliente e, graças ao Cascade, também salva os endereços
        Cliente novoCliente = dao.save(cliente);

        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
    }

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

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

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

    @GetMapping("/id/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Integer id) {
        return dao.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Cliente> buscarPorEmail(@PathVariable String email) {
        return dao.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Cliente> buscarPorCpf(@PathVariable String cpf) {
        return dao.findByCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
