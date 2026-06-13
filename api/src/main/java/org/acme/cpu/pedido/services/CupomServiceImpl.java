package org.acme.cpu.pedido.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.core.exception.ValidationException;
import org.acme.cpu.pedido.dtos.cupom.CupomRequestDTO;
import org.acme.cpu.pedido.dtos.cupom.CupomResponseDTO;
import org.acme.cpu.pedido.models.Cupom;
import org.acme.cpu.pedido.repository.CupomRepository;

import java.util.List;

@ApplicationScoped
public class CupomServiceImpl {

    @Inject
    CupomRepository repository;

    public List<CupomResponseDTO> listar() {
        return repository.listarTodos().stream().map(CupomResponseDTO::new).toList();
    }

    public CupomResponseDTO getById(Long id) {
        Cupom cupom = repository.findById(id);
        if (cupom == null) throw new NotFoundException("Cupom não encontrado.");
        return new CupomResponseDTO(cupom);
    }

    @Transactional
    public CupomResponseDTO criar(CupomRequestDTO dto) {
        validarCodigoUnico(dto.codigo(), null);

        Cupom cupom = new Cupom();
        aplicarDtoNaEntidade(cupom, dto);

        repository.persist(cupom);
        return new CupomResponseDTO(cupom);
    }

    @Transactional
    public CupomResponseDTO atualizar(Long id, CupomRequestDTO dto) {
        Cupom cupom = repository.findById(id);
        if (cupom == null) throw new NotFoundException("Cupom não encontrado.");

        validarCodigoUnico(dto.codigo(), id);
        aplicarDtoNaEntidade(cupom, dto);

        return new CupomResponseDTO(cupom);
    }

    @Transactional
    public void deletar(Long id) {
        Cupom cupom = repository.findById(id);
        if (cupom == null) throw new NotFoundException("Cupom não encontrado.");
        repository.delete(cupom);
    }

    @Transactional
    public void alterarEstado(Long id, boolean ativo) {
        Cupom cupom = repository.findById(id);
        if (cupom == null) throw new NotFoundException("Cupom não encontrado.");
        cupom.setAtivo(ativo);
    }

    private void validarCodigoUnico(String codigo, Long idAtual) {
        Cupom existente = repository.findByCodigo(codigo);
        if (existente != null && !existente.getId().equals(idAtual)) {
            throw ValidationException.of("codigo", "Já existe um cupom cadastrado com este código.");
        }
    }

    private void aplicarDtoNaEntidade(Cupom cupom, CupomRequestDTO dto) {
        cupom.setCodigo(dto.codigo());
        cupom.setValor(dto.valor());
        cupom.setTipo(dto.tipo());
        cupom.setDataValidade(dto.dataValidade());
        cupom.setAtivo(dto.ativo());
        cupom.setLimiteUsos(dto.limiteUsos());
        cupom.setValorMinimoPedido(dto.valorMinimoPedido());
    }
}