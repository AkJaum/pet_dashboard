/**
 * API STATUS - Endpoint para obter status de todos os pets
 * 
 * Rota:
 * - GET /api/status → Retorna status (alertas) de todos os pets
 */

import { pets, verificarReset, calcularStatus } from "@/lib/store";

/**
 * GET /api/status
 * 
 * Objetivo: Retornar um resumo do status de todos os pets
 * 
 * Retorno:
 * {
 *   "tutu": { tipo: "comida", mensagem: "Alerta de comida 🚨" },
 *   "noah": { tipo: "ok", mensagem: "Tudo certo ✅" }
 * }
 * 
 * Processo:
 * 1. Verifica se é necessário fazer reset diário
 * 2. Itera sobre todos os pets
 * 3. Para cada pet, calcula seu status (verifica alertas)
 * 4. Retorna objeto com status de cada pet
 * 
 * Usado pela: Página inicial para mostrar status dos pets
 */
export async function GET(req) {
  verificarReset();

  const resultado = {};

  // Calcula o status de cada pet
  Object.keys(pets).forEach((nome) => {
    resultado[nome] = calcularStatus(pets[nome]);
  });

  return Response.json(resultado);
}
