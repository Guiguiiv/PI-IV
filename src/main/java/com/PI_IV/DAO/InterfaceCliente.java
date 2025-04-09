package com.PI_IV.DAO;

import com.PI_IV.model.Cliente;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface InterfaceCliente extends CrudRepository<Cliente, Integer> {

    Optional<Cliente> findByEmail(String email);

    Optional<Cliente> findByCpf(String cpf);

}
