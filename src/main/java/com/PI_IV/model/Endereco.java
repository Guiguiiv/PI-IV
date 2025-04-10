package com.PI_IV.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "endereco")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_endereco")
    private int id;

    @Column(name = "logradouro", length = 100, nullable = false)
    private String logradouro;

    @Column(name = "cep", length = 9, nullable = false)
    private String cep;

    @Column(name = "bairro", length = 100, nullable = false)
    private String bairro;

    @Column(name = "uf", length = 2, nullable = false)
    private String uf;

    @Column(name = "cidade", length = 100, nullable = false)
    private String cidade;

    @Column(name = "numero", length = 4, nullable = false)
    private String numero;

    @Column(name = "complemento", length = 20)
    private String complemento;

    @Column(name = "tipoendereco")
    private boolean tipoEndereco;

    @Column(name = "principal")
    private boolean principal;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
}
