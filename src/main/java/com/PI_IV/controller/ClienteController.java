package com.PI_IV.controller;

import com.PI_IV.model.Cliente;
import com.PI_IV.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*") // Permite requisições de qualquer origem (útil para frontend separado)
@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // Endpoint GET para listar todos os clientes
    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        return ResponseEntity.ok(clienteService.listarClientes());
    }

    // Endpoint POST para cadastrar um novo cliente
    @PostMapping
    public ResponseEntity<?> criarCliente(@RequestBody Cliente cliente) {
        // Verifica se o e-mail já está cadastrado
        if (clienteService.buscarClientePorEmail(cliente.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email já cadastrado.");
        }

        // Verifica se o CPF já está cadastrado
        if (clienteService.buscarClientePorCpf(cliente.getCpf()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("CPF já cadastrado.");
        }

        // Cria o novo cliente
        Cliente novoCliente = clienteService.criarCliente(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
    }

    // Endpoint PUT para editar um cliente existente
    @PutMapping("/{id}")
    public ResponseEntity<?> editarCliente(@PathVariable Integer id, @RequestBody Cliente clienteAtualizado) {
        clienteAtualizado.setId(id); // Garante que o ID enviado por URL seja utilizado
        Cliente clienteEditado = clienteService.editarCliente(clienteAtualizado);
        if (clienteEditado != null) {
            return ResponseEntity.ok(clienteEditado);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente não encontrado.");
    }

    // Endpoint POST para login de cliente
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Cliente cliente) {
        Optional<Cliente> clienteOpt = clienteService.buscarClientePorEmail(cliente.getEmail());

        if (clienteOpt.isPresent()) {
            Cliente clienteEncontrado = clienteOpt.get();

            // Valida a senha digitada com a senha criptografada
            if (clienteService.validarSenha(cliente.getSenha(), clienteEncontrado.getSenha())) {
                return ResponseEntity.ok(clienteEncontrado); // Login bem-sucedido
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta.");
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cliente não encontrado.");
    }

    // Endpoint GET para buscar cliente por ID
    @GetMapping("/id/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Integer id) {
        return clienteService.buscarClientePorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Endpoint GET para buscar cliente por e-mail
    @GetMapping("/email/{email}")
    public ResponseEntity<Cliente> buscarPorEmail(@PathVariable String email) {
        return clienteService.buscarClientePorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Endpoint GET para buscar cliente por CPF
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Cliente> buscarPorCpf(@PathVariable String cpf) {
        return clienteService.buscarClientePorCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
