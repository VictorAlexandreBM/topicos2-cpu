package org.acme.cpu.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.dto.Tecnologia.TecnologiaDTO;
import org.acme.cpu.dto.Tecnologia.TecnologiaResponseDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.exception.ValidationException;
import org.acme.cpu.models.Tecnologia;
import org.acme.cpu.repositories.TecnologiaRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class TecnologiaServiceImpl implements TecnologiaService {

    @Inject
    TecnologiaRepository repository;

    private Tecnologia getTecnologiaEntity(Long id) {
        Tecnologia tecnologia = repository.findById(id);

        if (tecnologia == null) {
            throw new NotFoundException("Tecnologia não encontrada");
        }

        return tecnologia;
    }

    @Override
    public RespostaPaginadaDTO<TecnologiaResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        List<TecnologiaResponseDTO> dados = repository.listar(pagina, tamanho, filtro, ativo, campoOrdenacao, direcao)
                .stream()
                .map(TecnologiaResponseDTO::new)
                .toList();

        long total = repository.countListar(filtro, ativo);

        return new RespostaPaginadaDTO<>(dados, total);
    }

    @Override
    public TecnologiaResponseDTO getById(Long id) {
        return new TecnologiaResponseDTO(getTecnologiaEntity(id));
    }

    @Override
    @Transactional
    public Tecnologia criar(TecnologiaDTO t) {
        Tecnologia tecnologia = new Tecnologia();

        if (repository.buscarAtivaPorNome(t.nome()) != null) {
            throw ValidationException.ofConflito("nome", "Uma tecnologia com este nome já existe!");
        }

        tecnologia.setNome(t.nome());
        tecnologia.setDescricao(t.descricao());

        repository.persist(tecnologia);

        return tecnologia;
    }

    @Override
    @Transactional
    public void atualizar(Long id, TecnologiaDTO t) {

        Tecnologia tecnologia = getTecnologiaEntity(id);

        if (!tecnologia.getNome().equals(t.nome()) && repository.buscarAtivaPorNome(t.nome()) != null) {
            throw ValidationException.ofConflito("nome", "Uma tecnologia com este nome já existe!");
        }

        tecnologia.setNome(t.nome());
        tecnologia.setDescricao(t.descricao());

    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Tecnologia tecnologia = getTecnologiaEntity(id);

        repository.delete(tecnologia);
    }

    @Override
    @Transactional
    public void alterarEstado(Long id, Boolean estado) {
        Tecnologia tecnologia = getTecnologiaEntity(id);

        tecnologia.setAtivo(estado);
    }
}
