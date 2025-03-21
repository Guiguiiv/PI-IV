package com.PI_IV.controller;

import com.PI_IV.model.Produto;
import com.PI_IV.service.ProdutoService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    // Lista todos os produtos
    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // Lista apenas produtos ativos
    @GetMapping("/ativos")
    public ResponseEntity<List<Produto>> listarAtivos() {
        return ResponseEntity.ok(service.listarAtivos());
    }

    // Busca um produto pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Integer id) {
        Optional<Produto> produto = service.buscarPorId(id);
        return produto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Cria um novo produto
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Produto> criarProduto(
            @RequestParam("nome") String nome,
            @RequestParam("preco") Double preco,
            @RequestParam("quantidadeEstoque") Integer quantidadeEstoque,
            @RequestParam("descricao") String descricao,
            @RequestParam("avaliacao") Float avaliacao,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {

        Produto produto = new Produto();
        produto.setNome(nome);
        produto.setPreco(preco);
        produto.setQuantidadeEstoque(quantidadeEstoque);
        produto.setDescricao(descricao);
        produto.setAvaliacao(avaliacao);

        if (imagem != null && !imagem.isEmpty()) {
            try {
                produto.setImagemPadrao(imagem.getBytes());
                produto.setImagemBlob(imagem.getBytes());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(produto));
    }

    // Atualiza um produto existente
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Integer id, @RequestBody Produto produto) {
        Produto produtoAtualizado = service.atualizar(id, produto);
        return produtoAtualizado != null ? ResponseEntity.ok(produtoAtualizado) : ResponseEntity.notFound().build();
    }

    // Ativa ou desativa um produto
    @PutMapping("/ativarDesativar/{id}")
    public ResponseEntity<Produto> ativarDesativarProduto(@PathVariable Integer id) {
        Optional<Produto> produtoOpt = service.ativarDesativar(id);
        return produtoOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para salvar imagem de produto
    @PostMapping("/{id}/imagem")
    public ResponseEntity<Produto> salvarImagem(@PathVariable Integer id, @RequestParam("imagem") MultipartFile imagem, @RequestParam(value = "isPrincipal", defaultValue = "true") boolean isPrincipal) {
        Produto produtoAtualizado = service.salvarImagem(id, imagem, isPrincipal);
        return produtoAtualizado != null ? ResponseEntity.ok(produtoAtualizado) : ResponseEntity.notFound().build();
    }

    // Endpoint para recuperar imagem de produto
    @GetMapping("/{id}/imagem")
    public ResponseEntity<byte[]> recuperarImagem(@PathVariable Integer id) {
        byte[] imagem = service.recuperarImagem(id);
        if (imagem == null) return ResponseEntity.notFound().build();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "image/jpeg"); // Define o tipo de imagem como genérico

        return new ResponseEntity<>(imagem, headers, HttpStatus.OK);
    }
}
