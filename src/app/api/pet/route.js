/**
 * API PET - Endpoints para gerenciar dados de um pet específico
 * 
 * Rotas:
 * - GET /api/pet?animal=tutu  → Retorna dados do pet
 * - POST /api/pet             → Atualiza dados do pet (comida, remédio ou nota)
 */

import { pets, verificarReset, calcularStatus } from "@/lib/store";

/**
 * GET /api/pet?animal={nome}
 * 
 * Objetivo: Retornar os dados de um pet específico
 * 
 * Parâmetros:
 * - animal: nome do pet (ex: "tutu", "noah")
 * 
 * Retorno:
 * - 200: Objeto com dados do pet (comida, remédio, notas, etc)
 * - 400: Erro se animal for inválido ou não existir
 * 
 * Processo:
 * 1. Verifica se é necessário fazer reset diário
 * 2. Extrai o parâmetro "animal" da URL
 * 3. Valida se o animal existe no store
 * 4. Retorna os dados do pet em JSON
 */
export async function GET(req) {
  verificarReset();

  const { searchParams } = new URL(req.url);
  const animal = searchParams.get("animal");

  if (!animal || !pets[animal]) {
    return Response.json({ error: "Animal inválido" }, { status: 400 });
  }

  return Response.json(pets[animal]);
}

/**
 * POST /api/pet
 * 
 * Objetivo: Atualizar dados de um pet (adicionar comida, remédio ou nota)
 * 
 * Body esperado (JSON):
 * {
 *   animal: "tutu",          // Nome do pet
 *   tipo: "comida|remedio|nota",  // Tipo de ação
 *   texto: "anotação"        // Apenas necessário quando tipo === "nota"
 * }
 * 
 * Lógica:
 * 1. Tenta fazer parse do JSON do corpo da requisição
 * 2. Valida se o animal existe
 * 3. Incrementa comida (se não atingiu máximo)
 * 4. Incrementa remédio (se o pet tem remédio e não atingiu máximo)
 * 5. Adiciona nota à lista de notas (se texto não vazio)
 * 6. Registra timestamp de quando a ação foi feita
 * 7. Retorna os dados atualizados do pet
 * 
 * Retorno:
 * - 200: Objeto com dados atualizados do pet
 * - 400: Erro se JSON inválido ou animal inexistente
 */
export async function POST(req) {
  verificarReset();

  let body;

  // Tenta fazer parse do corpo JSON
  try {
    body = await req.json();
  } catch (error) {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { animal, tipo, texto } = body;
  const pet = pets[animal];

  if (!pet) {
    return Response.json({ error: "Animal inválido" }, { status: 400 });
  }

  // Registra timestamp da ação em formato ISO
  const agoraISO = new Date().toISOString();

  // Incrementa contador de comida (máximo 3 por dia)
  if (tipo === "comida" && pet.comida < pet.maxComida) {
    pet.comida++;
    pet.ultimoHorarioComida = agoraISO;
  }

  // Incrementa contador de remédio (máximo 2 por dia, apenas se o pet precisa)
  if (tipo === "remedio" && pet.temRemedio) {
    if (pet.remedio < pet.maxRemedio) {
      pet.remedio++;
      pet.ultimoHorarioRemedio = agoraISO;
    }
  }

  // Adiciona nova nota com timestamp formatado
  if (tipo === "nota" && texto?.trim()) {
    pet.notas.push({
      texto: texto.trim(),
      data: new Date().toLocaleString("pt-BR"),
    });
  }

  return Response.json(pet);
}
