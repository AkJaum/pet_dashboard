/**
 * [ANIMAL]/PAGE.JS - Página de Detalhes de um Pet
 * 
 * Componente: PetPage
 * 
 * Objetivo: Exibir detalhes completos de um pet específico e permitir:
 * - Registrar comida dada ao pet
 * - Registrar medicação do pet
 * - Adicionar notas sobre o pet
 * 
 * Rota dinâmica: /pet/[animal] → /pet/tutu ou /pet/noah
 */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./page.css";

export default function PetPage() {
    // Extrai o parâmetro dinâmico "animal" da URL
    const { animal } = useParams();

    // State para armazenar dados do pet
    const [pet, setPet] = useState(null);

    // State para controlar o valor do input de nova nota
    const [novaNota, setNovaNota] = useState("");

    /**
     * Função: carregar()
     * 
     * Objetivo: Buscar dados atualizados do pet da API
     * 
     * Processo:
     * 1. Valida se o parâmetro "animal" está disponível
     * 2. Faz request GET para /api/pet?animal={nome}
     * 3. Valida se a resposta foi bem-sucedida
     * 4. Converte JSON e atualiza o state
     * 5. Trata erros silenciosamente (não quebra a UI)
     * 
     * Chamada: No useEffect inicial e após adicionar comida/remédio/nota
     */
    async function carregar() {
        if (!animal) return;

        try {
            const res = await fetch(`/api/pet?animal=${animal}`);

            if (!res.ok) {
                console.error("Erro ao carregar pet:", res.status);
                return;
            }

            const data = await res.json();
            setPet(data);
        } catch (error) {
            console.error("Erro ao buscar pet:", error);
        }
    }

    /**
     * Função: adicionar(tipo, texto)
     * 
     * Objetivo: Enviar uma ação para o backend (comida, remédio ou nota)
     * 
     * Parâmetros:
     * - tipo: "comida" | "remedio" | "nota"
     * - texto: (opcional) conteúdo da nota
     * 
     * Processo:
     * 1. Faz POST para /api/pet com os dados
     * 2. Limpa o campo de nota
     * 3. Recarrega os dados do pet para refletir a mudança
     * 
     * Chamada: Quando o usuário clica em botões de comida/remédio ou adiciona nota
     */
    async function adicionar(tipo, texto = null) {
        await fetch("/api/pet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ animal, tipo, texto }),
        });

        setNovaNota("");
        carregar();
    }

    /**
     * useEffect - Executa quando o componente monta e quando 'animal' muda
     * 
     * Objetivo: Carregar dados do pet quando a rota dinâmica é acessada
     * 
     * Proteção: Só faz fetch se 'animal' existe (evita requisições inválidas)
     */
    useEffect(() => {
        if (animal) {
            carregar();
        }
    }, [animal]);

    /**
     * Função: calcularIdade()
     * 
     * Objetivo: Calcular a idade do pet baseado na data de nascimento
     * 
     * Processo:
     * 1. Converte dataNascimento para objeto Date
     * 2. Calcula diferença em anos, meses e dias
     * 3. Retorna string formatada (ex: "4 anos, 3 meses")
     */
    function calcularIdade() {
        if (!pet || !pet.dataNascimento) return "Desconhecida";
        
        const nascimento = new Date(pet.dataNascimento);
        const hoje = new Date();
        
        let anos = hoje.getFullYear() - nascimento.getFullYear();
        let meses = hoje.getMonth() - nascimento.getMonth();
        
        // Ajusta se o mês ainda não chegou
        if (meses < 0) {
            anos--;
            meses += 12;
        }
        
        if (anos > 0) {
            return `${anos} ${anos === 1 ? "ano" : "anos"}, ${meses} ${meses === 1 ? "mês" : "meses"}`;
        } else {
            return `${meses} ${meses === 1 ? "mês" : "meses"}`;
        }
    }

    /**
     * Função: formatarData()
     * 
     * Objetivo: Formatar data de nascimento para formato pt-BR
     */
    function formatarData(dataISO) {
        if (!dataISO) return "Desconhecida";
        const data = new Date(dataISO + "T00:00:00");
        return data.toLocaleDateString("pt-BR");
    }

    // Exibe mensagem de carregamento enquanto os dados estão sendo buscados
    if (!pet) return <div>Carregando...</div>;

    // Calcula dados para exibição APÓS verificar se pet existe
    const idadeFormatada = calcularIdade();
    const dataNascimentoFormatada = formatarData(pet.dataNascimento);

    return (
        <div className="pet-detail-container">
            {/* LINK PARA VOLTAR À HOME */}
            <Link href="/">← Voltar</Link>

            {/* HEADER COM INFORMAÇÕES DO PET */}
            <div className="pet-header">
                <img src={`/${animal}.jpeg`} alt={animal} className="pet-header-image" />
                <div className="pet-header-info">
                    <h1>{animal.toUpperCase()}</h1>
                    <div className="pet-details">
                        <div className="pet-detail-item">
                            <span className="pet-detail-label">Data de Nascimento</span>
                            <span className="pet-detail-value">{dataNascimentoFormatada}</span>
                        </div>
                        <div className="pet-detail-item">
                            <span className="pet-detail-label">Idade</span>
                            <span className="pet-detail-value">{idadeFormatada}</span>
                        </div>
                        <div className="pet-detail-item">
                            <span className="pet-detail-label">Gênero</span>
                            <span className="pet-detail-value">{pet.genero}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTEÚDO PRINCIPAL (Duas Colunas) */}
            <div className="pet-content">
                {/* COLUNA 1: COMIDA E REMÉDIO (60%) */}
                <div className="pet-section-food">

                {/* SEÇÃO DE COMIDA */}
                <h2>Comida</h2>
                {/* Exibe progresso de comida com emojis de pote de ração */}
                <p className="food-counter">
                    {Array.from({ length: pet.maxComida }).map((_, i) => (
                        <span key={i} className={`food-icon ${i < pet.comida ? "eaten" : "not-eaten"}`}>
                            🥩
                        </span>
                    ))}
                </p>
                {/* Exibe data/hora da última refeição */}
                <p>
                    Última refeição:{" "}
                    {pet.ultimoHorarioComida
                        ? new Date(pet.ultimoHorarioComida).toLocaleString("pt-BR")
                        : "Nenhuma ainda"}
                </p>

                {/* Botão para registrar comida */}
                <button onClick={() => adicionar("comida")}>
                    + Comida
                </button>

                {/* SEÇÃO DE REMÉDIO (apenas se o pet precisa de medicação) */}
                {pet.temRemedio && (
                    <>
                        <h2>Remédio</h2>
                        {/* Exibe progresso de remédio (ex: 1/2) */}
                        <p className="medicine-counter">
                            {Array.from({ length: pet.maxRemedio }).map((_, i) => (
                                <span key={i} className={`medicine-icon ${i < pet.remedio ? "taken" : "not-taken"}`}>
                                    💊
                                </span>
                            ))}
                        </p>
                        {/* Exibe data/hora da última medicação */}
                        <p>
                            Última medicação:{" "}
                            {pet.ultimoHorarioRemedio
                                ? new Date(pet.ultimoHorarioRemedio).toLocaleString("pt-BR")
                                : "Nenhuma ainda"}
                        </p>

                        {/* Botão para registrar medicação */}
                        <button onClick={() => adicionar("remedio")}>
                            + Remédio
                        </button>
                    </>
                )}
                </div>

                {/* COLUNA 2: NOTAS (40%) */}
                <div className="pet-section-notes">
                    {/* SEÇÃO DE NOTAS */}
                    <h2>Notas</h2>

                    {/* INPUT PARA ADICIONAR NOVA NOTA */}
                    <div className="note-input-section">
                        <input
                            type="text"
                            value={novaNota}
                            onChange={(e) => setNovaNota(e.target.value)}
                            placeholder="Digite uma nova nota..."
                        />

                        {/* Botão desabilitado se o campo estiver vazio */}
                        <button
                            onClick={() => adicionar("nota", novaNota)}
                            disabled={!novaNota.trim()}
                        >
                            Adicionar Nota
                        </button>
                    </div>

                    {/* LISTA DE NOTAS ANTERIORES */}
                    <ul>
                        {pet.notas?.map((nota, index) => (
                            <li key={index}>
                                {/* Exibe data e conteúdo da nota */}
                                {nota.data} - {nota.texto}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
