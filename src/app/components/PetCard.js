'use client';

import Link from 'next/link';
import './PetCard.css';

/**
 * Componente de card para exibir informações resumidas de um animal
 * 
 * @param {Object} pet - Objeto com informações do pet
 * @param {string} pet.id - Identificador único do animal
 * @param {string} pet.nome - Nome do animal
 * @param {string} pet.tipo - Tipo (gato/cachorro)
 * @param {string} pet.foto - Caminho da foto
 * @param {string} pet.raca - Raça do animal
 * @param {string} pet.genero - Gênero do animal
 * @param {string} pet.dataNascimento - Data de nascimento (YYYY-MM-DD)
 * @param {Object} pet.status - Status de alertas
 */
export default function PetCard({ pet }) {
  /**
   * Calcula a idade do pet com base na data de nascimento
   * Retorna string formatada com anos e/ou meses
   */
  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    
    // Ajusta se ainda não fez aniversário no ano
    if (meses < 0) {
      anos--;
      meses += 12;
    }
    
    // Se tem menos de 1 ano, mostra só meses
    if (anos === 0) {
      return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    }
    
    // Se tem anos completos sem meses extras
    if (meses === 0) {
      return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    }
    
    // Mostra anos e meses
    return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  };

  const idade = calcularIdade(pet.dataNascimento);

  return (
    <Link href={`/pet/${pet.id}`} className="pet-card-link">
      <div className="pet-card">
        {/* Foto do animal */}
        <img 
          src={pet.foto} 
          alt={pet.nome} 
          className="pet-card-foto"
        />
        
        {/* Informações do animal */}
        <div className="pet-card-info">
          <h2 className="pet-card-nome">{pet.nome}</h2>
          
          {/* Tags com informações adicionais */}
          <div className="pet-card-tags">
            <span className="tag tag-raca">{pet.raca}</span>
            <span className="tag tag-idade">{idade}</span>
            <span className="tag tag-genero">{pet.genero}</span>
          </div>

          {/* Alertas se houver */}
          {pet.status && pet.status.alertas && pet.status.alertas.length > 0 && (
            <div className="pet-card-alertas">
              {pet.status.alertas.map((alerta, index) => (
                <span key={index} className="alerta">{alerta}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
