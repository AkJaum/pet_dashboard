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

    // State para controlar qual aba está ativa ("monitoramento" ou "notas")
    const [abaAtiva, setAbaAtiva] = useState("monitoramento");

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
            {/* HEADER COM INFORMAÇÕES DO PET */}
            <div className="pet-header">
                <div className="pet-header-buttons">
                    <Link href="/">← Voltar</Link>
                    <div>
                        
                    </div>
                </div>
                <div className="pet-header-info">
                    <div className="pet-profile">
                    <img src={`/${animal}.jpeg`} alt={animal} className="pet-header-image" />
                        <div className="pet-header-text">
                            <h1>{animal.toUpperCase()}</h1>
                            <div className="pet-tags">
                                <span className="pet-tag pet-tag-especie">{pet.especie || "Não informado"}</span>
                                <span className="pet-tag pet-tag-raca">{pet.raca || "Não informado"}</span>
                                <span className="pet-tag pet-tag-genero">{pet.genero || "Não informado"}</span>
                                <span className="pet-tag pet-tag-idade">{idadeFormatada}</span>
                            </div>
                        </div>
                    </div>
                    <div className="pet-details">
                        <div className="pet-detail-item">
                            <span className="pet-detail-label">Data de Nascimento</span>
                            <span className="pet-detail-value">{dataNascimentoFormatada}</span>
                        </div>
                        <div className="pet-detail-item">
                            <span className="pet-detail-label">Cor</span>
                            <span className="pet-detail-value">{pet.cor || "Não informado"}</span>
                        </div>
                        <div className="pet-detail-item">
                            <span className="pet-detail-label">Peso</span>
                            <span className="pet-detail-value">{pet.peso || "Não informado"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTEÚDO PRINCIPAL COM ABAS */}
            <div className="pet-content">
                {/* BOTÕES DE NAVEGAÇÃO DAS ABAS */}
                <div className="pet-tabs-nav">
                    <button
                        className={`tab-button ${abaAtiva === "monitoramento" ? "active" : ""}`}
                        onClick={() => setAbaAtiva("monitoramento")}
                    >
                        📊 Monitoramento
                    </button>
                    <button
                        className={`tab-button ${abaAtiva === "notas" ? "active" : ""}`}
                        onClick={() => setAbaAtiva("notas")}
                    >
                        📝 Saúde
                    </button>
                                        <button
                        className={`tab-button ${abaAtiva === "saude" ? "active" : ""}`}
                        onClick={() => setAbaAtiva("saude")}
                    >
                        📝 Vacinas
                    </button>
                                        <button
                        className={`tab-button ${abaAtiva === "vacinas" ? "active" : ""}`}
                        onClick={() => setAbaAtiva("vacinas")}
                    >
                        📝 Notas
                    </button>
                </div>

                {/* CONTEÚDO DAS ABAS */}
                <div className="pet-tabs-content">
                    {/* ABA 1: MONITORAMENTO */}
                    {abaAtiva === "monitoramento" && (
                        <div className="pet-tab-pane">
                            {/* SEÇÃO DE COMIDA */}
                            <h2>Comida</h2>
                            <p className="food-counter">
                                {Array.from({ length: pet.maxComida }).map((_, i) => (
                                    <span key={i} className={`food-icon ${i < pet.comida ? "eaten" : "not-eaten"}`}>
                                        🥩
                                    </span>
                                ))}
                            </p>
                            <p>
                                Última refeição:{" "}
                                {pet.ultimoHorarioComida
                                    ? new Date(pet.ultimoHorarioComida).toLocaleString("pt-BR")
                                    : "Nenhuma ainda"}
                            </p>
                            <button onClick={() => adicionar("comida")}>
                                + Comida
                            </button>

                            {/* SEÇÃO DE REMÉDIO */}
                            {pet.temRemedio && (
                                <>
                                    <h2>Remédio</h2>
                                    <p className="medicine-counter">
                                        {Array.from({ length: pet.maxRemedio }).map((_, i) => (
                                            <span key={i} className={`medicine-icon ${i < pet.remedio ? "taken" : "not-taken"}`}>
                                                💊
                                            </span>
                                        ))}
                                    </p>
                                    <p>
                                        Última medicação:{" "}
                                        {pet.ultimoHorarioRemedio
                                            ? new Date(pet.ultimoHorarioRemedio).toLocaleString("pt-BR")
                                            : "Nenhuma ainda"}
                                    </p>
                                    <button onClick={() => adicionar("remedio")}>
                                        + Remédio
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* ABA 2: NOTAS */}
                    {abaAtiva === "notas" && (
                        <div className="pet-tab-pane">
                            <h2>Notas</h2>
                            <div className="note-input-section">
                                <input
                                    type="text"
                                    value={novaNota}
                                    onChange={(e) => setNovaNota(e.target.value)}
                                    placeholder="Digite uma nova nota..."
                                />
                                <button
                                    onClick={() => adicionar("nota", novaNota)}
                                    disabled={!novaNota.trim()}
                                >
                                    Adicionar Nota
                                </button>
                            </div>
                            <ul>
                                {pet.notas?.map((nota, index) => (
                                    <li key={index}>
                                        {nota.data} - {nota.texto}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
