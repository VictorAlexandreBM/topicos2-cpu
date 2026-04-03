package org.acme.cpu.services.chipset;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.dto.chipset.ChipsetDTO;
import org.acme.cpu.dto.chipset.ChipsetResponseDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.exception.ValidationException;
import org.acme.cpu.models.Chipset;
import org.acme.cpu.repositories.ChipsetRepository;

import java.util.List;

@ApplicationScoped
public class ChipsetServiceImpl implements ChipsetService {

    @Inject
    ChipsetRepository repository;

    private Chipset getChipsetEntity(Long id) {
        Chipset chipset = repository.findById(id);

        if (chipset == null) {
            throw new NotFoundException("Chipset não encontrado");
        }

        return chipset;
    }

    @Override
    public RespostaPaginadaDTO<ChipsetResponseDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        List<ChipsetResponseDTO> dados = repository.listar(pagina, tamanho, filtro, ativo, campoOrdenacao, direcao)
                .stream()
                .map(ChipsetResponseDTO::new)
                .toList();

        long total = repository.countListar(filtro, ativo);

        return new RespostaPaginadaDTO<>(dados, total);
    }

    @Override
    public ChipsetResponseDTO getById(Long id) {
        return new ChipsetResponseDTO(getChipsetEntity(id));
    }

    @Override
    @Transactional
    public Chipset criar(ChipsetDTO c) {
        Chipset chipset = new Chipset();

        if (repository.buscarAtivaPorTipo(c.tipo()) != null) {
            throw ValidationException.ofConflito("tipo", "Um chipset com este tipo já existe!");
        }

        chipset.setTipo(c.tipo());

        repository.persist(chipset);

        return chipset;
    }

    @Override
    @Transactional
    public void atualizar(Long id, ChipsetDTO c) {

        Chipset chipset = getChipsetEntity(id);

        if (!chipset.getTipo().equals(c.tipo()) && repository.buscarAtivaPorTipo(c.tipo()) != null) {
            throw ValidationException.ofConflito("tipo", "Um chipset com este tipo já existe!");
        }

        chipset.setTipo(c.tipo());
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Chipset chipset = getChipsetEntity(id);

        repository.delete(chipset);
    }

    @Override
    @Transactional
    public void alterarEstado(Long id, Boolean estado) {
        Chipset chipset = getChipsetEntity(id);

        chipset.setAtivo(estado);
    }
}