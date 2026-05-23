package org.acme.cpu.services.cpu;

import org.acme.cpu.dto.cpu.CpuDetailDTO;
import org.acme.cpu.dto.cpu.CpuListDTO;
import org.acme.cpu.dto.cpu.CpuRequestDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;

public interface CpuService {
    RespostaPaginadaDTO<CpuListDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean emVenda, String campoOrdenacao, String direcao);
    CpuDetailDTO criar(CpuRequestDTO dto);
    CpuDetailDTO get(Long id);
    void atualizar(Long id, CpuRequestDTO dto);
    void deletar(Long id);
    void alterarEstadoVenda(Long id, Boolean estado);
}