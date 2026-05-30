package org.acme.cpu.admin.services.modeloCpu;

import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuDetailDTO;
import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuListDTO;
import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuOpcoesForm;
import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuRequestDTO;
import org.acme.cpu.core.dto.respostaPaginada.RespostaPaginadaDTO;

public interface ModeloCpuService {
    RespostaPaginadaDTO<ModeloCpuListDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao);
    ModeloCpuDetailDTO criar(ModeloCpuRequestDTO dto);
    ModeloCpuDetailDTO get(Long id);
    void atualizar(Long id, ModeloCpuRequestDTO dto);
    void deletar(Long id);
    void alterarEstado(Long id, Boolean estado);
    ModeloCpuOpcoesForm getOpcoesForm();
}
