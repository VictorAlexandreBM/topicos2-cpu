package org.acme.cpu.services.tecnologia;

import org.acme.cpu.dto.tecnologia.TecnologiaDTO;
import org.acme.cpu.dto.tecnologia.TecnologiaResponseDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.models.Tecnologia;

public interface TecnologiaService {
    public RespostaPaginadaDTO<TecnologiaResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao);
    public TecnologiaResponseDTO getById(Long id);
    public Tecnologia criar(TecnologiaDTO t);
    public void atualizar(Long id, TecnologiaDTO t);
    public void deletar(Long id);
    public void alterarEstado(Long id, Boolean estado);
}
