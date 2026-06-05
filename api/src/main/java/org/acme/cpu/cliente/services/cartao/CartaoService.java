package org.acme.cpu.cliente.services.cartao;

import org.acme.cpu.cliente.dtos.cartao.CartaoDTO;
import org.acme.cpu.cliente.dtos.cartao.CartaoResponseDTO;

import java.util.List;

public interface CartaoService {
    List<CartaoResponseDTO> listar();
    CartaoResponseDTO criar(CartaoDTO dto);
    void deletar(Long id);
}