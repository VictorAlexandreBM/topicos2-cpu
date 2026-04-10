package org.acme.cpu.services.modeloCpu;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.dto.modeloCpu.ModeloCpuDetailDTO;
import org.acme.cpu.dto.modeloCpu.ModeloCpuListDTO;
import org.acme.cpu.dto.modeloCpu.ModeloCpuRequestDTO;
import org.acme.cpu.dto.modeloCpu.fichaTecnica.FichaTecnicaRequestDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.exception.ValidationException;
import org.acme.cpu.models.*;
import org.acme.cpu.repositories.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class ModeloCpuServiceImpl implements ModeloCpuService {

    @Inject
    ModeloCpuRepository repository;
    @Inject
    MarcaRepository marcaRepository;
    @Inject
    SocketRepository socketRepository;
    @Inject
    ChipsetRepository chipsetRepositinjectory;
    @Inject
    TecnologiaRepository tecnologiaRepository;

    @Override
    public RespostaPaginadaDTO<ModeloCpuListDTO> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        List<ModeloCpuListDTO> listaModelos = repository.listarResumido(pagina, tamanho, filtro, ativo, campoOrdenacao, direcao);
        Long quantidade = repository.countListar(filtro, ativo);

        return new RespostaPaginadaDTO<>(listaModelos, quantidade);
    }

    private Marca carregarMarcaValida(Long id) {
        Marca marca = marcaRepository.findById(id);
        if (marca == null) {
            throw ValidationException.of("marca", "Elemento não encontrado");
        }
        return marca;
    }

    private Socket carregarSocketValido(Long id) {
        Socket socket = socketRepository.findById(id);
        if (socket == null) {
            throw ValidationException.of("socket", "Elemento não encontrado");
        }
        return socket;
    }

    private Set<Chipset> carregarChipsetsValidos(Set<Long> ids) {
        return ids != null ? ids.stream().map(id -> {
            Chipset chipset = chipsetRepositinjectory.findById(id);
            if (chipset == null) {
                throw ValidationException.of("chipsets", "Algum chipset não foi encontrado");
            }
            return chipset;
        }).collect(Collectors.toSet()) : Set.of();
    }

    private Set<Tecnologia> carregarTecnologiasValidas(Set<Long> ids) {
        return ids != null ? ids.stream().map(id -> {
            Tecnologia tecnologia = tecnologiaRepository.findById(id);
            if (tecnologia == null) {
                throw ValidationException.of("tecnologias", "Alguma tecnologia não foi encontrada");
            }
            return tecnologia;
        }).collect(Collectors.toSet()) : Set.of();
    }

    private FichaTecnica montarFichaTecnica(FichaTecnicaRequestDTO dto) {
        FichaTecnica f = new FichaTecnica();
        if (dto != null) {
            f.setCacheL2MB(dto.cacheL2MB());
            f.setCacheL3MB(dto.cacheL3MB());
            f.setDescricaoComercial(dto.descricaoComercial());
            f.setTdpBaseW(dto.tdpBaseW());
        }
        return f;
    }

    private Set<ClusterNucleo> montarClusters(ModeloCpuRequestDTO dto) {
        return dto.clustersNucleo().stream().map(mDTO -> {
            ClusterNucleo c = new ClusterNucleo();
            c.setFrequenciaBase(mDTO.frequenciaBase());
            c.setFrequenciaMaxima(mDTO.frequenciaMaxima());
            c.setQuantidadeNucleos(mDTO.quantidadeNucleos());
            c.setTipoNucleo(mDTO.tipoNucleo());
            return c;
        }).collect(Collectors.toSet());
    }

    private void aplicarDtoNoModelo(ModeloCpu modelo, ModeloCpuRequestDTO dto) {
        modelo.setNome(dto.nome());
        modelo.setMarca(carregarMarcaValida(dto.marcaId()));
        if (dto.socketId() != null) {
            modelo.setSocket(carregarSocketValido(dto.socketId()));
        } else {
            modelo.setSocket(null);
        }
        modelo.setChipsets(carregarChipsetsValidos(dto.chipsetIds()));
        modelo.setTecnologias(carregarTecnologiasValidas(dto.tecnologiaIds()));
        modelo.setFichaTecnica(montarFichaTecnica(dto.fichaTecnica()));
        modelo.setClustersNucleo(montarClusters(dto));
    }

    @Override
    @Transactional
    public ModeloCpuDetailDTO criar(ModeloCpuRequestDTO modeloDTO){
        ModeloCpu modelo = new ModeloCpu();
        aplicarDtoNoModelo(modelo, modeloDTO);
        repository.persist(modelo);
        ModeloCpu modeloCriadoDetail = repository.findByIdWithDetails(modelo.getId());
        return new ModeloCpuDetailDTO(modeloCriadoDetail);
    }

    @Override
    public ModeloCpuDetailDTO get(Long id) {
        ModeloCpu modelo = repository.findByIdWithDetails(id);
        if (modelo == null) {
            throw new NotFoundException("Modelo não encontrado");
        }
        return new ModeloCpuDetailDTO(modelo);
    }

    @Override
    @Transactional
    public void atualizar(Long id, ModeloCpuRequestDTO modeloDTO) {
            ModeloCpu modelo = repository.findById(id);
            if (modelo == null) {
                throw new NotFoundException("Modelo não encontrado");
            }
            aplicarDtoNoModelo(modelo, modeloDTO);
            ModeloCpu atualizado = repository.findByIdWithDetails(id);
        }

        private ModeloCpu getModeloEntity(Long id) {
            ModeloCpu modelo = repository.findById(id);
            if (modelo == null) {
                throw new NotFoundException("Modelo não encontrado");
            }
            return modelo;
        }

        @Override
        @Transactional
        public void deletar(Long id) {
            ModeloCpu modelo = getModeloEntity(id);
            repository.delete(modelo);
        }

        @Override
        @Transactional
        public void alterarEstado(Long id, Boolean estado) {
            ModeloCpu modelo = getModeloEntity(id);
            modelo.setAtivo(estado);
        }
    }
