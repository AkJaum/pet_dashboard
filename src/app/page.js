/**
 * PAGE.JS - Página Inicial do Dashboard
 * 
 * Componente: Home
 * 
 * Objetivo: Exibir lista de pets com seus status (alertas)
 * Cada pet é um botão que leva para a página de detalhes
 * 
 * Funcionalidades:
 * - Carrega status de todos os pets da API
 * - Atualiza status a cada 1 minuto (60.000ms)
 * - Exibe alertas de comida, remédio ou saúde
 * - Links para páginas individuais de cada pet
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./page.css";

export default function Home() {
  // State para armazenar o status de todos os pets
  const [status, setStatus] = useState(null);

  /**
   * Função: carregarStatus()
   * 
   * Objetivo: Buscar o status de todos os pets da API
   * 
   * Processo:
   * 1. Faz request GET para /api/status
   * 2. Valida se a resposta foi bem-sucedida
   * 3. Converte JSON e armazena no state
   * 4. Captura erros e loga no console
   */
  async function carregarStatus() {
    try {
      const res = await fetch("/api/status");
      
      if (!res.ok) {
        console.error("Erro ao carregar status:", res.status);
        return;
      }
      
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error("Erro ao buscar status:", error);
    }
  }

  /**
   * useEffect - Executa quando o componente monta
   * 
   * 1. Carrega o status inicial dos pets
   * 2. Configura um intervalo para atualizar a cada 1 minuto
   * 3. Limpa o intervalo quando o componente desmonta (cleanup)
   */
  useEffect(() => {
    carregarStatus();
    const interval = setInterval(carregarStatus, 60000); // 60 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <h1>Monitoramento dos Pimpolinhos 🐾</h1>

      {/* CARD DO TUTU */}
      <div className="pet-card">
        <Link href="/pet/tutu" className="pet-link">
          <div className="pet-image">
            <img
              src="/tutu.jpeg"
              alt="Tutu"
            />
          </div>
          <h2 className="pet-name">Tutu 🐱</h2>
        </Link>
        {/* Exibe status do pet se disponível */}
        {status?.tutu && (
          <p className={`pet-status ${status.tutu.tipo}`}>
            Status: {status.tutu.mensagem}
          </p>
        )}
      </div>

      {/* CARD DO NOAH */}
      <div className="pet-card">
        <Link href="/pet/noah" className="pet-link">
          <div className="pet-image">
            <img
              src="/noah.jpeg"
              alt="Noah"
            />
          </div>
          <h2 className="pet-name">Noah 🐶</h2>
        </Link>
        {/* Exibe status do pet se disponível */}
        {status?.noah && (
          <p className={`pet-status ${status.noah.tipo}`}>
            Status: {status.noah.mensagem}
          </p>
        )}
      </div>
    </div>
  );
}