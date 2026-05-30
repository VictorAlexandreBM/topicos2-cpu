package org.acme.cpu.admin.services.marca;

import org.acme.cpu.admin.dto.marca.MarcaDTO;
import org.acme.cpu.admin.dto.marca.MarcaResponseDTO;
import org.acme.cpu.core.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.admin.models.Marca;

public interface MarcaService {
    RespostaPaginadaDTO<MarcaResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao);
    MarcaResponseDTO getById(Long id);
    Marca criar(MarcaDTO m);
    void atualizar(Long id, MarcaDTO m);
    void deletar(Long id);
    void alterarEstado(Long id, Boolean estado);
}