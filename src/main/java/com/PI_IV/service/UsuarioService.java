package com.PI_IV.service;

import com.PI_IV.DAO.InterfaceUsuario;
import com.PI_IV.model.Usuario;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final InterfaceUsuario repository;
    private final PasswordEncoder passwordEncoder;


    public UsuarioService(InterfaceUsuario repository) {
        this.repository = repository;
        this.passwordEncoder = new BCryptPasswordEncoder(); // Criptografa senhas com BCrypt
    }

    public List<Usuario> listarUsuarios() {
        return (List<Usuario>) repository.findAll();
    }

    public Usuario criarUsuario(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return repository.save(usuario);
    }

    public Usuario editarUsuario(Usuario usuario) {

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return repository.save(usuario);
    }


    public Usuario ativarDesativarUsuario(int id, boolean ativo) {
        Optional<Usuario> usuarioExistente = repository.findById(id);
        if (usuarioExistente.isPresent()) {
            Usuario usuarioAtual = usuarioExistente.get();
            usuarioAtual.setAtivo(ativo);  // Altera o status de ativo/desativo
            return repository.save(usuarioAtual);  // Atualiza o usuário no banco de dados
        }
        return null;
    }

    public Optional<Usuario> buscarUsuarioPorId(int id) {
        return repository.findById(id);
    }


    public Optional<Usuario> buscarUsuarioPorCpf(String cpf) {
        return repository.findByCpf(cpf);
    }


    public Optional<Usuario> buscarUsuarioPorEmail(String email) {
        return repository.findByEmail(email);
    }
}
