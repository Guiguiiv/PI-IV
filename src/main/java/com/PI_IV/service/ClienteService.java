package com.PI_IV.service;

import com.PI_IV.DAO.InterfaceCliente;
import com.PI_IV.model.Cliente;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final InterfaceCliente repository;
    private final PasswordEncoder passwordEncoder;

    // Construtor com injeção de dependência e inicialização do codificador de senha
    public ClienteService(InterfaceCliente repository) {
        this.repository = repository;
        this.passwordEncoder = new BCryptPasswordEncoder(); // Codificador para criptografar senhas
    }

    // Retorna a lista de todos os clientes cadastrados
    public List<Cliente> listarClientes() {
        return (List<Cliente>) repository.findAll();
    }

    // Cria um novo cliente com a senha criptografada
    public Cliente criarCliente(Cliente cliente) {
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha())); // Criptografa a senha
        return repository.save(cliente);
    }

    // Edita os dados de um cliente existente
    public Cliente editarCliente(Cliente clienteAtualizado) {
        Optional<Cliente> clienteOpt = repository.findById(clienteAtualizado.getId());

        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();

            // Atualiza apenas os campos permitidos
            cliente.setNome(clienteAtualizado.getNome());
            cliente.setDataNascimento(clienteAtualizado.getDataNascimento());
            cliente.setGenero(clienteAtualizado.getGenero());

            // Atualiza a senha apenas se uma nova senha for enviada
            if (clienteAtualizado.getSenha() != null && !clienteAtualizado.getSenha().isEmpty()) {
                cliente.setSenha(passwordEncoder.encode(clienteAtualizado.getSenha()));
            }

            return repository.save(cliente);
        }

        return null; // Cliente não encontrado
    }

    // Busca um cliente pelo ID
    public Optional<Cliente> buscarClientePorId(int id) {
        return repository.findById(id);
    }

    // Busca um cliente pelo CPF
    public Optional<Cliente> buscarClientePorCpf(String cpf) {
        return repository.findByCpf(cpf);
    }

    // Busca um cliente pelo e-mail
    public Optional<Cliente> buscarClientePorEmail(String email) {
        return repository.findByEmail(email);
    }

    // Valida se a senha fornecida bate com a senha criptografada do banco
    public boolean validarSenha(String senhaDigitada, String senhaCriptografada) {
        return passwordEncoder.matches(senhaDigitada, senhaCriptografada);
    }
}
