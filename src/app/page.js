/**
 * PAGE.JS - Página Inicial do Dashboard
 * 
 * Componente: Home
 * 
 * Objetivo: Exibir lista de pets com seus status (alertas)
 * Cada pet é um card em grid 2x2 que leva para a página de detalhes
 * 
 * Funcionalidades:
 * - Carrega status de todos os pets da API
 * - Busca por nome, raça, idade e gênero
 * - Exibe alertas de comida, remédio ou saúde
 * - Grid responsivo 2x2 com PetCard componente
 */

"use client";

import { useEffect, useState } from "react";
import PetCard from "./components/PetCard";
import "./page.css";

export default function Home() {
  // State para armazenar o status de todos os pets
  const [status, setStatus] = useState(null);
  
  // State para armazenar o texto da pesquisa
  const [pesquisa, setPesquisa] = useState("");

  // Lista de pets cadastrados com informações completas
  const pets = [
    { 
      id: "tutu",
      nome: "Tutu", 
      emoji: "🐱", 
      foto: "/tutu.jpeg",
      tipo: "gato",
      raca: "Vira-lata",
      genero: "Macho",
      dataNascimento: "2025-03-17"
    },
    { 
      id: "noah",
      nome: "Noah", 
      emoji: "🐶", 
      foto: "/noah.jpeg",
      tipo: "cachorro",
      raca: "Golden Retriever",
      genero: "Macho",
      dataNascimento: "2019-07-22"
    }
  ];

  /**
   * Calcula a idade do pet para usar na busca
   * Retorna string formatada com anos e/ou meses
   */
  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    
    if (meses < 0) {
      anos--;
      meses += 12;
    }
    
    if (anos === 0) {
      return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    }
    
    if (meses === 0) {
      return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    }
    
    return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  };

  /**
   * Filtra pets baseado na pesquisa
   * Procura por: nome, raça, idade e gênero
   */
  const petsFiltrados = pets.filter(pet => {
    const termo = pesquisa.toLowerCase();
    const idade = calcularIdade(pet.dataNascimento).toLowerCase();
    
    return (
      pet.nome.toLowerCase().includes(termo) ||
      pet.raca.toLowerCase().includes(termo) ||
      pet.genero.toLowerCase().includes(termo) ||
      idade.includes(termo)
    );
  });

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
      <div className="page-header">
          <h1 className="page-title">PetCare Hub 🐾</h1>
          <p>Olá {status?.usuario?.nome || "usuário"}! Você tem {pets.length} pets cadastrados.</p>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Pesquisar animal..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className="search-input"
        />
        {pesquisa && (
          <button 
            onClick={() => setPesquisa("")}
            className="search-clear"
          >
            ✕
          </button>
        )}
      </div>

      {/* GRID DE PETS FILTRADOS */}
      <p>Seus animais {pesquisa && `(${petsFiltrados.length} resultado${petsFiltrados.length !== 1 ? 's' : ''})`}</p>
      
      {petsFiltrados.length === 0 ? (
        <p className="no-results">Nenhum pet encontrado 😕</p>
      ) : (
        <div className="pets-grid">
          {petsFiltrados.map(pet => (
            <PetCard 
              key={pet.id}
              pet={{
                ...pet,
                status: status?.[pet.id]
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}