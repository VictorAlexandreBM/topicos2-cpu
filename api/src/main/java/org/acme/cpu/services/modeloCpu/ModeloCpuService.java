package org.acme.cpu.services.modeloCpu;

import org.acme.cpu.dto.modeloCpu.ModeloCpuDetailDTO;
import org.acme.cpu.dto.modeloCpu.ModeloCpuListDTO;
import org.acme.cpu.dto.modeloCpu.ModeloCpuRequestDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;

public interface ModeloCpuService {
    RespostaPaginadaDTO<ModeloCpuListDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao);
    ModeloCpuDetailDTO criar(ModeloCpuRequestDTO dto);
    ModeloCpuDetailDTO get(Long id);
    void atualizar(Long id, ModeloCpuRequestDTO dto);
    void deletar(Long id);
    void alterarEstado(Long id, Boolean estado);
}
