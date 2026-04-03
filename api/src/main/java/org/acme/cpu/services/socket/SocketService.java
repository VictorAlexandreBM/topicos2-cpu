package org.acme.cpu.services.socket;

import org.acme.cpu.dto.socket.SocketDTO;
import org.acme.cpu.dto.socket.SocketResponseDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.models.Socket;

public interface SocketService {
    RespostaPaginadaDTO<SocketResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao);
    SocketResponseDTO getById(Long id);
    Socket criar(SocketDTO t);
    void atualizar(Long id, SocketDTO t);
    void deletar(Long id);
    void alterarEstado(Long id, Boolean estado);
}