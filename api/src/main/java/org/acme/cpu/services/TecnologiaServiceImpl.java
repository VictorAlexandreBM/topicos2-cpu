package org.acme.cpu.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.cpu.dto.Tecnologia.TecnologiaDTO;
import org.acme.cpu.dto.Tecnologia.TecnologiaResponseDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.models.Tecnologia;
import org.acme.cpu.repositories.TecnologiaRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class TecnologiaServiceImpl implements TecnologiaService {

    @Inject
    TecnologiaRepository repository;

    @Override
    public RespostaPaginadaDTO<TecnologiaResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo) {
        List<TecnologiaResponseDTO> dados = repository.listar(pagina, tamanho, filtro, ativo)
                .stream()
                .map(TecnologiaResponseDTO::new)
                .toList();

        long total = repository.countListar(filtro, ativo);

        return new RespostaPaginadaDTO<>(dados, total);
    }

    @Override
    public TecnologiaResponseDTO getById(Long id) {
        return new TecnologiaResponseDTO(repository.findById(id));
    }

    @Override
    @Transactional
    public Tecnologia criar(TecnologiaDTO t) {
        Tecnologia tecnologia = new Tecnologia();

        tecnologia.setNome(t.nome());
        tecnologia.setDescricao(t.descricao());

        repository.persist(tecnologia);

        return tecnologia;
    }

    @Override
    @Transactional
    public void atualizar(Long id, TecnologiaDTO t) {

        Tecnologia tecnologia = repository.findById(id);

        tecnologia.setNome(t.nome());
        tecnologia.setDescricao(t.descricao());

    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Tecnologia tecnologia = repository.findById(id);

        repository.delete(tecnologia);
    }

    @Override
    @Transactional
    public void alterarEstado(Long id, Boolean estado) {
        Tecnologia tecnologia = repository.findById(id);

        tecnologia.setAtivo(estado);
    }
}
