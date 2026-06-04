package org.acme.cpu.cliente.services.endereco;

import org.acme.cpu.cliente.dtos.endereco.EnderecoDTO;
import org.acme.cpu.cliente.dtos.endereco.EnderecoResponseDTO;

import java.util.List;

public interface EnderecoService {
    List<EnderecoResponseDTO> listar();
    EnderecoResponseDTO buscarPorId(Long id);
    EnderecoResponseDTO criar(EnderecoDTO dto);
    EnderecoResponseDTO atualizar(Long id, EnderecoDTO dto);
    void deletar(Long id);
}