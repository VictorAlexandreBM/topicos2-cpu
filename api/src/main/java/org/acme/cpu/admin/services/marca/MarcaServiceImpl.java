package org.acme.cpu.admin.services.marca;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.admin.dto.marca.MarcaDTO;
import org.acme.cpu.admin.dto.marca.MarcaResponseDTO;
import org.acme.cpu.core.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.core.exception.ValidationException;
import org.acme.cpu.admin.models.Marca;
import org.acme.cpu.admin.repositories.MarcaRepository;

import java.util.List;

@ApplicationScoped
public class MarcaServiceImpl implements MarcaService {

    @Inject
    MarcaRepository repository;

    private Marca getMarcaEntity(Long id) {
        Marca marca = repository.findById(id);

        if (marca == null) {
            throw new NotFoundException("Marca não encontrada");
        }

        return marca;
    }

    @Override
    public RespostaPaginadaDTO<MarcaResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        List<MarcaResponseDTO> dados = repository.listar(pagina, tamanho, filtro, ativo, campoOrdenacao, direcao)
                .stream()
                .map(MarcaResponseDTO::new)
                .toList();

        long total = repository.countListar(filtro, ativo);

        return new RespostaPaginadaDTO<>(dados, total);
    }

    @Override
    public MarcaResponseDTO getById(Long id) {
        return new MarcaResponseDTO(getMarcaEntity(id));
    }

    @Override
    @Transactional
    public Marca criar(MarcaDTO m) {
        Marca marca = new Marca();

        if (repository.buscarAtivaPorNome(m.nome()) != null) {
            throw ValidationException.ofConflito("nome", "Uma marca com este nome já existe!");
        }

        marca.setNome(m.nome());

        repository.persist(marca);

        return marca;
    }

    @Override
    @Transactional
    public void atualizar(Long id, MarcaDTO m) {

        Marca marca = getMarcaEntity(id);

        if (!marca.getNome().equals(m.nome()) && repository.buscarAtivaPorNome(m.nome()) != null) {
            throw ValidationException.ofConflito("nome", "Uma marca com este nome já existe!");
        }

        marca.setNome(m.nome());
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Marca marca = getMarcaEntity(id);

        repository.delete(marca);
    }

    @Override
    @Transactional
    public void alterarEstado(Long id, Boolean estado) {
        Marca marca = getMarcaEntity(id);

        marca.setAtivo(estado);
    }
}