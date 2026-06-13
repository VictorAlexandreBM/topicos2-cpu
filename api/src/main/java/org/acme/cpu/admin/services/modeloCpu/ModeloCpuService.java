package org.acme.cpu.admin.services.modeloCpu;

import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuFilterDTO;
import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuListDTO;
import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuDetailDTO;
import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuRequestDTO;
import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuOpcoesForm;
import org.acme.cpu.core.dtos.respostaPaginada.RespostaPaginadaDTO;

public interface ModeloCpuService {
    RespostaPaginadaDTO<ModeloCpuListDTO> listar(Integer pagina, Integer tamanho, ModeloCpuFilterDTO filtro, String campoOrdenacao, String direcao);
    ModeloCpuDetailDTO criar(ModeloCpuRequestDTO modeloDTO);
    ModeloCpuDetailDTO get(Long id);
    void atualizar(Long id, ModeloCpuRequestDTO modeloDTO);
    void deletar(Long id);
    void alterarEstado(Long id, Boolean estado);
    ModeloCpuOpcoesForm getOpcoesForm();
}