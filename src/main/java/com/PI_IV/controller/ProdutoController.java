package com.PI_IV.controller;

import com.PI_IV.model.Produto;
import com.PI_IV.model.ImagemProduto;
import com.PI_IV.service.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService service;
    private static final String UPLOAD_DIR = "C:/Users/Administrador/PI-IV/imagens_produto/";

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProdutoPorId(@PathVariable Integer id) {
        Optional<Produto> produto = service.buscarPorId(id);
        return produto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Produto> criarProduto(
            @RequestParam("nome") String nome,
            @RequestParam("preco") Double preco,
            @RequestParam("quantidadeEstoque") Integer quantidadeEstoque,
            @RequestParam("descricao") String descricao,
            @RequestParam("avaliacao") Float avaliacao,
            @RequestParam(value = "imagens", required = false) List<MultipartFile> imagens) {

        if (nome == null || nome.isEmpty() ||
                preco == null || preco <= 0 ||
                quantidadeEstoque == null || quantidadeEstoque < 0 ||
                descricao == null || descricao.isEmpty() ||
                avaliacao == null || avaliacao < 1 || avaliacao > 5) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Produto produto = new Produto();
        produto.setNome(nome);
        produto.setPreco(preco);
        produto.setQuantidadeEstoque(quantidadeEstoque);
        produto.setDescricao(descricao);
        produto.setAvaliacao(avaliacao);

        try {
            File pastaRaiz = new File(UPLOAD_DIR);
            if (!pastaRaiz.exists()) {
                Files.createDirectories(pastaRaiz.toPath());
            }

            String nomeProdutoFormatado = nome.replaceAll("[^a-zA-Z0-9]", "_");
            File diretorioProduto = new File(UPLOAD_DIR + nomeProdutoFormatado);
            Files.createDirectories(diretorioProduto.toPath());

            List<ImagemProduto> imagensProduto = new ArrayList<>();
            String caminhoImagemPrincipal = "";

            if (imagens != null && !imagens.isEmpty()) {
                int i = 1;
                for (MultipartFile imagem : imagens) {
                    if (!imagem.isEmpty()) {
                        String nomeArquivo = "imagem_" + i + "_" + System.currentTimeMillis() + ".png";
                        File arquivoImagem = new File(diretorioProduto, nomeArquivo);
                        imagem.transferTo(arquivoImagem);

                        ImagemProduto imagemProduto = new ImagemProduto();
                        imagemProduto.setNome(imagem.getOriginalFilename());
                        imagemProduto.setCaminho("imagens_produto/" + nomeProdutoFormatado + "/" + nomeArquivo);
                        imagemProduto.setPadrao(i == 1);

                        imagensProduto.add(imagemProduto);

                        if (i == 1) {
                            caminhoImagemPrincipal = imagemProduto.getCaminho();
                        }

                        i++;
                    }
                }
            }

            produto.setImagemPadrao(caminhoImagemPrincipal);
            Produto produtoSalvo = service.salvarProdutoComImagens(produto, imagensProduto);
            return ResponseEntity.status(HttpStatus.CREATED).body(produtoSalvo);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/imagens/{produtoNome}/{imagemNome}")
    @ResponseBody
    public ResponseEntity<byte[]> exibirImagem(@PathVariable String produtoNome, @PathVariable String imagemNome) {
        try {
            File imagem = new File(UPLOAD_DIR + produtoNome + "/" + imagemNome);
            if (!imagem.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(Files.readAllBytes(imagem.toPath()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/ativarDesativar")
    public ResponseEntity<Produto> ativarDesativarProduto(@PathVariable Integer id) {
        Optional<Produto> produtoAtualizado = service.ativarDesativar(id);
        return produtoAtualizado.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/imagens/{produtoId}")
    public ResponseEntity<List<String>> listarImagensProduto(@PathVariable Integer produtoId) {
        return ResponseEntity.ok(service.listarImagensProduto(produtoId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(
            @PathVariable Integer id,
            @RequestBody Produto produtoAtualizado) {

        Optional<Produto> produtoExistente = service.buscarPorId(id);
        if (produtoExistente.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Produto produto = produtoExistente.get();
        produto.setNome(produtoAtualizado.getNome());
        produto.setDescricao(produtoAtualizado.getDescricao());
        produto.setPreco(produtoAtualizado.getPreco());
        produto.setQuantidadeEstoque(produtoAtualizado.getQuantidadeEstoque());
        produto.setAvaliacao(produtoAtualizado.getAvaliacao());
        // Você pode adicionar mais campos se necessário

        Produto produtoSalvo = service.salvar(produto);
        return ResponseEntity.ok(produtoSalvo);
    }

}
