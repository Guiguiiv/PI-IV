package com.PI_IV.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "nome_completo", length = 200, nullable = true)
    private String nome;

    @Column(name = "cpf", length = 14, nullable = true)
    private String cpf;

    @Column(name = "email", length = 100, nullable = true)
    private String email;

    @Column(name = "senha", columnDefinition = "TEXT", nullable = true)
    private String senha;

    @Column(name = "grupo", length = 200, nullable = true)
    private String grupo;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    @Column(name = "genero", length = 30)
    private String genero;

    @Column(name = "data_nascimento")
    @JsonFormat(pattern = "yyyy-MM-dd") // importante para serialização correta
    private LocalDate dataNascimento;

}
