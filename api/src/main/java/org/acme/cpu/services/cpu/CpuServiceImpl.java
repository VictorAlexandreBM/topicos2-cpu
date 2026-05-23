package org.acme.cpu.services.cpu;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.dto.cpu.*;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.exception.ValidationException;
import org.acme.cpu.models.*;
import org.acme.cpu.repositories.CpuRepository;
import org.acme.cpu.repositories.ModeloCpuRepository;

import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class CpuServiceImpl implements CpuService {

    @Inject
    CpuRepository repository;

    @Inject
    ModeloCpuRepository modeloCpuRepository;

    @Override
    public RespostaPaginadaDTO<CpuListDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean emVenda, String campoOrdenacao, String direcao) {
        List<CpuListDTO> listaCpus = repository.listarResumido(pagina, tamanho, filtro, emVenda, campoOrdenacao, direcao);
        Long quantidade = repository.countListar(filtro, emVenda);
        return new RespostaPaginadaDTO<>(listaCpus, quantidade);
    }

    @Override
    @Transactional
    public CpuDetailDTO criar(CpuRequestDTO dto) {
        validarSkuUnico(dto.sku(), null);

        Cpu cpu = instanciarPeloTipo(dto);
        aplicarDtoNoModelo(cpu, dto);
        cpu.setDataInclusao(LocalDate.now());

        repository.persist(cpu);
        return mapToDetailDto(cpu);
    }

    @Override
    public CpuDetailDTO get(Long id) {
        Cpu cpu = repository.findByIdWithDetails(id);
        if (cpu == null) throw new NotFoundException("CPU não encontrada");
        return mapToDetailDto(cpu);
    }

    @Override
    @Transactional
    public void atualizar(Long id, CpuRequestDTO dto) {
        Cpu cpu = repository.findById(id);
        if (cpu == null) throw new NotFoundException("CPU não encontrada");

        validarSkuUnico(dto.sku(), id);

        validarMudancaDeTipo(cpu, dto);

        aplicarDtoNoModelo(cpu, dto);
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Cpu cpu = repository.findById(id);
        if (cpu == null) throw new NotFoundException("CPU não encontrada");
        repository.delete(cpu);
    }

    @Override
    @Transactional
    public void alterarEstadoVenda(Long id, Boolean estado) {
        Cpu cpu = repository.findById(id);
        if (cpu == null) throw new NotFoundException("CPU não encontrada");
        cpu.setEmVenda(estado);
    }


    private void validarSkuUnico(String sku, Long idAtual) {
        Cpu existente = repository.find("sku", sku).firstResult();
        if (existente != null && !existente.getId().equals(idAtual)) {
            throw ValidationException.of("sku", "Já existe uma CPU cadastrada com este SKU.");
        }
    }

    private void validarMudancaDeTipo(Cpu entidade, CpuRequestDTO dto) {
        if ((entidade instanceof CpuBox && !(dto instanceof CpuBoxRequestDTO)) ||
                (entidade instanceof CpuTray && !(dto instanceof CpuTrayRequestDTO))) {
            throw ValidationException.of("tipo", "Não é permitido alterar o tipo da CPU (BOX/TRAY) após o cadastro.");
        }
    }

    private Cpu instanciarPeloTipo(CpuRequestDTO dto) {
        if (dto instanceof CpuBoxRequestDTO) return new CpuBox();
        if (dto instanceof CpuTrayRequestDTO) return new CpuTray();
        throw new IllegalArgumentException("Tipo de DTO inválido");
    }

    private void aplicarDtoNoModelo(Cpu cpu, CpuRequestDTO dto) {
        cpu.setSku(dto.sku());
        cpu.setPreco(dto.preco());
        cpu.setEstoque(dto.estoque());
        cpu.setEmVenda(dto.emVenda());
        cpu.setNomeComercial(dto.nomeComercial());

        ModeloCpu modelo = modeloCpuRepository.findById(dto.modeloId());
        if (modelo == null) throw ValidationException.of("modeloId", "Modelo de CPU não encontrado");
        cpu.setModelo(modelo);

        if (cpu instanceof CpuBox box && dto instanceof CpuBoxRequestDTO boxDto) {
            box.setIncluiCooler(boxDto.incluiCooler());
            box.setPesoEmbalagemGramas(boxDto.pesoEmbalagemGramas());
        } else if (cpu instanceof CpuTray tray && dto instanceof CpuTrayRequestDTO trayDto) {
            tray.setLoteFabricacao(trayDto.loteFabricacao());
        }
    }

    private CpuDetailDTO mapToDetailDto(Cpu cpu) {
        if (cpu instanceof CpuBox b) return new CpuBoxDetailDTO(b);
        if (cpu instanceof CpuTray t) return new CpuTrayDetailDTO(t);
        return null;
    }
}