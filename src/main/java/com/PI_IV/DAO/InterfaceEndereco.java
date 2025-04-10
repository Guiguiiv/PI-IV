package com.PI_IV.DAO;

import com.PI_IV.model.Endereco;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface InterfaceEndereco extends CrudRepository<Endereco, Integer> {
    List<Endereco> findByClienteId(int idCliente);

    List<Endereco> findByPrincipalTrue();  // <- adiciona isso aqui
}
