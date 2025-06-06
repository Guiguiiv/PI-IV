import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.time.Duration;

import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.JavascriptExecutor;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class LojaVirtual {

    private WebDriver driver;
    private WebDriverWait wait;

    @Before
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get("http://localhost:63342/PI-IV/templates/usuario/cadastrarUsuario.html?_ijt=tdkfmvad6pfbsmd83u2tg3det3");
        System.out.println("Setup finalizado: navegador aberto e página inicial carregada.");
        esperar(2000);
    }

    @Test
    public void testFluxoCompletoDeCompra() {
        testAdicionarProdutosAoCarrinhoComAlert();
        preencherDadosDeEntregaEFrete();
        fazerLogin();
        testCheckoutSelecionarBoletoEPrimeiroEndereco();
        finalizarPedido();
        verificarPedido();
    }

    @Test
    public void testPaginaInicial() {
        assertEquals("Loja Virtual", driver.getTitle());
        System.out.println("Título da página verificado com sucesso.");
        esperar(3000);

        WebElement btnLogin = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("a[href*='loginCliente.html']")));
        assertTrue(btnLogin.isDisplayed());
        System.out.println("Botão Login/Cadastro está visível.");
        btnLogin.click();
        System.out.println("Clique no botão Login/Cadastro realizado.");
        esperar(3000);

        driver.navigate().back();
        System.out.println("Navegou de volta para a página inicial.");
        esperar(3000);

        WebElement btnCarrinho = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("a[href*='carrinhoNaoLogado.html']")));
        assertTrue(btnCarrinho.isDisplayed());
        System.out.println("Botão Carrinho está visível.");
        btnCarrinho.click();
        System.out.println("Clique no botão Carrinho realizado.");
        esperar(3000);
    }


    @Test
    public void testAdicionarProdutosAoCarrinhoComAlert() {
        // Espera os produtos aparecerem na lista (ao menos 2)
        wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#listaProdutos .col"), 1));
        esperar(2000);

        // ---------- Adiciona o primeiro produto ----------
        WebElement primeiroCard = driver.findElement(By.cssSelector("#listaProdutos .col:nth-child(1) .card"));
        WebElement btnVisualizarPrimeiro = primeiroCard.findElement(By.cssSelector("button.btn-info"));
        btnVisualizarPrimeiro.click();
        System.out.println("Modal do primeiro produto aberto.");
        esperar(2000);

        WebElement btnAdicionar = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("#modalVisualizarProduto .btn-success")));
        btnAdicionar.click();
        System.out.println("Clique em adicionar primeiro produto.");
        esperar(2000);

        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();
        System.out.println("Alert do primeiro produto aceito.");
        esperar(2000);

        WebElement btnFecharModal = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("#modalVisualizarProduto button.btn-close")));
        btnFecharModal.click();
        esperar(2000);

        // ---------- Adiciona o segundo produto ----------
        WebElement segundoCard = driver.findElement(By.cssSelector("#listaProdutos .col:nth-child(2) .card"));
        WebElement btnVisualizarSegundo = segundoCard.findElement(By.cssSelector("button.btn-info"));
        btnVisualizarSegundo.click();
        System.out.println("Modal do segundo produto aberto.");
        esperar(2000);

        btnAdicionar = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("#modalVisualizarProduto .btn-success")));
        btnAdicionar.click();
        System.out.println("Clique em adicionar segundo produto.");
        esperar(2000);

        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();
        System.out.println("Alert do segundo produto aceito.");
        esperar(2000);

        btnFecharModal = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("#modalVisualizarProduto button.btn-close")));
        btnFecharModal.click();
        esperar(2000);

        // ---------- Navega até o carrinho ----------
        WebElement btnCarrinho = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("a[href*='carrinhoNaoLogado.html']")));
        btnCarrinho.click();
        System.out.println("Navegou para a página do carrinho.");
        esperar(2000);

        // Garante que a URL mudou
        wait.until(ExpectedConditions.urlContains("carrinhoNaoLogado.html"));

        // Espera os itens carregarem (mínimo 2 linhas na tabela do carrinho)
        wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#carrinhoTabela tr"), 1));

        // Captura os itens da tabela
        List<WebElement> itensCarrinho = driver.findElements(By.cssSelector("#carrinhoTabela tr"));
        assertTrue("Carrinho deve conter pelo menos 2 itens", itensCarrinho.size() >= 2);
        System.out.println("Encontrados " + itensCarrinho.size() + " itens no carrinho.");
        esperar(2000);
    }

    @Test
    public void preencherDadosDeEntregaEFrete() {
        // Preenche o campo de CEP
        WebElement cepInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cep")));
        cepInput.clear();
        cepInput.sendKeys("12345-678");
        System.out.println("CEP preenchido.");
        esperar(2000);

        // Seleciona a opção de frete "Padrão (R$ 20,00)"
        WebElement freteSelect = wait.until(ExpectedConditions.elementToBeClickable(By.id("frete")));
        Select selectFrete = new Select(freteSelect);
        selectFrete.selectByValue("20");
        System.out.println("Frete 'Padrão' selecionado.");
        esperar(2000);

        // Aguarda o botão de finalizar compra ficar clicável
        WebElement btnFinalizar = wait.until(ExpectedConditions.elementToBeClickable(By.id("finalizarCompraBtn")));
        btnFinalizar.click();
        System.out.println("Clique no botão Finalizar Compra.");
        esperar(2000);
    }

    @Test
    public void fazerLogin() {
        WebDriverWait waitAlert = new WebDriverWait(driver, Duration.ofSeconds(2));

        try {
            waitAlert.until(ExpectedConditions.alertIsPresent());
            driver.switchTo().alert().accept();
            System.out.println("Alert aceito.");
            esperar(2000);

            wait.until(ExpectedConditions.not(ExpectedConditions.alertIsPresent()));
        } catch (TimeoutException e) {
            System.out.println("Nenhum alert presente antes do login.");
        }

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")));

        WebElement inputEmail = driver.findElement(By.id("email"));
        inputEmail.clear();
        inputEmail.sendKeys("adm@gmail.com");
        System.out.println("Email preenchido.");
        esperar(2000);

        WebElement inputSenha = driver.findElement(By.id("senha"));
        inputSenha.clear();
        inputSenha.sendKeys("1234");
        System.out.println("Senha preenchida.");
        esperar(2000);

        WebElement btnEntrar = driver.findElement(By.cssSelector("button[type='submit']"));
        btnEntrar.click();
        System.out.println("Botão entrar clicado.");
        esperar(2000);

        // Aguarda e aceita alert pós-login
        try {
            WebDriverWait waitAlertLogin = new WebDriverWait(driver, Duration.ofSeconds(5));
            waitAlertLogin.until(ExpectedConditions.alertIsPresent());
            driver.switchTo().alert().accept();
            System.out.println("Alert pós-login aceito.");
            esperar(2000);
        } catch (TimeoutException e) {
            System.out.println("Nenhum alert pós-login apareceu.");
        }

        wait.until(ExpectedConditions.urlContains("checkout.html"));
        System.out.println("Login realizado com sucesso!");
        esperar(2000);
    }

    @Test
    public void testCheckoutSelecionarBoletoEPrimeiroEndereco() {
        // Espera a página carregar título ou elemento principal (pode ajustar se quiser)
        wait.until(ExpectedConditions.titleContains("Checkout"));
        esperar(2000);

        // Seleciona o primeiro endereço válido (index 1, pois 0 é o placeholder)
        WebElement selectEndereco = wait.until(ExpectedConditions.elementToBeClickable(By.id("enderecoEntrega")));
        Select enderecoSelect = new Select(selectEndereco);

        // Garante que tem opções suficientes
        List<WebElement> opcoesEndereco = enderecoSelect.getOptions();
        assertTrue("Deve ter pelo menos uma opção de endereço além do placeholder", opcoesEndereco.size() > 1);

        enderecoSelect.selectByIndex(1);
        System.out.println("Primeira opção de endereço selecionada: " + enderecoSelect.getFirstSelectedOption().getText());
        esperar(2000);

        // Seleciona o pagamento boleto
        WebElement radioBoleto = wait.until(ExpectedConditions.elementToBeClickable(By.id("boleto")));
        radioBoleto.click();
        System.out.println("Opção 'Boleto' selecionada.");
        esperar(2000);

        // Confirma que o bloco de dados do cartão permanece escondido
        WebElement dadosCartaoDiv = driver.findElement(By.id("dadosCartao"));
        assertTrue("Dados do cartão devem estar ocultos para boleto", dadosCartaoDiv.getAttribute("class").contains("d-none"));

        // Clica no botão Confirmar Pedido
        WebElement btnConfirmar = wait.until(ExpectedConditions.elementToBeClickable(By.id("confirmarPedidoBtn")));
        Actions actions = new Actions(driver);
        actions.moveToElement(btnConfirmar).click().perform();
        System.out.println("Botão Confirmar Pedido clicado.");
        esperar(2000);

        // Aqui você pode adicionar uma espera/validação da ação pós clique, ex:
        wait.until(ExpectedConditions.urlContains("resumoPedido.html"));
    }

    @Test
    public void finalizarPedido() {
        WebElement btnFinalizar = wait.until(ExpectedConditions.elementToBeClickable(By.id("finalizarPedidoBtn")));

        // Clica no botão para finalizar o pedido
        btnFinalizar.click();
        System.out.println("Botão finalizar pedido clicado.");
        esperar(2000);

        // Espera o alert aparecer e aceita ele
        try {
            wait.until(ExpectedConditions.alertIsPresent());
            driver.switchTo().alert().accept();
            System.out.println("Alert 'Pedido finalizado com sucesso!' aceito.");
            esperar(2000);
        } catch (TimeoutException e) {
            System.out.println("Nenhum alert apareceu após finalizar pedido.");
        }

        // Aguardar alguma condição depois do alert, por exemplo a URL de confirmação
        wait.until(ExpectedConditions.urlContains("confirmacao.html"));
        System.out.println("Pedido finalizado com sucesso e página confirmada.");
        esperar(2000);
    }

    public void verificarPedido() {
        // Espera estar na tela de confirmação e clica no botão de configurações
        wait.until(ExpectedConditions.urlContains("confirmacao.html"));
        WebElement btnConfiguracoes = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("a[title='Configurações']")));
        btnConfiguracoes.click();
        System.out.println("Botão Configurações clicado.");
        esperar(2000);

        // Aguarda a página de sessão do cliente carregar
        wait.until(ExpectedConditions.urlContains("sessaoEndereco.html"));
        esperar(2000);

        // Clica no link "Meus Pedidos"
        WebElement linkMeusPedidos = wait.until(ExpectedConditions.elementToBeClickable(
                By.linkText("Meus Pedidos")));
        linkMeusPedidos.click();
        System.out.println("Link 'Meus Pedidos' clicado.");
        esperar(2000);

        // Aguarda a página de pedidos ser carregada
        wait.until(ExpectedConditions.urlContains("visualizarPedidos.html"));
        esperar(2000);

        // Scrolla até o final da página
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        System.out.println("Scroll realizado até o final da página.");
        esperar(2000);
    }

    @After
    public void tearDown() {
        esperar(1000);
        if (driver != null) {
            driver.quit();
            System.out.println("Navegador fechado. Teste finalizado.");
        }
    }

    // Método utilitário para pausas
    private void esperar(long milissegundos) {
        try {
            Thread.sleep(milissegundos);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Espera interrompida.");
        }
    }
}
