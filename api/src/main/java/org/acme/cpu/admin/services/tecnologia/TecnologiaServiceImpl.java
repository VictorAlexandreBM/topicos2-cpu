package org.acme.cpu.admin.services.tecnologia;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.admin.dto.tecnologia.TecnologiaDTO;
import org.acme.cpu.admin.dto.tecnologia.TecnologiaResponseDTO;
import org.acme.cpu.core.dtos.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.core.exception.ValidationException;
import org.acme.cpu.admin.models.Tecnologia;
import org.acme.cpu.admin.repositories.TecnologiaRepository;

import java.util.List;

@ApplicationScoped
public class TecnologiaServiceImpl implements TecnologiaService {

    @Inject
    TecnologiaRepository repository;

    @Inject
    SecurityIdentity securityIdentity;

    private Tecnologia getTecnologiaEntity(Long id) {
        Tecnologia tecnologia = repository.findById(id);

        if (tecnologia == null || (!tecnologia.isAtivo() && !securityIdentity.hasRole("Administrador"))) {
            throw new NotFoundException("Tecnologia não encontrada");
        }

        return tecnologia;
    }

    @Override
    public RespostaPaginadaDTO<TecnologiaResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {

        if (!securityIdentity.hasRole("Administrador")) {
            ativo = true;
        }

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
