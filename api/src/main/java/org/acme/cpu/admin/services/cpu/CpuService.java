package org.acme.cpu.admin.services.cpu;

import org.acme.cpu.admin.dto.cpu.CpuDetailDTO;
import org.acme.cpu.admin.dto.cpu.CpuFilterDTO;
import org.acme.cpu.admin.dto.cpu.CpuListDTO;
import org.acme.cpu.admin.dto.cpu.CpuRequestDTO;
import org.acme.cpu.core.dto.respostaPaginada.RespostaPaginadaDTO;

public interface CpuService {
    RespostaPaginadaDTO<CpuListDTO> listar(Integer pagina, Integer tamanho, CpuFilterDTO filtro, String campoOrdenacao, String direcao);
    CpuDetailDTO criar(CpuRequestDTO dto);
    CpuDetailDTO get(Long id);
    void atualizar(Long id, CpuRequestDTO dto);
    void deletar(Long id);
    void alterarEstadoVenda(Long id, Boolean estado);
}