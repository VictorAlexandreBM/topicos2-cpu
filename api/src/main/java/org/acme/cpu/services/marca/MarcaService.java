package org.acme.cpu.services.marca;

import org.acme.cpu.dto.marca.MarcaDTO;
import org.acme.cpu.dto.marca.MarcaResponseDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.models.Marca;

public interface MarcaService {
    RespostaPaginadaDTO<MarcaResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao);
    MarcaResponseDTO getById(Long id);
    Marca criar(MarcaDTO m);
    void atualizar(Long id, MarcaDTO m);
    void deletar(Long id);
    void alterarEstado(Long id, Boolean estado);
}