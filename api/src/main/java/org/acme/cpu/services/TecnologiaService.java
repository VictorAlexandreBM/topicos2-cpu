package org.acme.cpu.services;

import org.acme.cpu.dto.Tecnologia.TecnologiaDTO;
import org.acme.cpu.dto.Tecnologia.TecnologiaResponseDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.models.Tecnologia;

import java.util.Set;

public interface TecnologiaService {
    public RespostaPaginadaDTO<TecnologiaResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo);
    public TecnologiaResponseDTO getById(Long id);
    public Tecnologia criar(TecnologiaDTO t);
    public void atualizar(Long id, TecnologiaDTO t);
    public void deletar(Long id);
    public void alterarEstado(Long id, Boolean estado);
}
