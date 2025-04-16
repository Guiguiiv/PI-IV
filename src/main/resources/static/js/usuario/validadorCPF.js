function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos e se é numérico
    if (cpf.length !== 11 || isNaN(cpf)) return false;

    // Elimina CPFs inválidos conhecidos (exemplo: 000.000.000-00)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    let primeiroDigito = resto === 10 || resto === 11 ? 0 : resto;

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    let segundoDigito = resto === 10 || resto === 11 ? 0 : resto;

    // Verifica se os dígitos calculados são iguais aos originais
    return primeiroDigito === parseInt(cpf[9]) && segundoDigito === parseInt(cpf[10]);
}

// Exemplos de uso:
console.log(validarCPF("123.456.789-09")); // false (inválido)
console.log(validarCPF("529.982.247-25")); // true (válido)
console.log(validarCPF("111.111.111-11")); // false (inválido)
