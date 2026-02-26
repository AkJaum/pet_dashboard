/**
 * STORE.JS - Gerenciamento de Dados dos Pets
 * 
 * Este arquivo contém:
 * - Objeto com os dados de todos os pets (comida, remédio, etc)
 * - Função de reset diário (zera contadores à meia-noite)
 * - Função de cálculo de status (verifica alertas dos pets)
 */

/**
 * Objeto principal que armazena os dados de cada pet
 * - comida: contador de quantas vezes o pet comeu hoje
 * - remedio: contador de quantas vezes o pet tomou remédio
 * - ultimoHorarioComida: timestamp da última refeição
 * - ultimoHorarioRemedio: timestamp da última medicação
 * - temRemedio: booleano indicando se o pet precisa de medicação
 * - alertaSaude: booleano para alertas de saúde
 * - notas: array com anotações do usuário sobre o pet
 */
let pets = {
  tutu: {
    // Informações básicas
    dataNascimento: "2025-03-17",
    especie: "Gato",
    genero: "Macho",
    raca: "Vira-lata",
    peso: "3,4 kg",
    cor: "Branco e laranja",

    comida: 0,
    ultimoHorarioComida: null,
    maxComida: 3,

    temRemedio: true,
    remedio: 0,
    ultimoHorarioRemedio: null,
    maxRemedio: 2,

    alertaSaude: false,
    notas: []
  },

  noah: {
    // Informações básicas
    dataNascimento: "2019-07-22",
    especie: "Cachorro",
    genero: "Macho",
    raca: "Vira-lata",
    peso: "28 kg",
    cor: "Branco",

    comida: 0,
    ultimoHorarioComida: null,
    maxComida: 3,

    temRemedio: false,

    notas: []
  }
};

/**
 * Armazena o dia do último reset para controlar reset diário
 */
let ultimoReset = new Date().getDate();

/**
 * Função: verificarReset()
 * 
 * Objetivo: Resetar contadores de comida e remédio todos os dias à meia-noite
 * 
 * Lógica:
 * 1. Obtém o dia atual
 * 2. Se o dia é diferente do último reset, significa que é um novo dia
 * 3. Zera os contadores de comida e remédio para todos os pets
 * 4. Atualiza o dia do último reset
 * 
 * Chamada: Executada antes de GET e POST nas APIs
 */
function verificarReset() {
  const hoje = new Date().getDate();

  if (hoje !== ultimoReset) {
    Object.keys(pets).forEach((animal) => {
      pets[animal].comida = 0;
      pets[animal].ultimoHorarioComida = null;

      if (pets[animal].temRemedio) {
        pets[animal].remedio = 0;
        pets[animal].ultimoHorarioRemedio = null;
      }
    });

    ultimoReset = hoje;
  }
}

/**
 * Função: calcularStatus(pet)
 * 
 * Objetivo: Determinar o status de saúde do pet baseado em alertas
 * 
 * Sistema de Prioridades:
 * 🔵 Nível 1 (Máximo): Alerta de saúde genérico
 * 🟠 Nível 2: Alerta de comida (mais de 8 horas sem comer)
 * 🔴 Nível 3: Alerta de remédio (mais de 12 horas sem medicação)
 * ✅ Normal: Tudo certo
 * 
 * Retorno: Objeto com tipo do alerta e mensagem descritiva
 */
function calcularStatus(pet) {
  const agora = new Date();

  // 🔵 Prioridade máxima: saúde
  if (pet.alertaSaude) {
    return { tipo: "saude", mensagem: "Alerta de saúde 🚨" };
  }

  // 🟠 Verifica comida
  if (pet.ultimoHorarioComida) {
    const ultimaComida = new Date(pet.ultimoHorarioComida);
    const horasSemComida = (agora - ultimaComida) / 1000 / 60 / 60;

    if (horasSemComida >= 8) {
      return { tipo: "comida", mensagem: "Alerta de comida 🚨" };
    }
  }

  // 🔴 Verifica remédio
  if (pet.temRemedio && pet.ultimoHorarioRemedio) {
    const ultimoRemedio = new Date(pet.ultimoHorarioRemedio);
    const horasSemRemedio = (agora - ultimoRemedio) / 1000 / 60 / 60;

    if (horasSemRemedio >= 12) {
      return { tipo: "remedio", mensagem: "Alerta de remédio 🚨" };
    }
  }

  return { tipo: "ok", mensagem: "Tudo certo ✅" };
}

export { pets, verificarReset, calcularStatus };
