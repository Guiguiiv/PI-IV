package com.PI_IV.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPedido")
    private Integer idPedido;

    @Column(name = "dtPedido", nullable = false)
    private Date dtPedido;

    @ManyToOne
    @JoinColumn(name = "idCliente", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "idEndereco", nullable = false)
    private Endereco endereco;

    @Column(name = "formaPagamento", nullable = false, length = 50)
    private String formaPagamento;

    @Column(name = "valorFrete", nullable = false)
    private Double valorFrete;

    @Column(name = "status", nullable = false, length = 50)
// Status do pedido ("aguardando pagamento", "finalizado", etc.)
    private String status;

    @Column(name = "valor_total", nullable = false)
// Valor total do pedido
    private Double valorTotal;

    @Column(name = "numero_pedido", nullable = false, unique = true)
// Número sequencial do pedido (ex: #10001)
    private Integer numeroPedido;


}
