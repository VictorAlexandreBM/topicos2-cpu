package org.acme.cpu.services.chipset;

import org.acme.cpu.dto.chipset.ChipsetDTO;
import org.acme.cpu.dto.chipset.ChipsetResponseDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.models.Chipset;

public interface ChipsetService {
    RespostaPaginadaDTO<ChipsetResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao);
    ChipsetResponseDTO getById(Long id);
    Chipset criar(ChipsetDTO c);
    void atualizar(Long id, ChipsetDTO c);
    void deletar(Long id);
    void alterarEstado(Long id, Boolean estado);
}