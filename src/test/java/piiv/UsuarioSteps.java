package piiv; // Verifique se este é o nome correto do seu pacote!

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.pt.*;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver; // Ou outro navegador, se preferir
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class UsuarioSteps {

    private WebDriver driver;
    private WebDriverWait wait;
    private String baseUrl = "http://localhost:8080/index.html";

    // --- Hooks do Cucumber para configurar/desmontar o navegador ---
    @Test
    @Before // Executado ANTES de cada cenário
    public void setup() {
        WebDriverManager.chromedriver().setup(); // Configura o ChromeDriver
        driver = new ChromeDriver(); // Inicializa o Chrome
        driver.manage().window().maximize(); // Maximiza a janela do navegador
        wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // Inicializa o WebDriverWait
        System.out.println("Setup: Navegador Chrome inicializado e maximizado.");
    }

    @After // Executado DEPOIS de cada cenário
    public void teardown() {
        if (driver != null) {
            driver.quit(); // Fecha o navegador
            System.out.println("Teardown: Navegador Chrome fechado.");
        }
    }

    @Dado("que o usuário está na tela de cadastro")
    public void usuario_na_tela_cadastro() {
        driver.get(baseUrl); // Navega para a URL da sua página de cadastro
        System.out.println("Acessando a página de cadastro: " + baseUrl);
        wait.until(ExpectedConditions.titleContains("Cadastro de Usuário"));
        assertTrue(driver.findElement(By.tagName("h2")).getText().contains("Cadastro de Usuário"),
                "Título H2 'Cadastro de Usuário' não encontrado na página.");
    }

    @Quando("ele preenche o formulário com nome {string}, CPF {string}, data de nascimento {string}, email {string}, senha {string} e confirme a senha {string} e grupo {string}")
    public void preenche_formulario(String nome, String cpf, String dataNascimento, String email, String senha, String confirmaSenha, String grupo) {
        System.out.println("Preenchendo formulário com: " + nome + ", " + email + "...");

        WebElement nomeInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("nome")));
        WebElement cpfInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cpf")));
        WebElement dataNascimentoInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("dataNascimento")));
        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")));
        WebElement senhaInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("senha")));
        WebElement confirmaSenhaInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("confirmaSenha")));
        WebElement grupoSelectElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("grupo")));

        nomeInput.sendKeys(nome);
        cpfInput.sendKeys(cpf);
        dataNascimentoInput.sendKeys(dataNascimento);
        emailInput.sendKeys(email);
        senhaInput.sendKeys(senha);
        confirmaSenhaInput.sendKeys(confirmaSenha); // Captura a senha de confirmação

        Select selectGrupo = new Select(grupoSelectElement);
        selectGrupo.selectByValue(grupo); // Seleciona pela 'value' (admin, estoquista)

        System.out.println("Formulário preenchido.");
    }

    @Quando("ele envia o formulário")
    public void envia_formulario() {
        System.out.println("Enviando formulário...");
        WebElement submitButton = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("button[type='submit']")));
        submitButton.click();
        System.out.println("Botão de submit clicado.");
    }

    @Então("o cadastro é realizado com sucesso e o usuário é redirecionado para a página de login")
    public void verifica_cadastro_sucesso_e_redirecionamento_login() {
        System.out.println("Verificando sucesso e redirecionamento para login...");

        wait.until(ExpectedConditions.urlContains("loginCliente.html"));
        assertTrue(driver.getCurrentUrl().contains("loginCliente.html"), "Não foi redirecionado para a página de login.");
        System.out.println("Redirecionamento para loginCliente.html verificado com sucesso.");
    }

    @Então("o sistema exibe uma mensagem de erro {string} sobre as senhas")
    public void sistema_exibe_mensagem_erro_senhas(String mensagemEsperada) {
        System.out.println("Verificando mensagem de erro de senhas...");

        WebElement senhaErroDiv = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("senhaErro")));
        assertTrue(senhaErroDiv.isDisplayed(), "Mensagem de erro de senhas ('" + mensagemEsperada + "') não está visível.");
        assertEquals(mensagemEsperada, senhaErroDiv.getText(), "Mensagem de erro de senhas incorreta.");
        System.out.println("Mensagem de erro de senhas: '" + mensagemEsperada + "' verificada.");
    }

    @Então("o sistema exibe uma mensagem de erro {string} sobre o CPF")
    public void sistema_exibe_mensagem_erro_cpf(String mensagemEsperada) {
        System.out.println("Verificando mensagem de erro de CPF...");

        WebElement cpfErroDiv = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cpfErro")));
        assertTrue(cpfErroDiv.isDisplayed(), "Mensagem de erro de CPF ('" + mensagemEsperada + "') não está visível.");
        assertEquals(mensagemEsperada, cpfErroDiv.getText(), "Mensagem de erro de CPF incorreta.");
        System.out.println("Mensagem de erro de CPF: '" + mensagemEsperada + "' verificada.");
    }
}