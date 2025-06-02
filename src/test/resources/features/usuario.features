# src/test/resources/features/usuario.feature

Feature: Cadastro de usuário

  Scenario: Usuário se cadastra com sucesso com grupo Administrador
    Given que o usuário está na tela de cadastro
    When ele preenche o formulário com nome "João Silva", CPF "123.456.789-01", data de nascimento "20-05-1990", email "joao.silva@example.com", senha "Senha@123" e confirme a senha "Senha@123" e grupo "admin"
    And ele envia o formulário
    Then o cadastro é realizado com sucesso e o usuário é redirecionado para a página de login

  Scenario: Usuário se cadastra com sucesso com grupo Estoquista
    Given que o usuário está na tela de cadastro
    When ele preenche o formulário com nome "Maria Oliveira", CPF "987.654.321-09", data de nascimento "15-08-1985", email "maria.oliveira@example.com", senha "OutraSenha#456" e confirme a senha "OutraSenha#456" e grupo "estoquista"
    And ele envia o formulário
    Then o cadastro é realizado com sucesso e o usuário é redirecionado para a página de login

  Scenario: Usuário tenta se cadastrar com CPF inválido
    Given que o usuário está na tela de cadastro
    When ele preenche o formulário com nome "Pedro Costa", CPF "123.456.789-00", data de nascimento "01-01-2000", email "pedro.costa@example.com", senha "Teste123!" e confirme a senha "Teste123!" e grupo "estoquista"
    And ele envia o formulário
    Then o sistema exibe uma mensagem de erro "CPF inválido!" sobre o CPF

  Scenario: Usuário tenta se cadastrar com senhas que não coincidem
    Given que o usuário está na tela de cadastro
    When ele preenche o formulário com nome "Ana Paula", CPF "111.222.333-44", data de nascimento "10-03-1995", email "ana.paula@example.com", senha "SenhaForte1" e confirme a senha "SenhaDiferente2" e grupo "admin"
    And ele envia o formulário
    Then o sistema exibe uma mensagem de erro "As senhas não coincidem!" sobre as senhas

  Scenario: Usuário tenta se cadastrar com email já existente
    Given que o usuário está na tela de cadastro
    When ele preenche o formulário com nome "Teste Duplicado", CPF "555.555.555-55", data de nascimento "01-01-1999", email "joao.silva@example.com", senha "Duplicado123!" e confirme a senha "Duplicado123!" e grupo "estoquista"
    And ele envia o formulário
    Then o sistema exibe uma mensagem de erro "Email já cadastrado"